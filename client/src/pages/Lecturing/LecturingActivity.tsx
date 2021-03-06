import { Grid, makeStyles, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Autocomplete } from "@material-ui/lab";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useEffect, useRef, useState } from "react";
import baseApi from "../../apis/baseApi";
import { CustomButton, CustomStatus } from "../../components";
import { DayOfWeek } from "../../enums/DayOfWeek";
import CandidatesModal from "./CandidatesModal";
import "../styles/Grid.css";
import { IActivity, IAllocationWithStaff } from "../../type";

// Props for LecturingActivity component
interface ILecturingActivityProps {
  setStatusLogModalOpen: (activityId: string) => void; // Toggle the modal
}

/**
 * LecturingActivity component: displays the activities for the selected units and allows the lecturer to perform actions on them
 * @prop setStatusLogModalOpen: a function that toggles the modal
 */
const LecturingActivity: React.FC<ILecturingActivityProps> = ({
  setStatusLogModalOpen,
}) => {
  const [activities, setActivities] = useState<IActivity[]>([]); // Set state containing activities
  const [activitiesToDisplay, setActivitiesToDisplay] = useState<IActivity[]>(
    []
  ); // Filtered activities to display
  const [hasChanged, setChanged] = useState<Boolean>(false); // State used to determine whether to update filtered activities
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
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const initialRender = useRef(true);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  /**
   * Gets all activities for a particular lecturer and updates component state
   */
  useEffect(() => {
    setChanged(false);
    const getActivities = async () => {
      try {
        const res = await baseApi.get(`/activities/all-my-lecturing`);
        return await res.data;
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

  /**
   * Updates time every minute to refresh countdown timer
   */
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
  }, []);

  /**
   * Filters activities based on selected options and displays them
   */
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

  /**
   * setUpAutoComplete: finds options to display in Autocomplete boxes based on data
   * @param res: An array of IActivity instances
   */
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

  /**
   * getDaysCountdown
   * @param expiryDate: the date to count down to
   */
  const getDaysCountdown = (expiryDate: string) => {
    const expDateFormat = new Date(expiryDate);
    const timeDifference = expDateFormat.getTime() - currentTime.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    //if offer expired.
    if (timeDifference <= 0) {
      return (
        <CustomStatus
          value="Tutor has not responded"
          isYellow
          isExclamationTriangle
        />
      );
    }

    //deciding to show days or hours/minutes
    if (daysDifference > 1) {
      return Math.floor(daysDifference).toString() + " days";
    } else {
      const roundedHours = Math.floor(timeDifference / 3600000);
      if (roundedHours >= 1) {
        //if greater or equal to an hour: just show the hours
        return roundedHours.toString() + (roundedHours === 1 ? " hr" : " hrs");
      } else {
        //else, show the minutes instead
        const roundedMinutes = Math.floor(timeDifference / 60000);
        return (
          roundedMinutes.toString() + (roundedMinutes === 1 ? " min" : " mins")
        );
      }
    }
  };

  /**
   * Returns a MuiAlert component.
   * @param props: props to pass into the MuiAlert component.
   */
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

  /**
   * Approves an allocation.
   * @param allocation: the allocation to approve.
   */
  const allocationApproved = async (allocation: IAllocationWithStaff) => {
    const result = await baseApi.patch(
      `/allocations/${allocation.id}/lecturer-approval?value=true`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenApproval(true);
    } else {
      setOpenError(true);
    }
  };

  /**
   * Rejects an allocation.
   * @param allocation: the allocation to reject.
   */
  const allocationRejected = async (allocation: IAllocationWithStaff) => {
    const result = await baseApi.patch(
      `/allocations/${allocation.id}/lecturer-approval?value=false`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenRejected(true);
    } else {
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

  /**
   * Returns a table row for when there are no relevant activities to display.
   */
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

  /**
   * Converts the DayOfWeek enum to a string
   * @param day: a DayOfWeek enum
   */
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

  /**
   * ApprovalCell: returns a component with the relevant info depending on allocation approval status
   * @param props: a props object containing an IAllocationWithStaff instance
   */
  function ApprovalCell(props: { allocation: IAllocationWithStaff }) {
    const { allocation } = props;
    const approval = allocation.isLecturerApproved;
    const acceptance = allocation.isTaAccepted;
    const workforce = allocation.isWorkforceApproved;

    // Case when WF has approved but Lect hasnt approved
    if (workforce === true && approval === null && acceptance === null) {
      return (
        <CustomStatus
          value="Waiting for your response"
          isBlue
          isExclamationDiamond
        />
      );
    } // Case when lect and WF has approved but TA hasnt respond
    else if (workforce === true && approval === true && acceptance === null) {
      return <CustomStatus value="Waiting for TA response" isBlue isClock />;
    } // Case when lect and WF approved but TA rejected
    else if (workforce === true && approval === true && acceptance === false) {
      return (
        <CustomStatus value="TA has rejected" isRed isExclamationTriangle />
      );
    } // Case When WF approved but Lect rejected
    else if (workforce === true && approval === false && acceptance === null) {
      return <CustomStatus value="You have rejected" isRed isCross />;
    } // Case when WF, Lect and TA approved
    else if (workforce === true && approval === true && acceptance === true) {
      return <CustomStatus value="TA has approved" isGreen isCheck />;
    } // Case when Lect approved but WF has yet to approve
    else if (workforce === null && approval === true && acceptance === null) {
      return (
        <CustomStatus
          value="Waiting for Workforce approval"
          isBlue
          isExclamationTriangle
        />
      );
    } // Case when Lect approve but workforce rejected
    else if (workforce === false && approval === true && acceptance === null) {
      return <CustomStatus value="Workforce has rejected" isRed isCross />;
    }

    return <CustomStatus value="Error" isRed isCross></CustomStatus>;
  }

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  /**
   * isAllocationsLessThanMax: checks that the current allocations of an activity does not exceed the activity's allocationMaxNum
   * @param activity: the activity to check
   */
  function isAllocationsLessThanMax(activity: IActivity) {
    let allocationsNoRejection: IAllocationWithStaff[] = [];

    let numOfAllocations = activity.allocations.length;
    let allocationsMaxNum = activity.allocationsMaxNum;

    for (let i = 0; i < numOfAllocations; i++) {
      let allocation = activity.allocations[i];

      if (allocation.isLecturerApproved !== false) {
        if (allocation.isTaAccepted !== false) {
          if (allocation.isWorkforceApproved !== false) {
            allocationsNoRejection.push(allocation);
          }
        }
      }
    }

    return allocationsNoRejection.length < allocationsMaxNum;
  }

  return (
    <div>
      <CandidatesModal
        activityId={modalOpen}
        closeModal={() => setModalOpen(null)}
      />
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
          <Table className="grid" size="small">
            <colgroup>
              <col width="10%" />
              <col width="5%" />
              <col width="13%" />
              <col width="13%" />
              <col width="6%" />
              <col width="12%" />
              <col width="7%" />
              <col width="7%" />
              <col width="9%" />
              <col width="10%" />
              <col width="4%" />
              <col width="11%" />
            </colgroup>
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Unit Code</StyledTableCell>
                <StyledTableCell align="left">Campus</StyledTableCell>
                <StyledTableCell align="left">
                  Activity Group Code
                </StyledTableCell>
                <StyledTableCell align="left">
                  Max. Allocate No.
                </StyledTableCell>
                <StyledTableCell align="left">Day</StyledTableCell>
                <StyledTableCell align="left">Location</StyledTableCell>
                <StyledTableCell align="left">Start Time</StyledTableCell>
                <StyledTableCell align="left">End Time</StyledTableCell>
                <StyledTableCell align="left">Staff Name</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
                <StyledTableCell align="left" style={{ minWidth: 110 }}>
                  Time Remaining
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAllocations />
              {activitiesToDisplay.map((activity, i) => {
                const n = activity.allocations.length;
                return n > 0 ? (
                  <React.Fragment key={i}>
                    {activity.allocations.map(
                      (allocation: IAllocationWithStaff, j) => {
                        return (
                          <React.Fragment key={j}>
                            <TableRow>
                              {j === 0 ? (
                                <>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.unit.unitCode}
                                    <Button
                                      size="small"
                                      href="#text-buttons"
                                      color="primary"
                                      onClick={() =>
                                        setStatusLogModalOpen(activity.id)
                                      }
                                    >
                                      Status Log
                                    </Button>
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.unit.campus}
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.activityGroup +
                                      " " +
                                      activity.activityCode}
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.allocationsMaxNum}
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {dayConverter(activity.dayOfWeek)}
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.location}
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.startTime.substring(0, 5)}
                                  </TableCell>
                                  <TableCell rowSpan={n + 1} align="left">
                                    {activity.endTime.substring(0, 5)}
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
                              <TableCell align="left">
                                {getDaysCountdown(allocation.offerExpiryDate)}
                              </TableCell>
                            </TableRow>
                            {j === n - 1 ? (
                              <TableRow>
                                {isAllocationsLessThanMax(activity) ? (
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      onClick={() => setModalOpen(activity.id)}
                                    >
                                      Assign Staff
                                    </Button>
                                  </TableCell>
                                ) : (
                                  <TableCell
                                    colSpan={4}
                                    align="center"
                                    style={{
                                      padding: "0.5rem 0",
                                      fontSize: "18px",
                                    }}
                                  >
                                    <b>Fully Allocated.</b>
                                  </TableCell>
                                )}
                              </TableRow>
                            ) : null}
                          </React.Fragment>
                        );
                      }
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={i}>
                    <TableRow>
                      <TableCell rowSpan={2} align="left">
                        {activity.unit.unitCode}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.unit.campus}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.activityGroup + " " + activity.activityCode}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.allocationsMaxNum}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {dayConverter(activity.dayOfWeek)}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.location}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.startTime.substring(0, 5)}
                      </TableCell>
                      <TableCell rowSpan={2} align="left">
                        {activity.endTime.substring(0, 5)}
                      </TableCell>
                      <TableCell
                        colSpan={4}
                        align="center"
                        style={{ padding: "0.5rem 0", fontSize: "18px" }}
                      >
                        <b>No Allocations yet.</b>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => setModalOpen(activity.id)}
                        >
                          Assign staff
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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
