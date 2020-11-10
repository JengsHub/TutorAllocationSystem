import React, {Component} from 'react';
import "./styles/DragDrop.css"
import FileUploaderPresentationalComponent from "./DragDropPresentation";
import Papa from "papaparse";
import {Button, Grid} from '@material-ui/core';

// npm install -g browserify
// yarn add csv-parser
  
class AllocateDragDrop extends Component<Props, State> {
    static counter = 0;
    fileUploaderInput: HTMLElement | null = null;
    allocateList: any[] =[[]];
    readonly validTypes: String[] = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

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

      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
          if (this.validTypes.indexOf(event.dataTransfer.files[0].type) === -1){
              console.log("not accepted file")
              // have to prompt user here
          }
          else{
            this.setState({ file: event.dataTransfer.files[0] });
            Papa.parse(event.dataTransfer.files[0], {
                complete: this.obtainResult
            });
          }
      }
    };
    
    obtainResult = (results: any) => {
        this.allocateList = results.data;
        console.log(this.allocateList)
    };

    clearField = () => {
        this.setState({ file:null });
        this.fileUploaderInput = null;
        const inputElement: HTMLInputElement = document.getElementById('input_2') as HTMLInputElement;
        inputElement.value = "";
    }

    overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        this.setState({ file: event.target.files[0] });
      }
      if (event.target.files && event.target.files[0]) {
        if (this.validTypes.indexOf(event.target.files[0].type) === -1){
            console.log("not accepted file")
            // have to prompt user here
        }
        else{
          this.setState({ file: event.target.files[0] });
          Papa.parse(event.target.files[0], {
              complete: this.obtainResult
          });
        }
      }
    };

    onFileClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element:HTMLInputElement = event.target as HTMLInputElement
        element.value ="";
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
            <h2>
                Allocate+ Uploader
            </h2>
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
                ref={el => (this.fileUploaderInput = el)}
                type="file"
                className="file-uploader__input"
                onChange={this.onFileChanged}
                accept=".csv"
                onClick={this.onFileClick}
            />
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
            <Button className="submit_button" id="Sbutton3" variant="contained" onClick={this.clearField} type="button">Clear</Button>
            <Button className="submit_button" id="Sbutton4" variant="contained" type="button">Submit</Button>
            </Grid>
            </FileUploaderPresentationalComponent>
        </div>
      );
    }
  }

export default AllocateDragDrop;