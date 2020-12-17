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
  const [searchedActivities, setSearchedActivities] = useState<IActivity[]>([]);
  const [unitCodes] = useState<any[]>([]);
  const [offeringYear] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const history = useHistory();

  const [hasChanged, setChanged] = useState<Boolean>(false);
  const [openApproval, setOpenApproval] = useState<boolean>(false);
  const [openRejected, setOpenRejected] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  useEffect(() => {
    const getChoices = (activities: IActivity[]) => {
      activities.forEach((activity) => {
        if (!offeringYear.includes(activity.unit.year)) {
          offeringYear.push(activity.unit.year);
          //console.log(offeringYear);
        }
        if (!unitCodes.includes(activity.unit.unitCode)) {
          unitCodes.push(activity.unit.unitCode);
          //console.log(unitCodes);
        }
      });
    };
    getActivities().then((res) => {
      setActivities(res);
      getChoices(res);
    });
  }, [offeringYear, unitCodes]);

  // Click on a row of table will bring you to a page which will show the available candidates pool for that activity
  const handleClick = (
    event: React.MouseEvent<unknown>,
    activity: IActivity
  ) => {
    //console.log(activity);
    history.push("/candidates", { id: activity.id });
  };

  const handleSelect = () => {
    setSearchedActivities([]);
    activities.forEach((activity) => {
      if (
        activity.unit.unitCode === selectedUnit &&
        activity.unit.year === selectedYear
      ) {
        setSearchedActivities((display) => [...display, activity]);
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
        <Table className={""} size="small" aria-label="activities table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Activity Code</TableCell>
              <TableCell align="left">Activity Group</TableCell>
              <TableCell align="left">Campus</TableCell>
              <TableCell align="left">Day of Week</TableCell>
              <TableCell align="left">Location </TableCell>
              <TableCell align="left">Start Time</TableCell>
              <TableCell align="left">Duration</TableCell>
              <TableCell align="left">Status</TableCell>
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
                  {allocation.activity.activityCode}
                </TableCell>
                <TableCell align="left">
                  {allocation.activity.activityGroup}
                </TableCell>
                <TableCell align="left">{allocation.activity.campus}</TableCell>
                <TableCell align="left">
                  {dayConverter(allocation.activity.dayOfWeek)}
                </TableCell>
                <TableCell align="left">
                  {allocation.activity.location}
                </TableCell>
                <TableCell align="left">
                  {allocation.activity.startTime}
                </TableCell>
                <TableCell align="left">
                  {allocation.activity.duration + " hour(s)"}
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
      <Snackbar
        open={openApproval}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          You have approved an allocation.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openRejected}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          You have rejected an allocation.
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Something went wrong. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Activities1;
