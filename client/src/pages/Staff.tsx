import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import baseApi from "../apis/baseApi";

const Staff = () => {
  const [staffs, setStaffs] = useState<IStaff[]>([]);

  const getAllStaff = async () => {
    try {
      const res = await baseApi.get('/staff');
      const jsonData = await res.data;
      setStaffs(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  return (
    <div id="main">
      <h1>Staff</h1>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">AQF</TableCell>
              <TableCell align="right">Studying AQF</TableCell>
              <TableCell align="center">Preference</TableCell>
              <TableCell align="center">Availability</TableCell>
              <TableCell align="center">Allocation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell align="right">{staff.lastName}</TableCell>
                <TableCell align="right">{staff.givenNames}</TableCell>
                <TableCell align="right">{staff.email}</TableCell>
                <TableCell align="right">{staff.aqf}</TableCell>
                <TableCell align="right">{staff.studyingAqf}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="default">
                    View Preferences
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary">
                    View Availability
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="secondary">
                    View Allocations
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Staff;
