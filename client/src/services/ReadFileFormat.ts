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

  //getters
  getFormats(): String[] {
    return this.formats;
  }

  //search aray and return index
  findIndex(item: string) {
    return this.formats.indexOf(item);
  }

  //add file fomrats to the list
  addFileFormat(item: string) {
    this.formats.push(item);
  }

  //remove file formats from the list
  removeFileFormat(index: number) {
    this.formats.splice(index, 1);
  }
}
export default ReadFileFormat;
