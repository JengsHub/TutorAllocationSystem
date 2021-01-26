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
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import baseApi from "../../apis/baseApi";
import { DayOfWeek } from "../../enums/DayOfWeek";

interface ICandidateProps {
  allocation: IAllocation;
}

const SwappingActivities: React.FC<ICandidateProps> = ({ allocation }) => {
  const [swappableActivities, setSwappableActivity] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity>();
  const [openRequest, setOpenRequest] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    const getSwappableActivities = async () => {
      try {
        const res = await baseApi.get(
          `/swaps/swappable/${allocation.activity.id}`
        );
        return await res.data;
      } catch (e) {
        console.log("Error fetching open swaps");
        return [];
      }
    };

    if (allocation) {
      getSwappableActivities().then((res) => {
        setSwappableActivity(res);
      });
    } else {
      history.push("/404");
    }
  }, [allocation, history]);

  const handleClick = (activity: IActivity) => {
    setSelectedActivity(activity);
  };

  const createSwap = async () => {
    if (selectedActivity) {
      let swap: Swap = {
        fromAllocationId: allocation.id,
        desiredActivityId: selectedActivity.id,
      };
      try {
        let result = await baseApi.post("/swaps", swap);
        if (result.statusText === "OK") {
          setOpenRequest(true);
        }
      } catch (e) {
        setOpenError(true);
      }
    }
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

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenRequest(false);
    setOpenError(false);
  };

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  return (
    <div>
      <h1>
        Available Swaps for{" "}
        {allocation.activity.activityCode +
          " " +
          allocation.activity.activityGroup}{" "}
      </h1>
      <TableContainer component={Paper}>
        <Table className="grid">
          <TableHead>
            <TableRow>
              <StyledTableCell> </StyledTableCell>
              <StyledTableCell align="left">Activity Code</StyledTableCell>
              <StyledTableCell align="left">Activity Group</StyledTableCell>
              <StyledTableCell align="left">Campus</StyledTableCell>
              <StyledTableCell align="left">Day of Week</StyledTableCell>
              <StyledTableCell align="left">Location </StyledTableCell>
              <StyledTableCell align="left">Start Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell> From: </TableCell>
              <TableCell align="left">
                {" "}
                {allocation.activity.activityCode}{" "}
              </TableCell>
              <TableCell align="left">
                {" "}
                {allocation.activity.activityGroup}{" "}
              </TableCell>
              <TableCell align="left"> {allocation.activity.campus} </TableCell>
              <TableCell align="left">
                {" "}
                {dayConverter(allocation.activity.dayOfWeek)}{" "}
              </TableCell>
              <TableCell align="left">
                {" "}
                {allocation.activity.location}{" "}
              </TableCell>
              <TableCell align="left">
                {" "}
                {allocation.activity.startTime}{" "}
              </TableCell>
            </TableRow>
            {selectedActivity ? (
              <TableRow>
                <TableCell> To: </TableCell>
                <TableCell align="left">
                  {" "}
                  {selectedActivity.activityCode}{" "}
                </TableCell>
                <TableCell align="left">
                  {" "}
                  {selectedActivity.activityGroup}{" "}
                </TableCell>
                <TableCell align="left"> {selectedActivity.campus} </TableCell>
                <TableCell align="left">
                  {" "}
                  {dayConverter(selectedActivity.dayOfWeek)}{" "}
                </TableCell>
                <TableCell align="left">
                  {" "}
                  {selectedActivity.location}{" "}
                </TableCell>
                <TableCell align="left">
                  {" "}
                  {selectedActivity.startTime}{" "}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell> To: </TableCell>
                <TableCell align="left"> - </TableCell>
                <TableCell align="left"> - </TableCell>
                <TableCell align="left"> - </TableCell>
                <TableCell align="left"> - </TableCell>
                <TableCell align="left"> - </TableCell>
                <TableCell align="left"> - </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <h1> Swappable Activities </h1>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Activity Code</StyledTableCell>
              <StyledTableCell align="left">Activity Group</StyledTableCell>
              <StyledTableCell align="left">Campus</StyledTableCell>
              <StyledTableCell align="left">Day of Week</StyledTableCell>
              <StyledTableCell align="left">Location </StyledTableCell>
              <StyledTableCell align="left">Start Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {swappableActivities.map((activity, i) => (
              <TableRow key={i} onClick={() => handleClick(activity)} hover>
                <TableCell align="left"> {activity.activityCode} </TableCell>
                <TableCell align="left"> {activity.activityGroup} </TableCell>
                <TableCell align="left"> {activity.campus} </TableCell>
                <TableCell align="left">
                  {" "}
                  {dayConverter(activity.dayOfWeek)}{" "}
                </TableCell>
                <TableCell align="left"> {activity.location} </TableCell>
                <TableCell align="left"> {activity.startTime} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        onClick={createSwap}
        variant="contained"
        style={{ marginTop: 20 }}
        color="primary"
      >
        {" "}
        Request Swap{" "}
      </Button>
      <Snackbar
        open={openRequest}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          You have requested a swap.
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Request may have been made. If you do not think so, please try again.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SwappingActivities;
