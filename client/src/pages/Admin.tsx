import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { AuthContext } from "../session";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

interface IStaff {
  role: string;
  unitCode: string;
  givenNames: string;
  lastName: string;
  email: string;
}

const Admin = () => {
  const { adminAccess } = React.useContext(AuthContext);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [staff, setStaff] = useState<IStaff[]>([]);

  const fetchStaff = async () => {
    let values = {
      // @ts-ignore
      unitCode: selectedUnit ? selectedUnit.unitCode : null,
      // @ts-ignore
      year: selectedPeriod ? selectedPeriod.year : null,
    };

    let params = {};
    // TODO: better way to do this
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        // @ts-ignore
        params[key] = value;
      }
    }

    // TODO: fetch staff based on selected unit
    const res = await fetch(
      "http://localhost:8888/staff?" + new URLSearchParams(params),
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
    const resJson = await res.json();
    console.log(resJson);
    setStaff(resJson);
  };

  // TODO: fetch data from backend
  const teachingPeriods = [{ year: 2020 }, { year: 2019 }];
  const units = [{ unitCode: "FIT3170" }, { unitCode: "FIT2100" }];
  return (
    <div id="main">
      {/* <div>Admin access: {adminAccess.toString()}</div> */}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            options={teachingPeriods}
            getOptionLabel={(option) => option.year.toString()}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teaching period"
                variant="outlined"
              />
            )}
            value={selectedPeriod}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedPeriod(newValue);
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            options={units}
            getOptionLabel={(option) => option.unitCode}
            renderInput={(params) => (
              <TextField {...params} label="Unit" variant="outlined" />
            )}
            disabled={selectedPeriod === null}
            value={selectedUnit}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedUnit(newValue);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedPeriod === null}
            onClick={fetchStaff}
          >
            SELECT
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Unit</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((row) => (
              <TableRow key={row.email}>
                <TableCell>{row.unitCode}</TableCell>
                <TableCell>
                  {row.givenNames} {row.lastName}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Admin;
