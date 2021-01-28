import React from "react";
import { PresentationalProps } from "../type";

const FileUploaderPresentationalComponent: React.FC<PresentationalProps> = (
  props
) => {
  const {
    dragging,
    file,
    onDrag,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
  } = props;

  let uploaderClasses = "file-uploader";
  if (dragging) {
    uploaderClasses += " file-uploader--dragging";
  }

  const fileName = file ? file.name : "No File Uploaded!";

  return (
    <div
      className={uploaderClasses}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="file-uploader__contents">
        <span className="file-uploader__file-name">{fileName}</span>
        <p>
          Drag & Drop File<br></br>or<br></br>Select File
        </p>
      </div>
      {props.children}
    </div>
  );
};

export default FileUploaderPresentationalComponent;
