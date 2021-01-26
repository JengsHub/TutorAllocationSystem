import React, { useEffect, useState } from "react";
import { getAvailability } from "../../apis/api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

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

  function getMaxActivityAndHours(avalabilities: IAvailabilities) {
    let maxHours;
    let maxActivities;
    if (availabilities.M.length > 0) {
      maxHours = availabilities.M[0].maxHours;
      maxActivities = availabilities.M[0].maxNumberActivities;
    } else if (availabilities.T.length > 0) {
      maxHours = availabilities.T[0].maxHours;
      maxActivities = availabilities.T[0].maxNumberActivities;
    } else if (availabilities.W.length > 0) {
      maxHours = availabilities.W[0].maxHours;
      maxActivities = availabilities.W[0].maxNumberActivities;
    } else if (availabilities.Th.length > 0) {
      maxHours = availabilities.Th[0].maxHours;
      maxActivities = availabilities.Th[0].maxNumberActivities;
    } else if (availabilities.F.length > 0) {
      maxHours = availabilities.F[0].maxHours;
      maxActivities = availabilities.F[0].maxNumberActivities;
    } else {
      maxHours = "N/A";
      maxActivities = "N/A";
    }
    return (
      <h4>
        Maximum Hours: {maxHours}
        <br></br>Maximum Activities: {maxActivities}
      </h4>
    );
  }

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  return (
    <div>
      {getMaxActivityAndHours(availabilities)}
      <TableContainer component={Paper}>
        <Table className="grid" size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Day</StyledTableCell>
              <StyledTableCell align="left">Availabilities</StyledTableCell>
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
