import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../../enums/DayOfWeek";
import { ApprovalEnum } from "../../enums/ApprovalEnum";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import DatabaseFinder from "../../apis/DatabaseFinder";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

interface ILecturingActivityProps {
  unitId: string;
  setModalOpen: (activityId: string) => void;
}

const LecturingActivity: React.FC<ILecturingActivityProps> = ({
  unitId,
  setModalOpen,
}) => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [hasChanged, setChanged] = useState<Boolean>(false);
  const [openApproval, setOpenApproval] = useState<boolean>(false);
  const [openRejected, setOpenRejected] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  useEffect(() => {
    const getActivities = async () => {
      try {
        //console.log(params.unitId);
        const res = await fetch(
          `http://localhost:8888/units/${unitId}/activities`,
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

    getActivities().then((res) => {
      setActivities(res);
    });
  }, [unitId, hasChanged]);

  const timeReducer = (time: String) =>
    time
      .split(":")
      .map((val) => parseInt(val))
      .reduce((val, total) => val * 60 + total);

  const sortDayTime = (list: IActivity[]) => {
    return list.sort((a, b) => {
      if (
        Object.values(DayOfWeek).indexOf(a.dayOfWeek) <
        Object.values(DayOfWeek).indexOf(b.dayOfWeek)
      ) {
        return -1;
      } else if (
        Object.values(DayOfWeek).indexOf(a.dayOfWeek) >
        Object.values(DayOfWeek).indexOf(b.dayOfWeek)
      ) {
        return 1;
      } else {
        return timeReducer(a.startTime) - timeReducer(b.startTime);
      }
    });
  };

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

  const allocationApproved = async (allocation: IAllocation) => {
    const result = await DatabaseFinder.post(
      `http://localhost:8888/allocations/approval/${allocation.id}/Lecturer`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenApproval(true);
    } else {
      // Untested
      setOpenError(true);
    }
  };

  const allocationRejected = async (allocation: IAllocation) => {
    // TODO: Handle approval
    const result = await DatabaseFinder.delete(
      `http://localhost:8888/allocations/${allocation.id}`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenRejected(true);
    } else {
      // Untested
      setOpenError(true);
    }
  };

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
    if (activities.length === 0) {
      return (
        <TableRow>
          <TableCell className={classes.error} align="center">
            No activity has been allocated for this unit.{" "}
          </TableCell>
        </TableRow>
      );
    }
    return <TableRow />;
  }

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

  function ApprovalCell(props: { allocation: IAllocation }) {
    const { allocation } = props;
    let approval = allocation.approval;
    switch (approval) {
      case ApprovalEnum.INIT:
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
      case ApprovalEnum.LECTURER:
        return (
          <>
            {" "}
            <div> Waiting on TA response to offer </div>
          </>
        );
      case ApprovalEnum.TA:
        return (
          <>
            {" "}
            <div> TA Has Accepted </div>{" "}
          </>
        );
      case ApprovalEnum.WORKFORCE:
        return (
          <>
            {" "}
            <div> Work-Force Have Confirmed </div>{" "}
          </>
        );
      default:
        console.error("Unknown approval");
        return (
          <>
            {" "}
            <div>Error With Allocations Approval</div>{" "}
          </>
        );
    }
  }

  /*
  NOTE
  For the approval tablecell, we could prob display the status e.g. APPROVED/REJECTED is it has been dealt with. 
  Else, we just provide the buttons for approval/rekjection.
   */
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Activity Code</TableCell>
              <TableCell align="left">Activity Group</TableCell>
              <TableCell align="left">Campus</TableCell>
              <TableCell align="left">Day of Week</TableCell>
              <TableCell align="left">Location </TableCell>
              <TableCell align="left">Start Time</TableCell>
              <TableCell align="left">End Time</TableCell>
              <TableCell align="center">Allocations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <EmptyAllocations />
            {sortDayTime(activities).map((activity, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {activity.activityCode}
                </TableCell>
                <TableCell align="left">{activity.activityGroup}</TableCell>
                <TableCell align="left">{activity.campus}</TableCell>
                <TableCell align="left">
                  {dayConverter(activity.dayOfWeek)}
                </TableCell>
                <TableCell align="left">{activity.location}</TableCell>
                <TableCell align="left">{activity.startTime}</TableCell>
                <TableCell align="left">{activity.endTime}</TableCell>
                <TableCell align="left">
                  {activity.allocations.length > 0 ? (
                    activity.allocations.map(
                      (allocation: IAllocation & { [key: string]: any }, j) => (
                        <Table key={j}>
                          <TableBody>
                            <TableRow>
                              <TableCell align="left" width="50%">
                                {" "}
                                {allocation.staff.givenNames}{" "}
                                {allocation.staff.lastName}
                              </TableCell>
                              <TableCell align="left" width="50%">
                                <ApprovalCell allocation={allocation} />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )
                    )
                  ) : (
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>No Allocations yet.</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => setModalOpen(activity.id)}
                  >
                    Manually add allocations
                  </Button>
                </TableCell>
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

export default LecturingActivity;
