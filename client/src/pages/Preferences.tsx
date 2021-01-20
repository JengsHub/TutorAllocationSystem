import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import baseApi from "../apis/baseApi";

const Preferences = () => {
  const [preferences, setStaffPreferences] = useState<IPreferences[]>([]);

  const getStaffPreferences = async () => {
    const res = await baseApi.get("/staffpreferences");
    return res.data;
  };

  useEffect(() => {
    getStaffPreferences().then((res) => {
      // console.log(res);
      setStaffPreferences(res);
    });
  }, []);

  return (
    <div id="main">
      <h1>Preferences</h1>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Unit Code</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Offering</TableCell>
              <TableCell align="right">Staff First Name</TableCell>
              <TableCell align="right">Staff Last Name</TableCell>
              <TableCell align="right">Preference Score</TableCell>
              <TableCell align="right">Lecturer Score</TableCell>
              <TableCell align="right">Head Tutor Candidate?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preferences.map((staffPreference, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {staffPreference.unit.unitCode}
                </TableCell>
                <TableCell align="right">{staffPreference.unit.year}</TableCell>
                <TableCell align="right">
                  {staffPreference.unit.offeringPeriod}
                </TableCell>
                <TableCell align="right">
                  {staffPreference.staff.givenNames}
                </TableCell>
                <TableCell align="right">
                  {staffPreference.staff.lastName}
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

export default Preferences;
