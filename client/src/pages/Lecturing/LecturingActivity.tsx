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
import { CustomButton, CustomStatus } from "../../components";

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
      `http://localhost:8888/allocations/${allocation.id}/lecturer-approval?value=false`
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
            No activities to display.{" "}
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
    const approval = allocation.isLecturerApproved;
    const acceptance = allocation.isTaAccepted;
    const workforce = allocation.isWorkforceApproved;
    if (approval === null) {
      return (
        <CustomStatus
          value="Waiting for Lecturer"
          isBlue
          isExclamationDiamond
        />
      );
    } else if (approval === false) {
      return <CustomStatus value="Lecturer has rejected" isRed isCross />;
    }

    if (acceptance === null) {
      return <CustomStatus value="Waiting for TA response" isBlue isClock />;
    } else if (acceptance === false) {
      <CustomStatus value="TA has rejected" isRed isExclamationTriangle />;
    }

    if (workforce === true) {
      return <CustomStatus value="Workforce has approved" isGreen isCheck />;
    } else if (workforce === false) {
      return <CustomStatus value="Workforce has rejected" isRed isCross />;
    }

    return (
      <CustomStatus value="Waiting for Workforce approval" isBlue isCheck />
    );
  }

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  /*
  NOTE
  For the approval tablecell, we could prob display the status e.g. APPROVED/REJECTED is it has been dealt with. 
  Else, we just provide the buttons for approval/rejection.
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
                <StyledTableCell rowSpan={2} align="left">
                  Unit Code
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  Campus
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  Activity Group
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  Activity Code
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  Day
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  Location{" "}
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  Start Time
                </StyledTableCell>
                <StyledTableCell rowSpan={2} align="left">
                  End Time
                </StyledTableCell>
                <StyledTableCell align="center" colSpan={4}>
                  Allocations
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
                <StyledTableCell align="left">Time Remaining</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAllocations />
              {activitiesToDisplay.map((activity, i) => {
                const n = activity.allocations.length;
                return n > 0 ? (
                  activity.allocations.map(
                    (allocation: IAllocation & { [key: string]: any }, j) => {
                      return (
                        <>
                          <TableRow key={j}>
                            {j === 0 ? (
                              <>
                                <TableCell rowSpan={n + 1} align="left">
                                  {activity.unit.unitCode}
                                </TableCell>
                                <TableCell rowSpan={n + 1} align="left">
                                  {activity.unit.campus}
                                </TableCell>
                                <TableCell rowSpan={n + 1} align="left">
                                  {activity.activityGroup}
                                </TableCell>
                                <TableCell
                                  rowSpan={n + 1}
                                  component="th"
                                  scope="row"
                                >
                                  {activity.activityCode}
                                </TableCell>
                                <TableCell rowSpan={n + 1} align="left">
                                  {dayConverter(activity.dayOfWeek)}
                                </TableCell>
                                <TableCell rowSpan={n + 1} align="left">
                                  {activity.location}
                                </TableCell>
                                <TableCell rowSpan={n + 1} align="left">
                                  {activity.startTime}
                                </TableCell>
                                <TableCell rowSpan={n + 1} align="left">
                                  {activity.endTime}
                                </TableCell>
                              </>
                            ) : null}
                            <TableCell align="left" width="50%">
                              {" "}
                              {allocation.staff.givenNames}{" "}
                              {allocation.staff.lastName}
                            </TableCell>
                            <TableCell align="left" width="50%">
                              <ApprovalCell allocation={allocation} />
                            </TableCell>

                            <TableCell align="center">
                              {allocation.isLecturerApproved === null ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CustomButton
                                    value=""
                                    type="button"
                                    isCross
                                    isRed
                                    isCompact
                                    style={{ margin: "0 5px" }}
                                    onButtonClick={() =>
                                      allocationRejected(allocation)
                                    }
                                  />
                                  <CustomButton
                                    value=""
                                    type="button"
                                    isCheck
                                    isGreen
                                    isCompact
                                    style={{ margin: "0 5px" }}
                                    onButtonClick={() =>
                                      allocationApproved(allocation)
                                    }
                                  />
                                </div>
                              ) : null}
                            </TableCell>
                            <TableCell align="left"> PlaceHolder </TableCell>
                          </TableRow>
                          {j === n - 1 ? (
                            <TableRow>
                              <TableCell colSpan={4}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    padding: 5,
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    onClick={() => setModalOpen(activity.id)}
                                  >
                                    Manually add allocations
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </>
                      );
                    }
                  )
                ) : (
                  <>
                    <TableRow key={i}>
                      <TableCell rowSpan={2} align="left">
                        {activity.unit.unitCode}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.unit.campus}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.activityGroup}
                      </TableCell>
                      <TableCell rowSpan={2} component="th" scope="row">
                        {activity.activityCode}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {dayConverter(activity.dayOfWeek)}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.location}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.startTime}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.endTime}
                      </TableCell>
                      <TableCell colSpan={4}>No Allocations yet.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 5,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => setModalOpen(activity.id)}
                          >
                            Manually add allocations
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
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
