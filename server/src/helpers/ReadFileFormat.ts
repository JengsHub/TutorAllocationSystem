class ReadFileFormat {
  /*
  description:
  this class keeps the file read formats to be used for importing files features
  */
  formats: String[];

  constructor() {
    //initial formats
    this.formats = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
  }

  getFormats(): String[] {
    return this.formats;
  }

  findIndex(item: string) {
    return this.formats.indexOf(item);
  }

  addFileFormat(item: string) {
    this.formats.push(item);
  }

  removeFileFormat(index: number) {
    this.formats.splice(index, 1);
  }
}
export default ReadFileFormat;
