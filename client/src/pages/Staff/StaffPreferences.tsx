import React, { useEffect, useState } from "react";
import { getStaffPreference } from "../../apis/api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { IPreference } from "../../type";

//this is where the staff preference for each unit is shown and handled 

interface IStaffPreferencesProps {
  staffId: string;
}

const StaffPreferences: React.FC<IStaffPreferencesProps> = ({ staffId }) => {
  const [staffPreferences, setStaffPreferences] = useState<IPreference[]>([]);

  useEffect(() => {
    if (staffId) {
      getStaffPreference(staffId).then((res) => {
        setStaffPreferences(res);
      });
    }
  }, [staffId]);

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className="grid" size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Unit Code</StyledTableCell>
              <StyledTableCell align="left">Offering period</StyledTableCell>
              <StyledTableCell align="left">Year</StyledTableCell>
              <StyledTableCell align="left">Campus</StyledTableCell>
              <StyledTableCell align="left">Preference Score</StyledTableCell>
              <StyledTableCell align="left">Lecturer Score</StyledTableCell>
              <StyledTableCell align="left">
                Head Tutor Candidate
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffPreferences.map((staffPreference, i) => (
              <TableRow key={i}>
                <TableCell align="left">
                  {staffPreference.unit.unitCode}
                </TableCell>
                <TableCell align="left">
                  {staffPreference.unit.offeringPeriod}
                </TableCell>
                <TableCell align="left">{staffPreference.unit.year}</TableCell>
                <TableCell align="left">
                  {staffPreference.unit.campus}
                </TableCell>
                <TableCell align="left">
                  {staffPreference.preferenceScore}
                </TableCell>
                <TableCell align="left">
                  {staffPreference.lecturerScore}
                </TableCell>
                <TableCell align="left">
                  {staffPreference.isHeadTutorCandidate ? "YES" : "NO"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StaffPreferences;
