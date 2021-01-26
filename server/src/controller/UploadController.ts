import csv from "csv-parser";
import { FileArray, UploadedFile } from "express-fileupload";
import fs from "fs";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import ProcessFileService, {
  mapRawAllocateFile,
  mapRawTasFile,
  mapRawTpsFile,
} from "~/helpers/processInputFiles";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class UploadControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IUploadController {
    switch (role) {
      case RoleEnum.TA:
        return new TaUploadController();
      case RoleEnum.LECTURER:
        return new LecturerUploadController();
      case AppRoleEnum.ADMIN:
        return new AdminUploadController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IUploadController {
  uploadTas(files: FileArray): any;
  uploadTps(files: FileArray): any;
  uploadAllocate(files: FileArray): any;
}

class TaUploadController implements IUploadController {
  uploadTas(files: FileArray) {
    return new UnauthorisedAccessedError("TAs cannot upload TAS files");
  }

  uploadTps(files: FileArray) {
    return new UnauthorisedAccessedError("TAs cannot upload TPS files");
  }

  uploadAllocate(files: FileArray) {
    return new UnauthorisedAccessedError("TAs cannot upload Allocate+ files");
  }
}

class LecturerUploadController implements IUploadController {
  uploadTas(files: FileArray) {
    return new UnauthorisedAccessedError("Lecturers cannot upload TAS files");
  }

  uploadTps(files: FileArray) {
    return new UnauthorisedAccessedError("Lecturers cannot upload TPS files");
  }

  uploadAllocate(files: FileArray) {
    return new UnauthorisedAccessedError(
      "Lecturers cannot upload Allocate+ files"
    );
  }
}

class AdminUploadController implements IUploadController {
  uploadTas(files: FileArray) {
    const path = (files.tas as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        // map the raw row into a an tas object that matches the system's convention
        const tasRow = mapRawTasFile(row);
        processFileService.processTasObject(tasRow);
      })
      .on("end", () => {
        console.log("TAS CSV file successfully processed");
      });
  }

  uploadTps(files: FileArray) {
    const path = (files.tps as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        // map the raw row into an tps object
        const tpsRow = mapRawTpsFile(row);
        processFileService.processTpsObject(tpsRow);
      })
      .on("end", () => {
        console.log("TPS CSV file successfully processed");
      });
  }

  uploadAllocate(files: FileArray) {
    const path = (files.allocate as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        let allocateRow = mapRawAllocateFile(row);
        processFileService.processAllocateObject(allocateRow);
      })
      .on("end", () => {
        console.log("Allocate CSV file successfully processed");
      });
  }
}
