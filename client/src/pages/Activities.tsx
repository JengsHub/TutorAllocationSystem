import React, { useState, useEffect, useRef } from "react";
import { DayOfWeek } from "../enums/DayOfWeek";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles, Grid, TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { CustomButton, CustomStatus } from "../components";
import "../index.css";
import baseApi from "../apis/baseApi";

const Activities = () => {
  const [allocations, setAllocations] = useState<
    (myAllocations & { [key: string]: any })[]
  >([]);

  const [allocationsToDisplay, setAllocationsToDisplay] = useState<
    (myAllocations & { [key: string]: any })[]
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
      let tempArray: (myAllocations & { [key: string]: any })[] = allocations;
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

  function setUpAutoComplete(res: myAllocations & { [key: string]: any }[]) {
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

  const allocationApproved = async (
    allocation: myAllocations & { [key: string]: any }
  ) => {
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

  const allocationRejected = async (
    allocation: myAllocations & { [key: string]: any }
  ) => {
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

  const approvalStatus = (
    allocation: myAllocations & { [key: string]: any }
  ) => {
    if (!allocation.isLecturerApproved) {
      return (
        <CustomStatus value="Error With Approval" isRed isExclamationTriangle />
      );
    }

    if (allocation.isTaAccepted === null) {
      return (
        <CustomStatus
          value="Waiting for response"
          isBlue
          isExclamationDiamond
        />
      );
    } else if (allocation.isTaAccepted === false) {
      return <CustomStatus value="TA has rejected" isRed isCross />;
    }

    if (allocation.isWorkforceApproved === true) {
      return <CustomStatus value="Workforce has approved" isGreen isCheck />;
    } else if (allocation.isWorkforceApproved === false) {
      return <CustomStatus value="Workforce has rejected" isRed isCross />;
    }

    return (
      <CustomStatus value="Waiting for Workforce approval" isBlue isCheck />
    );
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
              // @ts-ignore
              setSelectedUnitCode(newValue);
            }}
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
              {sortDayTime(allocationsToDisplay).map((allocation, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
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
                    {dayConverter(allocation.activity.dayOfWeek)}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.location}
                  </TableCell>
                  <TableCell align="left">
                    {allocation.activity.startTime}
                  </TableCell>
                  <TableCell align="center">
                    {approvalStatus(allocation)}
                  </TableCell>
                  <TableCell align="center">
                    {allocation.isLecturerApproved === true &&
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
