import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";

const Activities1 = () => {
  const [activities, setActivities] = useState<IActivity[]>([]); //this will set all available activities
  const [searchedActivities, setSearchedACtivities] = useState<IActivity[]>([]);
  const [unitCodes] = useState<any[]>([]);
  const [offeringYear] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const history = useHistory();

  const getActivities = async () => {
    const res = await fetch("http://localhost:8888/activities");
    return res.json();
  };

  useEffect(() => {
    getActivities().then((res) => {
      setActivities(res);
      getChoices(res);
    });
  });

  const getChoices = (activities: IActivity[]) => {
    activities.forEach((activity) => {
      if (!offeringYear.includes(activity.unit.year)) {
        offeringYear.push(activity.unit.year);
        console.log(offeringYear);
      }
      if (!unitCodes.includes(activity.unit.unitCode)) {
        unitCodes.push(activity.unit.unitCode);
        console.log(unitCodes);
      }
    });
  };

  // click on a row of table will bring you to a page which will show the available candidates pool for that activity
  const handleClick = (
    event: React.MouseEvent<unknown>,
    activity: IActivity
  ) => {
    console.log(activity);
    history.push("candidates/" + activity.id);
  };

  const handleSelect = () => {
    setSearchedACtivities([]);
    activities.forEach((activity) => {
      if (
        activity.unit.unitCode === selectedUnit &&
        activity.unit.year === selectedYear
      ) {
        setSearchedACtivities((display) => [...display, activity]);
      }
    });
  };

  return (
    <div id="main">
      <h1>Activity</h1>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            options={offeringYear}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teaching period"
                variant="outlined"
              />
            )}
            value={selectedYear}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedYear(newValue);
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            options={unitCodes}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Unit" variant="outlined" />
            )}
            disabled={selectedYear === null}
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
            disabled={selectedYear === null}
            onClick={handleSelect}
          >
            SELECT
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Activity Code</TableCell>
              <TableCell align="right">Activity Group</TableCell>
              <TableCell align="right">Campus</TableCell>
              <TableCell align="right">Day of Week</TableCell>
              <TableCell align="right">Location </TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Unit Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedActivities.map((activity, i) => (
              <TableRow
                hover
                onClick={(event) => handleClick(event, searchedActivities[i])}
                key={i}
              >
                <TableCell component="th" scope="row">
                  {activity.activityCode}
                </TableCell>
                <TableCell align="right">{activity.activityGroup}</TableCell>
                <TableCell align="right">{activity.campus}</TableCell>
                <TableCell align="right">{activity.dayOfWeek}</TableCell>
                <TableCell align="right">{activity.location}</TableCell>
                <TableCell align="right">{activity.startTime}</TableCell>
                <TableCell align="right">{activity.endTime}</TableCell>
                <TableCell align="right">{activity.unit.unitCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Activities1;
