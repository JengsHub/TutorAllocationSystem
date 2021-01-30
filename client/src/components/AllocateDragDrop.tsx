import { Button, Grid } from "@material-ui/core";
import React, { Component } from "react";
import baseApi from "../apis/baseApi";
import ReadFileFormat from "../services/ReadFileFormat";
import { Props, State } from "../type";
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import "./styles/DragDrop.css";

/*
this file puts together the drag and drop componenet for the Allocate+ Section
from Component(react), ReadfileFormat, and DragDropPresentation
*/
class AllocateDragDrop extends Component<Props, State> {
  //initializer to accept file types.
  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  allocateList: any[] = [[]];
  fileFormats: ReadFileFormat = new ReadFileFormat();
  readonly validTypes: String[];
  inputCsvFile: File = new File(["foo"], "placeholder.txt");

  //constructor:
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
    // listener for the drag feature interrupt
    this.overrideEventDefaults(event);
    this.dragEventCounter--;

    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    //drop listener to indicate a file upload to the allocate file slot
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
        this.inputCsvFile = event.dataTransfer.files[0];
      }
    }
  };

  obtainResult = (results: any) => {
    //move the data of the file to allocateList
    this.allocateList = results.data;
  };

  getEndTime = (start: Date, minutes: string) => {
    //get the time and format it
    return new Date(start.getTime() + Number(minutes) * 60000);
  };

  minLeadZeros = (date: Date) => {
    //format minutes :0N" if N is less than 10
    return (date.getMinutes() < 10 ? "0" : "") + date.getMinutes().toString();
  };

  //asyncrhize function to upload the data from a file
  uploadData = async () => {
    try {
      const formData = new FormData();
      formData.append("allocate", this.inputCsvFile);
      await baseApi.post("/upload/allocate", formData);
    } catch (error) {
      throw error;
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

  //override:
  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  //if file changes:
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
        this.inputCsvFile = event.target.files[0];
      }
    }
  };

  //if file is clicked:
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

  //render the UI components:
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
