import React, { Component } from "react";
import "./styles/DragDrop.css";
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import Papa from "papaparse";
import { Button, Grid } from "@material-ui/core";
import DatabaseFinder from "../apis/DatabaseFinder";
import { DayOfWeek } from "../enums/DayOfWeek";

// yarn add csv-parser

class TasDragDrop extends Component<Props, State> {
  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  allocateList: any[] = [[]];
  readonly validTypes: String[] = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  constructor(props: Props) {
    super(props);
    this.state = { dragging: false, file: null };
  }

  dragEventCounter: number = 0;
  dragenterListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      this.setState({ dragging: true });
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === "Files"
    ) {
      // This block handles support for IE - if you're not worried about
      // that, you can omit this
      this.setState({ dragging: true });
    }
  };

  dragleaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter--;

    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter = 0;
    this.setState({ dragging: false });
    this.hideSuccess();

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (this.validTypes.indexOf(event.dataTransfer.files[0].type) === -1) {
        console.log("not accepted file");
        // have to prompt user here
      } else {
        this.setState({ file: event.dataTransfer.files[0] });
        Papa.parse(event.dataTransfer.files[0], {
          complete: this.obtainResult,
        });
      }
    }
  };

  obtainResult = (results: any) => {
    this.allocateList = results.data;
    console.log(this.allocateList);
  };

  uploadData = async () => {
    let tempList: string[] = this.allocateList[0];
    let unit_object: any;
    let staff_object: any;
    let activity_object: any;
    for (let i = 1; i < this.allocateList.length; i++) {
      var unit: Units = {
        unitCode: this.allocateList[i][tempList.indexOf("Subject")],
        offeringPeriod: this.allocateList[i][
          tempList.indexOf("Subject Code")
        ].slice(11, 13),
        campus: this.allocateList[i][tempList.indexOf("Campus")],
        year: 2020,
        aqfTarget: 0,
      };
      try {
        unit_object = await DatabaseFinder.post("/units", unit);
        // console.log(unit_object)
      } catch (err) {
        throw err;
      }

      let name: string[] = this.allocateList[i][
        tempList.indexOf("Tutor")
      ].split(" ");
      let studyAqf: number =
        isNaN(Number(this.allocateList[i][tempList.indexOf("Tutor AQF")])) ===
        true
          ? 0
          : Number(this.allocateList[i][tempList.indexOf("Tutor AQF")]);
      var staffDetail: Staff = {
        givenNames: name[0],
        lastName: name[1],
        aqf: studyAqf,
        studyingAqf: 0,
        email: this.allocateList[i][tempList.indexOf("Email")],
      };
      try {
        staff_object = await DatabaseFinder.post("/staff", staffDetail);
        // console.log(staff_object)
      } catch (err) {
        throw err;
      }

      // Lecture pref could have decimals so we might need to modify database type
      let headCandidiate: boolean =
        this.allocateList[i][tempList.indexOf("Head tutor")] === 1
          ? true
          : false;
      var staffPreference: StaffPreference = {
        preferenceScore: Math.floor(
          Number(this.allocateList[i][tempList.indexOf("Tutor pref")])
        ),
        lecturerScore: Math.floor(
          Number(this.allocateList[i][tempList.indexOf("Lecturer pref")])
        ),
        isHeadTutorCandidate: headCandidiate,
        staffId: staff_object["data"]["id"],
        unitId: unit_object["data"]["id"],
      };
      try {
        const response = await DatabaseFinder.post(
          "/staffpreferences",
          staffPreference
        );
        // console.log(response)
      } catch (err) {
        throw err;
      }

      let DOW: DayOfWeek[] = [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
      ];
      let dayStr: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      var activity: Activity = {
        activityCode: this.allocateList[i][tempList.indexOf("Activity Code")],
        activityGroup: this.allocateList[i][tempList.indexOf("Activity Group")],
        campus: this.allocateList[i][tempList.indexOf("Campus")],
        location: this.allocateList[i][tempList.indexOf("Location")],
        duration: Number(this.allocateList[i][tempList.indexOf("Duration")]),
        dayOfWeek:
          DOW[dayStr.indexOf(this.allocateList[i][tempList.indexOf("Day")])],
        startTime: this.allocateList[i][tempList.indexOf("Time")],
        unitId: unit_object["data"]["id"],
      };
      try {
        activity_object = await DatabaseFinder.post("/activities", activity);
        // console.log(activity_object)
      } catch (err) {
        throw err;
      }

      var allocation: Allocation = {
        activityId: activity_object["data"]["id"],
        staffId: staff_object["data"]["id"],
      };
      try {
        const response = await DatabaseFinder.post("/allocations", allocation);
        // console.log(response)
      } catch (err) {
        throw err;
      }
    }
    this.showSuccess();
  };

  showSuccess = () => {
    document.getElementById("TAS_fb")!.style.visibility = "visible";
  };

  hideSuccess = () => {
    document.getElementById("TAS_fb")!.style.visibility = "hidden";
  };

  clearField = () => {
    this.hideSuccess();
    this.setState({ file: null });
    this.fileUploaderInput = null;
    const inputElement: HTMLInputElement = document.getElementById(
      "input_1"
    ) as HTMLInputElement;
    inputElement.value = "";
  };

  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.hideSuccess();
    if (event.target.files && event.target.files[0]) {
      this.setState({ file: event.target.files[0] });
    }
    if (event.target.files && event.target.files[0]) {
      if (this.validTypes.indexOf(event.target.files[0].type) === -1) {
        console.log("not accepted file");
        // have to prompt user here
      } else {
        this.setState({ file: event.target.files[0] });
        Papa.parse(event.target.files[0], {
          complete: this.obtainResult,
        });
      }
    }
  };

  onFileClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    element.value = "";
    this.hideSuccess();
  };

  componentDidMount() {
    window.addEventListener("dragover", (event: Event) => {
      this.overrideEventDefaults(event);
    });
    window.addEventListener("drop", (event: Event) => {
      this.overrideEventDefaults(event);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("dragover", this.overrideEventDefaults);
    window.removeEventListener("drop", this.overrideEventDefaults);
  }

  render() {
    return (
      <div className="Dragdrop">
        <h2>TAS Uploader</h2>
        <FileUploaderPresentationalComponent
          dragging={this.state.dragging}
          file={this.state.file}
          onDrag={this.overrideEventDefaults}
          onDragStart={this.overrideEventDefaults}
          onDragEnd={this.overrideEventDefaults}
          onDragOver={this.overrideEventDefaults}
          onDragEnter={this.dragenterListener}
          onDragLeave={this.dragleaveListener}
          onDrop={this.dropListener}
        >
          <Grid container justify="flex-end">
            <input
              id="input_1"
              ref={(el) => (this.fileUploaderInput = el)}
              type="file"
              className="file-uploader__input"
              onChange={this.onFileChanged}
              accept=".csv"
              onClick={this.onFileClick}
            />
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Button
              className="clear_button"
              id="Sbutton"
              variant="contained"
              onClick={this.clearField}
              type="button"
            >
              Clear
            </Button>
            <Button
              className="submit_button"
              id="Sbutton2"
              variant="contained"
              onClick={this.uploadData}
              type="button"
            >
              Submit
            </Button>
          </Grid>
          <div>
            <h3 className="success_feedback" id="TAS_fb">
              TAS file uploaded!
            </h3>
          </div>
        </FileUploaderPresentationalComponent>
      </div>
    );
  }
}

export default TasDragDrop;
