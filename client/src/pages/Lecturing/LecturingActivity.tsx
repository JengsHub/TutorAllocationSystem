import React, { useState, useEffect, useRef } from "react";
import { DayOfWeek } from "../../enums/DayOfWeek";
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
import { makeStyles, Grid, TextField } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import DatabaseFinder from "../../apis/DatabaseFinder";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

interface ILecturingActivityProps {
  // unitId: string;
  setModalOpen: (activityId: string) => void;
  setStatusLogModalOpen: (activityId: string) => void;
}

const LecturingActivity: React.FC<ILecturingActivityProps> = ({
  // unitId,
  setModalOpen,
  setStatusLogModalOpen,
}) => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [activitiesToDisplay, setActivitiesToDisplay] = useState<IActivity[]>(
    []
  );
  const [hasChanged, setChanged] = useState<Boolean>(false);
  const [openApproval, setOpenApproval] = useState<boolean>(false);
  const [openRejected, setOpenRejected] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const [yearOption, setYearOption] = useState<string[]>([]);
  const [offeringPeriodOption, setOfferingPeriodOption] = useState<string[]>(
    []
  );
  const [unitCodeOption, setUnitCodeOption] = useState<string[]>([]);
  const [campusOption, setCampusOption] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<any>("All");
  const [selectedOfferingPeriod, setSelectedOfferingPeriod] = useState<any>(
    "All"
  );
  const [selectedUnitCode, setSelectedUnitCode] = useState<any>("All");
  const [selectedCampus, setSelectedCampus] = useState<any>("All");
  const initialRender = useRef(true);

  useEffect(() => {
    setChanged(false);
    const getActivities = async () => {
      try {
        //console.log(params.unitId);
        const res = await fetch(
          `http://localhost:8888/activities/all-my-lecturing`,
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
      setActivitiesToDisplay(res);
      // eslint-disable-next-line
      setUpAutoComplete(res);
    });
  }, [hasChanged]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      let tempArray: (IActivity & { [key: string]: any })[] = activities;
      if (selectedYear !== "All") {
        tempArray = tempArray.filter(function (activity) {
          return activity.unit.year.toString() === selectedYear;
        });
      }
      if (selectedOfferingPeriod !== "All") {
        tempArray = tempArray.filter(function (activity) {
          return activity.unit.offeringPeriod === selectedOfferingPeriod;
        });
      }
      if (selectedCampus !== "All") {
        tempArray = tempArray.filter(function (activity) {
          return activity.unit.campus === selectedCampus;
        });
      }
      if (selectedUnitCode !== "All") {
        tempArray = tempArray.filter(function (activity) {
          return activity.unit.unitCode === selectedUnitCode;
        });
      }

      setActivitiesToDisplay(tempArray);
    }
  }, [
    selectedYear,
    selectedCampus,
    selectedOfferingPeriod,
    selectedUnitCode,
    activities,
  ]);

  function setUpAutoComplete(res: IActivity & { [key: string]: any }[]) {
    let uniqueList: string[] = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].unit.unitCode)) {
        uniqueList.push(res[i].unit.unitCode);
      }
    }
    uniqueList.push("All");
    setUnitCodeOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].unit.offeringPeriod)) {
        uniqueList.push(res[i].unit.offeringPeriod);
      }
    }
    uniqueList.push("All");
    setOfferingPeriodOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].unit.year.toString())) {
        uniqueList.push(res[i].unit.year.toString());
      }
    }
    uniqueList.push("All");
    setYearOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].unit.campus)) {
        uniqueList.push(res[i].unit.campus);
      }
    }
    uniqueList.push("All");
    setCampusOption(uniqueList);
    uniqueList = [];
  }

  // const timeReducer = (time: String) =>
  //   time
  //     .split(":")
  //     .map((val) => parseInt(val))
  //     .reduce((val, total) => val * 60 + total);

  // const sortDayTime = (list: IActivity[]) => {
  //   return list.sort((a, b) => {
  //     if (
  //       Object.values(DayOfWeek).indexOf(a.dayOfWeek) <
  //       Object.values(DayOfWeek).indexOf(b.dayOfWeek)
  //     ) {
  //       return -1;
  //     } else if (
  //       Object.values(DayOfWeek).indexOf(a.dayOfWeek) >
  //       Object.values(DayOfWeek).indexOf(b.dayOfWeek)
  //     ) {
  //       return 1;
  //     } else {
  //       return timeReducer(a.startTime) - timeReducer(b.startTime);
  //     }
  //   });
  // };

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
    const result = await DatabaseFinder.patch(
      `http://localhost:8888/allocations/${allocation.id}/lecturer-approval?value=true`
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
    // const result = await DatabaseFinder.delete(
    //   `http://localhost:8888/allocations/${allocation.id}`
    // );
    const result = await DatabaseFinder.patch(
      `http://localhost:8888/allocations/${allocation.id}/approval?value=false`
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
            You have no allocated activities.{" "}
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
    let approval = allocation.isLecturerApproved;
    let acceptance = allocation.isTaAccepted;
    if (!approval) {
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
    } else {
      if (!acceptance) {
        return (
          <>
            {" "}
            <div> Waiting on TA response to offer </div>
          </>
        );
      }
      return (
        <>
          {" "}
          <div> TA Has Accepted </div>{" "}
        </>
      );
    }
  }

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  /*
  NOTE
  For the approval tablecell, we could prob display the status e.g. APPROVED/REJECTED is it has been dealt with. 
  Else, we just provide the buttons for approval/rekjection.
   */
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            options={yearOption}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => (
              <TextField {...params} label="Year" variant="outlined" />
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
            options={offeringPeriodOption}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Offering Period"
                variant="outlined"
              />
            )}
            value={selectedOfferingPeriod}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedOfferingPeriod(newValue);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={campusOption}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Campus" variant="outlined" />
            )}
            value={selectedCampus}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedCampus(newValue);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={unitCodeOption}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Unit Code" variant="outlined" />
            )}
            value={selectedUnitCode}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedUnitCode(newValue);
            }}
          />
        </Grid>
      </Grid>
      <Box pt={5}>
        <TableContainer component={Paper}>
          <Table className={""} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Unit Code</StyledTableCell>
                <StyledTableCell align="left">Campus</StyledTableCell>
                <StyledTableCell align="left">Activity Group</StyledTableCell>
                <StyledTableCell align="left">Activity Code</StyledTableCell>
                <StyledTableCell align="left">Day</StyledTableCell>
                <StyledTableCell align="left">Location </StyledTableCell>
                <StyledTableCell align="left">Start Time</StyledTableCell>
                <StyledTableCell align="left">End Time</StyledTableCell>
                <StyledTableCell align="center">Allocations</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
                <StyledTableCell align="right">Time Remaining</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAllocations />
              {activitiesToDisplay.map((activity, i) => (
                <TableRow key={i}>
                  <TableCell align="left">{activity.unit.unitCode}</TableCell>
                  <TableCell align="left">{activity.unit.campus}</TableCell>
                  <TableCell align="left">{activity.activityGroup}</TableCell>
                  <TableCell component="th" scope="row">
                    {activity.activityCode}
                  </TableCell>
                  <TableCell align="left">
                    {dayConverter(activity.dayOfWeek)}
                  </TableCell>
                  <TableCell align="left">{activity.location}</TableCell>
                  <TableCell align="left">{activity.startTime}</TableCell>
                  <TableCell align="left">{activity.endTime}</TableCell>
                  <TableCell align="left" colSpan={4}>
                    {activity.allocations.length > 0 ? (
                      activity.allocations.map(
                        (
                          allocation: IAllocation & { [key: string]: any },
                          j
                        ) => (
                          <Table key={j}>
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">
                                  {" "}
                                  PlaceHolder{" "}
                                </TableCell>
                                <TableCell align="left" width="50%">
                                  {" "}
                                  {allocation.staff.givenNames}{" "}
                                  {allocation.staff.lastName}
                                </TableCell>
                                <TableCell align="left" width="50%">
                                  <ApprovalCell allocation={allocation} />
                                </TableCell>
                                <TableCell align="left">
                                  {" "}
                                  PlaceHolder{" "}
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

export default LecturingActivity;
