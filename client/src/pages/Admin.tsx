import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { AuthContext } from "../session";
import { Grid } from "@material-ui/core";

const Admin = () => {
  const { adminAccess } = React.useContext(AuthContext);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // TODO: fetch data from backend
  const teachingPeriods = [{ year: 2020 }, { year: 2019 }];
  const units = [{ name: "FIT3170" }, { name: "FIT2100" }];
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
            getOptionLabel={(option) => option.name}
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
      </Grid>
    </div>
  );
};

export default Admin;
