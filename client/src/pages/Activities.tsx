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
import { IconButton, makeStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import baseApi from "../apis/baseApi";

// TODO: define props type
const Activities = (props: { [key: string]: any }) => {
  const [allocations, setAllocations] = useState<
    (IAllocation & { [key: string]: any })[]
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

        const res = await baseApi.get("/allocations/mine", {
          params: { query },
        });
        return await res.data;
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

  const sortDayTime = (list: (IAllocation & { [key: string]: any })[]) => {
    return list.sort((a, b) => {
      if (
        Object.values(DayOfWeek).indexOf(a.activity.dayOfWeek) <
        Object.values(DayOfWeek).indexOf(b.activity.dayOfWeek)
      ) {
        return -1;
      } else if (
        Object.values(DayOfWeek).indexOf(a.activity.dayOfWeek) >
        Object.values(DayOfWeek).indexOf(b.activity.ayOfWeek)
      ) {
        return 1;
      } else {
        return (
          timeReducer(a.activity.startTime) - timeReducer(b.activity.startTime)
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

  const allocationApproved = async (allocation: IAllocation) => {
    const res = await baseApi.patch(
      `/allocations/${allocation.id}/ta-acceptance?value=true`
    );
    if (res.statusText === "OK") {
      setChanged(true);
      setOpenApproval(true);
    } else {
      setOpenError(true);
      console.error("error updating");
    }
  };

  const allocationRejected = async (allocation: IAllocation) => {
    const result = await baseApi.patch(
      `allocations/${allocation.id}/acceptance?value=false`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenRejected(true);
    } else {
      setOpenError(true);
      console.error("error deleting");
    }
  };

  const approvalStatus = (allocation: IAllocation & { [key: string]: any }) => {
    if (!allocation.isLecturerApproved) {
      return "You Shouldn't See Me";
    }

    if (!allocation.isTaAccepted) {
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
    }
    return "Accepted Offer";
  };

  return (
    <Box>
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
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <EmptyAllocations />
            {sortDayTime(allocations).map((allocation, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  <TableRow>{allocation.activity.activityCode}</TableRow>
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
                <TableCell align="left">{approvalStatus(allocation)}</TableCell>
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

export default Activities;
