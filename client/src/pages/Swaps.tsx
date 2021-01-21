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
import DatabaseFinder from "../apis/DatabaseFinder";

const Swaps = (props: { [key: string]: any }) => {
  const [hasChanged, setChanged] = useState<Boolean>(false);

  const [openSwaps, setOpenSwaps] = useState<
    (ISwap & { [key: string]: any })[]
  >([]);
  const [mySwaps, setMySwaps] = useState<(ISwap & { [key: string]: any })[]>(
    []
  );

  useEffect(() => {
    setChanged(false);
    let params: { [key: string]: any } = {
      ...props,
    };

    const getOpenSwaps = async () => {
      try {
        const res = await fetch(
          `http://localhost:8888/swaps/openSwaps/${props.unitId}`,
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
        console.log("Error fetching open swaps");
        return [];
      }
    };

    const getMySwaps = async () => {
      try {
        const res = await fetch(
          `http://localhost:8888/swaps/mine/${props.unitId}`,
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
        console.log("Error fetching open swaps");
        return [];
      }
    };

    getMySwaps().then((res) => {
      setMySwaps(res);
    });
    getOpenSwaps().then((res) => {
      setOpenSwaps(res);
    });
  }, [props, hasChanged]);

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

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="activities table">
          <TableHead>
            <TableRow>
              <TableCell align="left">swap id</TableCell>
              <TableCell align="left"> from</TableCell>
              <TableCell align="left">into</TableCell>
              <TableCell align="left">desired</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {openSwaps.map((swap, i) => (
              <TableRow key={i}>
                <TableCell> {swap.id} </TableCell>
                <TableCell>
                  {" "}
                  {swap.from.activity.activityCode}-
                  {swap.from.activity.activityGroup}{" "}
                  {dayConverter(swap.from.activity.dayOfWeek)}{" "}
                </TableCell>
                <TableCell>
                  {" "}
                  {swap.into
                    ? swap.into.activity.activityCode
                    : "not swapped yet"}{" "}
                </TableCell>
                <TableCell>
                  {" "}
                  {swap.desired.activityCode}-{swap.desired.activityGroup}{" "}
                  {dayConverter(swap.desired.dayOfWeek)}{" "}
                </TableCell>
              </TableRow>
            ))}
            {mySwaps.map((swap, i) => (
              <TableRow key={i}>
                <TableCell> {swap.id} </TableCell>
                <TableCell>
                  {" "}
                  {swap.from.activity.activityCode}-
                  {swap.from.activity.activityGroup}{" "}
                  {dayConverter(swap.from.activity.dayOfWeek)}{" "}
                </TableCell>
                <TableCell>
                  {" "}
                  {swap.into
                    ? swap.into.activity.activityCode
                    : "not swapped yet"}{" "}
                </TableCell>
                <TableCell>
                  {" "}
                  {swap.desired.activityCode}-{swap.desired.activityGroup}{" "}
                  {dayConverter(swap.desired.dayOfWeek)}{" "}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Swaps;
