import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../enums/DayOfWeek";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import { IconButton, makeStyles, Grid, TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import DatabaseFinder from "../apis/DatabaseFinder";
import { ApprovalEnum } from "../enums/ApprovalEnum";
import { withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import "../index.css";

const Activities = (props: { [key: string]: any }) => {
  const [allocations, setAllocations] = useState<
    (myAllocations & { [key: string]: any })[]
  >([]);

  const [hasChanged, setChanged] = useState<Boolean>(false);
  const [openApproval, setOpenApproval] = useState<boolean>(false);
  const [openRejected, setOpenRejected] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  useEffect(() => {
    setChanged(false);
    let params: { [key: string]: any } = {
      ...props,
    };
    const getAllocations = async () => {
      try {
        let query = Object.keys(params)
          .filter((key) => params[key] !== undefined)
          .map((key) => `${key}=${params[key]}`)
          .join("&");

        const res = await fetch(
          `http://localhost:8888/allocations/mine?${query}`,
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
        return await res.json();
      } catch (e) {
        console.log("Error fetching user activities");
        return [];
      }
    };

    getAllocations().then((res) => {
      setAllocations(res);
    });
  }, [props, hasChanged]);

  const useRowStyles = makeStyles({
    error: {
      fontSize: "large",
      textAlign: "center",
      border: 0,
      borderRadius: 5,
    },
  });

  function EmptyAllocations() {
    const classes = useRowStyles();
    if (allocations.length === 0) {
      return (
        <TableRow>
          <TableCell className={classes.error} align="center">
            You currently have no allocations for this unit.{" "}
          </TableCell>
        </TableRow>
      );
    }
    return <TableRow />;
  }

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenApproval(false);
    setOpenError(false);
    setOpenRejected(false);
  };

  const timeReducer = (time: String) =>
    time
      .split(":")
      .map((val) => parseInt(val))
      .reduce((val, total) => val * 60 + total);

  const sortDayTime = (list: (myAllocations & { [key: string]: any })[]) => {
    return list.sort((a, b) => {
      if (
        Object.values(DayOfWeek).indexOf(a.activity_dayOfWeek) <
        Object.values(DayOfWeek).indexOf(b.activity_dayOfWeek)
      ) {
        return -1;
      } else if (
        Object.values(DayOfWeek).indexOf(a.activity_dayOfWeek) >
        Object.values(DayOfWeek).indexOf(b.activity_dayOfWeek)
      ) {
        return 1;
      } else {
        return (
          timeReducer(a.activity_startTime) - timeReducer(b.activity_startTime)
        );
      }
    });
  };

  const dayConverter = (day: DayOfWeek) => {
    switch (day) {
      case DayOfWeek.MONDAY:
        return "Monday";
      case DayOfWeek.TUESDAY:
        return "Tuesday";
      case DayOfWeek.WEDNESDAY:
        return "Wednesday";
      case DayOfWeek.THURSDAY:
        return "Thursday";
      case DayOfWeek.FRIDAY:
        return "Friday";
      default:
        return "Invalid Day";
    }
  };

  const allocationApproved = async (allocation: myAllocations) => {
    const result = await DatabaseFinder.post(
      `http://localhost:8888/allocations/approval/${allocation.allocation_id}/TA`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenApproval(true);
    } else {
      setOpenError(true);
      console.error("error updating");
    }
  };

  const allocationRejected = async (allocation: myAllocations) => {
    // TODO: Handle approval
    const result = await DatabaseFinder.delete(
      `http://localhost:8888/allocations/${allocation.allocation_id}`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenRejected(true);
    } else {
      setOpenError(true);
      console.error("error deleting");
    }
  };

  const approvalStatus = (
    allocation: myAllocations & { [key: string]: any }
  ) => {
    switch (allocation.allocation_approval) {
      case ApprovalEnum.INIT:
        return "You Shouldn't See Me";
      case ApprovalEnum.LECTURER:
        return (
          <>
            <IconButton onClick={() => allocationApproved(allocation)}>
              <DoneIcon />
            </IconButton>
            <IconButton onClick={() => allocationRejected(allocation)}>
              <ClearIcon />
            </IconButton>
          </>
        );
      case ApprovalEnum.TA:
        return "Accepted Offer";
      case ApprovalEnum.WORKFORCE:
        return "Accepted and Confirmed by WorkForce";
      default:
        return "Error With Approval Status";
    }
  };

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  //TODO: Autocomplete function that Provides the available campus and unit code for a specific Year and Teaching Period.
  // Update the table based on the Autocomplete selections.
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            options={allocations}
            getOptionLabel={(allocation) => allocation.unit_year.toString()}
            renderInput={(params) => (
              <TextField {...params} label="Year" variant="outlined" />
            )}
            // Might need to change default value to handle case when user has no allocations
            defaultValue={allocations[0]}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={allocations}
            getOptionLabel={(allocation) => allocation.unit_offeringPeriod}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Oferring Period"
                variant="outlined"
              />
            )}
            // Might need to change default value to handle case when user has no allocations
            defaultValue={allocations[0]}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={allocations}
            getOptionLabel={(allocation) => allocation.unit_campus}
            renderInput={(params) => (
              <TextField {...params} label="Campus" variant="outlined" />
            )}
            // Might need to change default value to handle case when user has no allocations
            defaultValue={allocations[0]}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={allocations}
            getOptionLabel={(allocation) => allocation.unit_unitCode}
            renderInput={(params) => (
              <TextField {...params} label="Unit Code" variant="outlined" />
            )}
            // Might need to change default value to handle case when user has no allocations
            defaultValue={allocations[0]}
          />
        </Grid>
      </Grid>
      <Box pt={5}>
        <TableContainer component={Paper}>
          <Table className={""} size="small" aria-label="activities table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Unit Code</StyledTableCell>
                <StyledTableCell align="left">Campus</StyledTableCell>
                <StyledTableCell align="left">Activity Group</StyledTableCell>
                <StyledTableCell align="left">Activity Code</StyledTableCell>
                <StyledTableCell align="left">Day</StyledTableCell>
                <StyledTableCell align="left">Location </StyledTableCell>
                <StyledTableCell align="left">Start Time</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
                <StyledTableCell align="left">Time Remaining</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAllocations />
              {sortDayTime(allocations).map((allocation, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {allocation.unit_unitCode}
                  </TableCell>
                  <TableCell align="left">{allocation.unit_campus}</TableCell>
                  <TableCell align="left">
                    {allocation.activity_activityGroup}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity_activityCode}
                  </TableCell>
                  <TableCell align="left">
                    {dayConverter(allocation.activity_dayOfWeek)}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity_location}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity_startTime}
                  </TableCell>
                  <TableCell align="left">
                    {approvalStatus(allocation)}
                  </TableCell>
                  <TableCell align="left">PlaceHolder</TableCell>
                  <TableCell align="left">PlaceHolder</TableCell>
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
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            Something went wrong. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default Activities;
