import { Button, Grid } from "@material-ui/core";
import React, { Component } from "react";
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import "./styles/DragDrop.css";
import ReadFileFormat from "../services/ReadFileFormat";

// yarn add csv-parser
import axios from "axios";

class TasDragDrop extends Component<Props, State> {
  static counter = 0;
  fileUploaderInput: HTMLElement | null = null;
  allocateList: any[] = [[]];
  fileFormats: ReadFileFormat = new ReadFileFormat();
  readonly validTypes: String[];
  csvFile: File = new File(["foo"], "placeholder.txt");

  constructor(props: Props) {
    super(props);
    this.state = { dragging: false, file: null };
    this.validTypes = this.fileFormats.getFormats();
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
        this.csvFile = event.dataTransfer.files[0];
      }
    }
  };

  obtainResult = (results: any) => {
    this.allocateList = results.data;
    console.log("obtain result: " + this.allocateList.toString());
  };

  getEndTime = (start: Date, minutes: string) => {
    return new Date(start.getTime() + Number(minutes) * 60000);
  };

  uploadData = async () => {
    // // Send file to the backend when upload is CHOSEN
    try {
      const formData = new FormData();
      formData.append("tas", this.csvFile);
      console.log(this.csvFile);
      await axios.post("http://localhost:8888/upload/tas", formData);
    } catch (err) {
      throw err;
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
        this.csvFile = event.target.files[0];
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
