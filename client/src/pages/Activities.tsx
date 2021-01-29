import { Grid, makeStyles, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
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
import baseApi from "../apis/baseApi";
import { CustomButton, CustomStatus } from "../components";
import { DayOfWeek } from "../enums/DayOfWeek";
import "../index.css";
import { IAllocation } from "../type";

const Activities = () => {
  const [allocations, setAllocations] = useState<IAllocation[]>([]);

  const [allocationsToDisplay, setAllocationsToDisplay] = useState<
    IAllocation[]
  >([]);
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

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setChanged(false);
    // let params: { [key: string]: any } = {
    //   ...props,
    // };
    const getAllocations = async () => {
      try {
        // let query = Object.keys(params)
        //   .filter((key) => params[key] !== undefined)
        //   .map((key) => `${key}=${params[key]}`)
        //   .join("&");

        const res = await baseApi.get("/allocations/mine", {
          params: { isLecturerApproved: true },
        });
        return await res.data;
      } catch (e) {
        console.log("Error fetching user activities");
        return [];
      }
    };

    getAllocations().then((res) => {
      setAllocations(res);
      setAllocationsToDisplay(res);
      // eslint-disable-next-line
      setUpAutoComplete(res);
    });
  }, [hasChanged]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      // Handle autocomplete changes
      let tempArray: IAllocation[] = allocations;
      if (selectedYear !== "All") {
        tempArray = tempArray.filter(function (allocation) {
          return allocation.activity.unit.year.toString() === selectedYear;
        });
      }
      if (selectedOfferingPeriod !== "All") {
        tempArray = tempArray.filter(function (allocation) {
          return (
            allocation.activity.unit.offeringPeriod === selectedOfferingPeriod
          );
        });
      }
      if (selectedCampus !== "All") {
        tempArray = tempArray.filter(function (allocation) {
          return allocation.activity.unit.campus === selectedCampus;
        });
      }
      if (selectedUnitCode !== "All") {
        tempArray = tempArray.filter(function (allocation) {
          return allocation.activity.unit.unitCode === selectedUnitCode;
        });
      }

      setAllocationsToDisplay(tempArray);
    }
  }, [
    selectedYear,
    selectedCampus,
    selectedOfferingPeriod,
    selectedUnitCode,
    allocations,
  ]);

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
  }, []);

  function setUpAutoComplete(res: IAllocation[]) {
    let uniqueList: string[] = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].activity.unit.unitCode)) {
        uniqueList.push(res[i].activity.unit.unitCode);
      }
    }
    uniqueList.push("All");
    setUnitCodeOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].activity.unit.offeringPeriod)) {
        uniqueList.push(res[i].activity.unit.offeringPeriod);
      }
    }
    uniqueList.push("All");
    setOfferingPeriodOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].activity.unit.year.toString())) {
        uniqueList.push(res[i].activity.unit.year.toString());
      }
    }
    uniqueList.push("All");
    setYearOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].activity.unit.campus)) {
        uniqueList.push(res[i].activity.unit.campus);
      }
    }
    uniqueList.push("All");
    setCampusOption(uniqueList);
    uniqueList = [];
  }

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
            You currently have no allocations.{" "}
          </TableCell>
        </TableRow>
      );
    }
    return <TableRow />;
  }

  const getDaysCountDown = (expiryDate: string) => {
    /*
    input: Date String
    output: Time left (number)
    Desc: find the days or time left between two dates
    */

    //dates cons
    const expDateFormat = new Date(expiryDate);
    const timeDifference = expDateFormat.getTime() - currentTime.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    //if offer expired.
    if (timeDifference <= 0) {
      return (
        // <div
        //   style={{
        //     margin: 0,
        //     padding: 5,
        //     backgroundColor: "#ffe57d",
        //     fontWeight: "bold",
        //   }}
        // >
        //   Please respond soon or offer may be retracted
        // </div>
        <CustomStatus
          value="Please respond soon or offer may be retracted"
          isYellow
          isExclamationDiamond
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

  const sortDayTime = (list: IAllocation[]) => {
    return list.sort((a, b) => {
      if (
        Object.values(DayOfWeek).indexOf(a.activity.dayOfWeek) <
        Object.values(DayOfWeek).indexOf(b.activity.dayOfWeek)
      ) {
        return -1;
      } else if (
        Object.values(DayOfWeek).indexOf(a.activity.dayOfWeek) >
        Object.values(DayOfWeek).indexOf(b.activity.dayOfWeek)
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
      `allocations/${allocation.id}/ta-acceptance?value=false`
    );
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenRejected(true);
    } else {
      setOpenError(true);
      console.error("error deleting");
    }
  };

  const approvalStatus = (allocation: IAllocation) => {
    if (
      allocation.isLecturerApproved &&
      allocation.isWorkforceApproved &&
      allocation.isTaAccepted === null
    ) {
      return (
        <CustomStatus
          value="Waiting for your response"
          isBlue
          isExclamationDiamond
        />
      );
    } else if (
      allocation.isLecturerApproved &&
      !allocation.isWorkforceApproved
    ) {
      return <CustomStatus value="Workforce has rejected" isRed isCross />;
    } else if (
      !allocation.isLecturerApproved &&
      allocation.isWorkforceApproved
    ) {
      return <CustomStatus value="Lecturer has rejected" isRed isCross />;
    } else if (
      allocation.isLecturerApproved &&
      allocation.isWorkforceApproved &&
      allocation.isTaAccepted === true
    ) {
      return <CustomStatus value="You have approved" isGreen isCheck />;
    } else if (
      allocation.isLecturerApproved &&
      allocation.isWorkforceApproved &&
      allocation.isTaAccepted === false
    ) {
      return <CustomStatus value="You have rejected" isRed isCross />;
    }

    // if (!allocation.isLecturerApproved) {
    //   return (
    //     <CustomStatus value="Error With Approval" isRed isExclamationTriangle />
    //   );
    // }

    // if (allocation.isTaAccepted === null) {
    //   return (
    //     <CustomStatus
    //       value="Waiting for response"
    //       isBlue
    //       isExclamationDiamond
    //     />
    //   );
    // } else if (allocation.isTaAccepted === false) {
    //   return <CustomStatus value="You have rejected" isRed isCross />;
    // }

    // if (allocation.isWorkforceApproved === true) {
    //   return <CustomStatus value="Workforce has approved" isGreen isCheck />;
    // } else if (allocation.isWorkforceApproved === false) {
    //   return <CustomStatus value="Workforce has rejected" isRed isCross />;
    // }

    return <CustomStatus value="Error" isRed isCross />;
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
              setSelectedUnitCode(newValue);
            }}
          />
        </Grid>
      </Grid>
      <Box pt={5}>
        <TableContainer component={Paper}>
          <Table
            style={{ borderCollapse: "collapse" }}
            className="grid"
            size="small"
            aria-label="activities table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Unit Code</StyledTableCell>
                <StyledTableCell align="left">Campus</StyledTableCell>
                <StyledTableCell align="left">Activity Group</StyledTableCell>
                <StyledTableCell align="left">Activity Code</StyledTableCell>
                <StyledTableCell align="left">Location </StyledTableCell>
                <StyledTableCell align="left">Day</StyledTableCell>
                <StyledTableCell align="left">Start Time</StyledTableCell>
                <StyledTableCell align="left">End Time</StyledTableCell>
                <StyledTableCell align="left">Student Count</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
                <StyledTableCell align="left">Time Remaining</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAllocations />
              {sortDayTime(allocationsToDisplay).map((allocation, i) => (
                <TableRow key={i}>
                  <TableCell align="left">
                    {allocation.activity.unit.unitCode}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.unit.campus}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.activityGroup}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.activityCode}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.location}
                  </TableCell>
                  <TableCell align="left">
                    {dayConverter(allocation.activity.dayOfWeek)}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.startTime.substring(0, 5)}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.endTime.substring(0, 5)}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.studentCount}
                  </TableCell>
                  <TableCell align="center">
                    {approvalStatus(allocation)}
                  </TableCell>
                  <TableCell align="center">
                    {allocation.isLecturerApproved === true &&
                    allocation.isWorkforceApproved === true &&
                    allocation.isTaAccepted === null ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <CustomButton
                          value=""
                          type="button"
                          isCross
                          isRed
                          isCompact
                          style={{ margin: "0 5px" }}
                          onButtonClick={() => allocationRejected(allocation)}
                        />
                        <CustomButton
                          value=""
                          type="button"
                          isCheck
                          isGreen
                          isCompact
                          style={{ margin: "0 5px" }}
                          onButtonClick={() => allocationApproved(allocation)}
                        />
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell align="left" style={{ padding: 6 }}>
                    {getDaysCountDown(allocation.offerExpiryDate)}
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

export default Activities;
