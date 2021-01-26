import React, { useEffect, useState } from "react";
import { getStaffPreference } from "../../apis/api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface IStaffPreferencesProps {
  staffId: string;
}

const StaffPreferences: React.FC<IStaffPreferencesProps> = ({ staffId }) => {
  const [staffPreferences, setStaffPreferences] = useState<IPreferences[]>([]);

  useEffect(() => {
    if (staffId) {
      getStaffPreference(staffId).then((res) => {
        setStaffPreferences(res);
      });
    }
  }, [staffId]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Unit Code</TableCell>
              <TableCell align="right">Offering period</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Campus</TableCell>
              <TableCell align="right">Preference Score</TableCell>
              <TableCell align="right">Lecturer Score</TableCell>
              <TableCell align="right">Head Tutor Candidate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffPreferences.map((staffPreference) => (
              <TableRow>
                <TableCell align="left">
                  {staffPreference.unit.unitCode}
                </TableCell>
                <TableCell align="right">
                  {staffPreference.unit.offeringPeriod}
                </TableCell>
                <TableCell align="right">{staffPreference.unit.year}</TableCell>
                <TableCell align="right">
                  {staffPreference.unit.campus}
                </TableCell>
                <TableCell align="right">
                  {staffPreference.preferenceScore}
                </TableCell>
                <TableCell align="right">
                  {staffPreference.lecturerScore}
                </TableCell>
                <TableCell align="right">
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
