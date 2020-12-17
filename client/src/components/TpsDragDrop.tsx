import { Button, Grid } from "@material-ui/core";
import Papa from "papaparse";
import React, { Component } from "react";
import DatabaseFinder from "../apis/DatabaseFinder";
import { DayOfWeek } from "../enums/DayOfWeek";
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import "./styles/DragDrop.css";
import cleanInputData from "../services/DataSanitizer";

// npm install -g browserify
// yarn add csv-parser

class TpsDragDrop extends Component<Props, State> {
  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  allocateList: any[] = [[]];
  readonly validTypes: String[] = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
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

    for (let i = 1; i < this.allocateList.length; i++) {
      var unit: Units = {
        unitCode: this.allocateList[i][tempList.indexOf("unit")].slice(0, 7),
        offeringPeriod: this.allocateList[i][tempList.indexOf("unit")].slice(7),
        campus: this.allocateList[i][tempList.indexOf("campus")],
        year: 2020,
        aqfTarget: Number(
          this.allocateList[i][tempList.indexOf("unit aqf target")]
        ),
      };
      console.log("unit", unit, "i", i, this.allocateList.length);
      unit = cleanInputData(unit);
      try {
        unit_object = await DatabaseFinder.post("/units", unit);
        // console.log(unit_object)
      } catch (err) {
        throw err;
      }

      let name: string[] = this.allocateList[i][tempList.indexOf("name")].split(
        " "
      );
      let studyAqf: number =
        isNaN(
          Number(this.allocateList[i][tempList.indexOf("tutors studying aqf")])
        ) === true
          ? 0
          : Number(
              this.allocateList[i][tempList.indexOf("tutors studying aqf")]
            );
      var staffDetail: Staff = {
        givenNames: name[0],
        lastName: name[1],
        aqf: Number(this.allocateList[i][tempList.indexOf("tutors aqf")]),
        studyingAqf: studyAqf,
        email: this.allocateList[i][tempList.indexOf("email")],
      };
      try {
        staff_object = await DatabaseFinder.post("/staff", staffDetail);
        // console.log(staff_object)
      } catch (err) {
        throw err;
      }

      // have to check for unit id and staf id in the future, works now as eveything is unique
      let headCandidiate: boolean =
        this.allocateList[i][tempList.indexOf("head tutor cand?")] === 1
          ? true
          : false;
      var staffPreference: StaffPreference = {
        preferenceScore: Number(
          this.allocateList[i][tempList.indexOf("tutors pref")]
        ),
        lecturerScore: Number(
          this.allocateList[i][tempList.indexOf("lec suitability")]
        ),
        isHeadTutorCandidate: headCandidiate,
        staffId: staff_object["data"]["id"],
        unitId: unit_object["data"]["id"],
      };
      try {
        await DatabaseFinder.post("/staffpreferences", staffPreference);
        // console.log(response)
      } catch (err) {
        throw err;
      }

      // needs to check if M end/start has N/A
      let startEnd: string[] = [
        "M start",
        "M end",
        "T start",
        "T end",
        "W start",
        "W end",
        "Th start",
        "Th end",
        "F start",
        "F end",
      ];
      let DOW: DayOfWeek[] = [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
      ];

      for (let j = 0; j < startEnd.length; j += 2) {
        let start: string = this.allocateList[i][tempList.indexOf(startEnd[j])];
        let end: string = this.allocateList[i][
          tempList.indexOf(startEnd[j + 1])
        ];
        start = start.slice(0, -2) + ":" + start.slice(-2);
        end = end.slice(0, -2) + ":" + end.slice(-2);

        var availability: Availability = {
          day: DOW[j / 2],
          startTime: start,
          endTime: end,
          year: 2020,
          maxHours: Number(this.allocateList[i][tempList.indexOf("max hr")]),
          maxNumberActivities: Number(
            this.allocateList[i][
              tempList.indexOf("lecturer_override min classes")
            ]
          ),
          staffId: staff_object["data"]["id"],
        };
        try {
          await DatabaseFinder.post("/availabilities", availability);
        } catch (err) {
          throw err;
        }
      }
    }
    this.showSuccess();
  };

  showSuccess = () => {
    document.getElementById("TPS_fb")!.style.visibility = "visible";
  };

  hideSuccess = () => {
    document.getElementById("TPS_fb")!.style.visibility = "hidden";
  };

  clearField = () => {
    this.hideSuccess();
    this.setState({ file: null });
    this.fileUploaderInput = null;
    const inputElement: HTMLInputElement = document.getElementById(
      "input_3"
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
        <h2>TPS Uploader</h2>
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
              id="input_3"
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
              id="Sbutton5"
              variant="contained"
              onClick={this.clearField}
              type="button"
            >
              Clear
            </Button>
            <Button
              className="submit_button"
              id="Sbutton6"
              variant="contained"
              onClick={this.uploadData}
              type="button"
            >
              Submit
            </Button>
          </Grid>
          <div>
            <h3 className="success_feedback" id="TPS_fb">
              TPS file uploaded!
            </h3>
          </div>
        </FileUploaderPresentationalComponent>
      </div>
    );
  }
}

export default TpsDragDrop;
