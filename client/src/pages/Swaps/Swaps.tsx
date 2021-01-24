import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../../enums/DayOfWeek";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import { Button, TableContainer } from "@material-ui/core";
import SwappingModal from "./SwappingModal";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import baseApi from "../../apis/baseApi";

const Swaps = (props: { [key: string]: any }) => {
  const [hasChanged, setChanged] = useState<Boolean>(false);

  const [openSwaps, setOpenSwaps] = useState<
    (ISwap & { [key: string]: any })[]
  >([]);
  const [mySwaps, setMySwaps] = useState<(ISwap & { [key: string]: any })[]>(
    []
  );
  const [allocatedActivities, setAllocatedActivities] = useState<
    (IAllocation & { [key: string]: any })[]
  >([]);
  const [modalOpen, setModalOpen] = useState<IAllocation | null>(null);

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
        console.log("Error fetching my swaps");
        console.error(e);
        return [];
      }
    };

    const getAllocatedActivities = async () => {
      try {
        let query = Object.keys(params)
          .filter((key) => params[key] !== undefined)
          .map((key) => `${key}=${params[key]}`)
          .join("&");

        const res = await fetch(
          `http://localhost:8888/allocations/unswapped?${query}`,
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

    getMySwaps().then((res) => {
      setMySwaps(res);
    });
    getOpenSwaps().then((res) => {
      setOpenSwaps(res);
    });

    getAllocatedActivities().then((res) => {
      setAllocatedActivities(res);
    });
  }, [props, hasChanged, modalOpen]);

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

  const getAvailableSwaps = async (
    allocation: IAllocation & { [key: string]: any }
  ) => {
    setModalOpen(allocation);
  };

  const deleteSwap = async (swap: ISwap) => {
    await baseApi.delete(`/swaps/${swap.id}`);
    setChanged(true);
  };

  const acceptSwap = async (swap: ISwap) => {
    await baseApi.post("/swaps/acceptSwap", swap);
    setChanged(true);
  };

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  return (
    <div>
      <Box>
        <SwappingModal
          allocation={modalOpen}
          closeModal={() => setModalOpen(null)}
        />
        {allocatedActivities.length > 0 ? (
          <>
            <h2>My Activities</h2>
            <TableContainer component={Paper}>
              <Table className="grid">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">
                      Activity Code
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Activity Group
                    </StyledTableCell>
                    <StyledTableCell align="left">Campus</StyledTableCell>
                    <StyledTableCell align="left">Day of Week</StyledTableCell>
                    <StyledTableCell align="left">Location </StyledTableCell>
                    <StyledTableCell align="left">Start Time</StyledTableCell>
                    <StyledTableCell align="center">Swap</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocatedActivities.map((allocation, i) => (
                    <TableRow key={i}>
                      <TableCell align="left">
                        {allocation.activity.activityCode}
                      </TableCell>
                      <TableCell align="left">
                        {allocation.activity.activityGroup}
                      </TableCell>
                      <TableCell align="left">
                        {allocation.activity.campus}
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
                        <Button
                          onClick={() => getAvailableSwaps(allocation)}
                          variant="contained"
                          color="primary"
                        >
                          Offer Swap
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <h2> Swaps to consider </h2>
            <TableContainer component={Paper}>
              <Table className="grid">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">From</StyledTableCell>
                    <StyledTableCell align="left">Into</StyledTableCell>
                    <StyledTableCell align="left">Desired</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                {openSwaps.length < 1 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4}>None Available.</TableCell>
                    </TableRow>
                  </TableBody>
                ) : null}
                <TableBody>
                  {openSwaps.map((swap, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {" "}
                        {swap.from.activity.activityCode}-
                        {swap.from.activity.activityGroup}{" "}
                        {dayConverter(swap.from.activity.dayOfWeek)}{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {swap.into?.activity
                          ? swap.into.activity.activityCode
                          : "Not swapped yet"}{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {swap.desired.activityCode}-{swap.desired.activityGroup}{" "}
                        {dayConverter(swap.desired.dayOfWeek)}{" "}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => acceptSwap(swap)}
                          variant="contained"
                          color="primary"
                        >
                          Accept Swap
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <div>
              <Box pt={1} pb={1}>
                <h2> No activities you can offer a swap for.</h2>
              </Box>
            </div>
          </>
        )}
        {mySwaps.length > 0 ? (
          <>
            <h2> My open swaps </h2>
            <TableContainer component={Paper}>
              <Table className="grid">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">From</StyledTableCell>
                    <StyledTableCell align="left">Into</StyledTableCell>
                    <StyledTableCell align="left">Desired</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mySwaps.map((swap, i) => (
                    <TableRow key={i}>
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
                          : "Not swapped yet"}{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {swap.desired.activityCode}-{swap.desired.activityGroup}{" "}
                        {dayConverter(swap.desired.dayOfWeek)}{" "}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => deleteSwap(swap)}
                          variant="contained"
                          color="secondary"
                        >
                          Retract Swap
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>{" "}
            </TableContainer>
          </>
        ) : (
          <>
            <div>
              <h2> You have no open swaps for this unit.</h2>
            </div>
          </>
        )}
      </Box>
    </div>
  );
};

export default Swaps;
