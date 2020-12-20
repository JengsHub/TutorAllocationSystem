import { Button, Grid } from "@material-ui/core";
import Papa from "papaparse";
import React, { Component } from "react";
import DatabaseFinder from "../apis/DatabaseFinder";
import { DayOfWeek } from "../enums/DayOfWeek";
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import "./styles/DragDrop.css";
import cleanInputData from "../services/DataSanitizer";
import ReadFileFormat from "../services/ReadFileFormat";

//dependencies:
// npm install -g browserify
// yarn add csv-parser

class AllocateDragDrop extends Component<Props, State> {
  //initialzier to accept file types.
  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  allocateList: any[] = [[]];
  fileFormats: ReadFileFormat = new ReadFileFormat();
  readonly validTypes: String[];

  constructor(props: Props) {
    super(props);
    this.state = { dragging: false, file: null };
    this.validTypes = this.fileFormats.getFormats();
  }

  dragEventCounter: number = 0;
  // listener for the drag feature to allocate files slot
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

  //drop listener to indicate a file upload to the allocate file slot
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

  //
  obtainResult = (results: any) => {
    //move the data od the file to allocateList
    this.allocateList = results.data;
    //for debugging:
    console.log(this.allocateList);
  };

  getEndTime = (start: Date, minutes: string) => {
    return new Date(start.getTime() + Number(minutes) * 60000);
  };

  minLeadZeros = (date: Date) => {
    return (date.getMinutes() < 10 ? "0" : "") + date.getMinutes().toString();
  };

  //asyncrhize function to upload the data from a file
  uploadData = async () => {
    let tempList: string[] = this.allocateList[0];
    let unit_object: any;

    for (let i = 1; i < this.allocateList.length; i++) {
      var unit: Units = {
        unitCode: this.allocateList[i][tempList.indexOf("subject_code")].slice(
          0,
          7
        ),
        offeringPeriod: this.allocateList[i][
          tempList.indexOf("subject_code")
        ].slice(11, 13),
        campus: this.allocateList[i][tempList.indexOf("campus")],
        year: 2020,
        aqfTarget: 0,
      };
      unit = cleanInputData(unit);
      try {
        unit_object = await DatabaseFinder.post("/units", unit);
        // console.log(unit_object)
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
      let startHour: Date = new Date();
      startHour.setHours(
        Number(this.allocateList[i][tempList.indexOf("start_time")].slice(0, 2))
      );
      startHour.setMinutes(
        Number(this.allocateList[i][tempList.indexOf("start_time")].slice(3, 5))
      );
      var activity: Activity = {
        activityCode: this.allocateList[i][tempList.indexOf("activity_code")],
        activityGroup: this.allocateList[i][
          tempList.indexOf("activity_group_code")
        ],
        campus: this.allocateList[i][tempList.indexOf("campus")],
        location: this.allocateList[i][tempList.indexOf("location")],
        endTime:
          this.getEndTime(
            startHour,
            this.allocateList[i][tempList.indexOf("duration")]
          )
            .getHours()
            .toString() +
          ":" +
          this.minLeadZeros(
            this.getEndTime(
              startHour,
              this.allocateList[i][tempList.indexOf("duration")]
            )
          ),
        dayOfWeek:
          DOW[
            dayStr.indexOf(
              this.allocateList[i][tempList.indexOf("day_of_week")]
            )
          ],
        startTime: this.allocateList[i][tempList.indexOf("start_time")],
        unitId: unit_object["data"]["id"],
      };
      try {
        await DatabaseFinder.post("/activities", activity);
      } catch (err) {
        throw err;
      }

      let staff_in_charge: string = this.allocateList[i][
        tempList.indexOf("staff")
      ];
      if (staff_in_charge !== "-") {
        // Prob gotta get the id of staff using name here but unable to do so with current api
        // Then create a new allocation with activity_id and staff_id
      }
    }
    this.showSuccess();
  };

  //success message
  showSuccess = () => {
    document.getElementById("Allocate_fb")!.style.visibility = "visible";
  };

  //hide the success message
  hideSuccess = () => {
    document.getElementById("Allocate_fb")!.style.visibility = "hidden";
  };

  //clearing
  clearField = () => {
    this.hideSuccess();
    this.setState({ file: null });
    this.fileUploaderInput = null;
    const inputElement: HTMLInputElement = document.getElementById(
      "input_2"
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

  //render the ui components:
  render() {
    return (
      <div className="Dragdrop">
        <h2>Allocate+ Uploader</h2>
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
              id="input_2"
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
              id="Sbutton3"
              variant="contained"
              onClick={this.clearField}
              type="button"
            >
              Clear
            </Button>
            <Button
              className="submit_button"
              id="Sbutton4"
              variant="contained"
              onClick={this.uploadData}
              type="button"
            >
              Submit
            </Button>
          </Grid>
          <div>
            <h3 className="success_feedback" id="Allocate_fb">
              Allocate file uploaded!
            </h3>
          </div>
        </FileUploaderPresentationalComponent>
      </div>
    );
  }
}

export default AllocateDragDrop;
