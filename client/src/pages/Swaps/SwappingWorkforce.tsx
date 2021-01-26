import { Grid, Table, TableRow, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import { Autocomplete } from "@material-ui/lab";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useEffect, useRef, useState } from "react";
import baseApi from "../../apis/baseApi";
import { CustomButton, CustomStatus } from "../../components";

const SwappingWorkforce = () => {
  const [swaps, setSwaps] = useState<ISwap[]>([]);
  const [swapsToDisplay, setSwapsToDisplay] = useState<ISwap[]>([]);
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
  const [hasChanged, setChanged] = useState<Boolean>(false);
  const [openApproval, setOpenApproval] = useState<boolean>(false);
  const [openRejected, setOpenRejected] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const initialRender = useRef(true);

  useEffect(() => {
    setChanged(false);
    const getSwaps = async () => {
      try {
        const res = await baseApi.get(`/swaps`);
        return await res.data;
      } catch (e) {
        console.log("Error fetching swaps");
      }
    };

    getSwaps().then((res) => {
      setSwaps(res);
      setSwapsToDisplay(res);
      // eslint-disable-next-line
      setUpAutoComplete(res);
    });
  }, [hasChanged]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      // Handle autocomplete changes
      let tempArray: ISwap[] = swaps;
      if (selectedYear !== "All") {
        tempArray = tempArray.filter(function (swap) {
          return swap.from.activity.unit.year.toString() === selectedYear;
        });
      }
      if (selectedOfferingPeriod !== "All") {
        tempArray = tempArray.filter(function (swap) {
          return (
            swap.from.activity.unit.offeringPeriod === selectedOfferingPeriod
          );
        });
      }
      if (selectedCampus !== "All") {
        tempArray = tempArray.filter(function (swap) {
          return swap.from.activity.unit.campus === selectedCampus;
        });
      }
      if (selectedUnitCode !== "All") {
        tempArray = tempArray.filter(function (swap) {
          return swap.from.activity.unit.unitCode === selectedUnitCode;
        });
      }

      setSwapsToDisplay(tempArray);
    }
  }, [
    selectedYear,
    selectedCampus,
    selectedOfferingPeriod,
    selectedUnitCode,
    swaps,
  ]);

  function setUpAutoComplete(res: ISwap[]) {
    let uniqueList: string[] = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].from.activity.unit.unitCode)) {
        uniqueList.push(res[i].from.activity.unit.unitCode);
      }
    }
    uniqueList.push("All");
    setUnitCodeOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].from.activity.unit.offeringPeriod)) {
        uniqueList.push(res[i].from.activity.unit.offeringPeriod);
      }
    }
    uniqueList.push("All");
    setOfferingPeriodOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].from.activity.unit.year.toString())) {
        uniqueList.push(res[i].from.activity.unit.year.toString());
      }
    }
    uniqueList.push("All");
    setYearOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].from.activity.unit.campus)) {
        uniqueList.push(res[i].from.activity.unit.campus);
      }
    }
    uniqueList.push("All");
    setCampusOption(uniqueList);
    uniqueList = [];
  }

  const handleWorkforceAccept = async (swap: ISwap) => {
    let result = await baseApi.patch(`/swaps/approveSwapWorkforce/${swap.id}`);
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenApproval(true);
    } else {
      setOpenError(true);
      console.error("error with api call ");
    }
  };

  const handleWorkforceReject = async (swap: ISwap) => {
    let result = await baseApi.delete(`/swaps/rejectSwap/${swap.id}`);
    if (result.statusText === "OK") {
      setChanged(true);
      setOpenRejected(true);
    } else {
      setOpenError(true);
      console.error("error with api call ");
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

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  return (
    <div id="main">
      <h1> Swaps made by Teaching Associates</h1>
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
        {swaps.length > 0 ? (
          <TableContainer component={Paper}>
            <Table className="grid">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Unit Details</StyledTableCell>
                  <StyledTableCell align="left">Swap Details</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {swapsToDisplay.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>No swaps found.</TableCell>
                  </TableRow>
                ) : null}
                {swapsToDisplay.map((swaps, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {" "}
                      {swaps.from.activity.unit.unitCode +
                        "-" +
                        swaps.from.activity.unit.offeringPeriod +
                        "-" +
                        swaps.from.activity.unit.year +
                        "-" +
                        swaps.from.activity.unit.campus}{" "}
                    </TableCell>
                    <TableCell>
                      {swaps.into?.staff.givenNames +
                        " " +
                        swaps.into?.staff.lastName +
                        " has agreed to swap from " +
                        swaps.into?.activity.activityCode +
                        "-" +
                        swaps.into?.activity.activityGroup +
                        " to " +
                        swaps.from.activity.activityCode +
                        "-" +
                        swaps.from.activity.activityGroup +
                        " with " +
                        swaps.from.staff.givenNames +
                        " " +
                        swaps.from.staff.lastName}{" "}
                    </TableCell>
                    <TableCell>
                      {!swaps.workforceApproved ? (
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
                            onButtonClick={() => handleWorkforceReject(swaps)}
                          />
                          <CustomButton
                            value=""
                            type="button"
                            isCheck
                            isGreen
                            isCompact
                            style={{ margin: "0 5px" }}
                            onButtonClick={() => handleWorkforceAccept(swaps)}
                          />
                        </div>
                      ) : (
                        <CustomStatus
                          value="Workforce have approved"
                          isGreen
                          isCheck
                        ></CustomStatus>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div>No swaps have been made for all units you manage.</div>
        )}
        <Snackbar
          open={openApproval}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success">
            You have approved a swap.
          </Alert>
        </Snackbar>
        <Snackbar
          open={openRejected}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success">
            You have rejected a swap.
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

export default SwappingWorkforce;
