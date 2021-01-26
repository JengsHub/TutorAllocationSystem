import React, { useEffect, useState } from "react";
import { getAvailability } from "../../apis/api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface IAvailabilitiesProps {
  staffId: string;
}

interface IAvailabilities {
  M: IAvailability[];
  T: IAvailability[];
  W: IAvailability[];
  Th: IAvailability[];
  F: IAvailability[];
}

const Availabilities: React.FC<IAvailabilitiesProps> = ({ staffId }) => {
  const [availabilities, setAvailabilities] = useState<IAvailabilities>({
    M: [],
    T: [],
    W: [],
    Th: [],
    F: [],
  });

  useEffect(() => {
    if (staffId) {
      getAvailability(staffId, "2020").then((res) => {
        setAvailabilities(res);
      });
    }
  }, [staffId]);

  function timeString(availabilities: IAvailability[]) {
    let retVal = "";
    availabilities.forEach((availability, i) => {
      retVal += availability.startTime + " - " + availability.endTime;
      if (i < availabilities.length - 1) {
        retVal += ", ";
      }
    });

    return retVal;
  }
  return (
    <div>
      {/* {availabilities.length > 0 ? (
        <h4>
          Max hours:{availabilities[0].maxHours} Max activities:
          {availabilities[0].maxNumberActivities}
        </h4>
      ) : (
        <h4>Max hours: Max activities: </h4>
      )} */}
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Day</TableCell>
              <TableCell align="left">Availabilities</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">Monday</TableCell>
              {availabilities.M.length > 0 ? (
                <TableCell align="left">
                  {timeString(availabilities.M)}
                </TableCell>
              ) : (
                <TableCell align="left">None</TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell align="left">Tuesday</TableCell>
              {availabilities.T.length > 0 ? (
                <TableCell align="left">
                  {timeString(availabilities.T)}
                </TableCell>
              ) : (
                <TableCell align="left">None</TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell align="left">Wednesday</TableCell>
              {availabilities.W.length > 0 ? (
                <TableCell align="left">
                  {timeString(availabilities.W)}
                </TableCell>
              ) : (
                <TableCell align="left">None</TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell align="left">Thursday</TableCell>
              {availabilities.Th.length > 0 ? (
                <TableCell align="left">
                  {timeString(availabilities.Th)}
                </TableCell>
              ) : (
                <TableCell align="left">None</TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell align="left">Friday</TableCell>
              {availabilities.F.length > 0 ? (
                <TableCell align="left">
                  {timeString(availabilities.F)}
                </TableCell>
              ) : (
                <TableCell align="left">None</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Availabilities;
