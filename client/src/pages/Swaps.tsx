import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../enums/DayOfWeek";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import { Button } from "@material-ui/core";
import SwappingModal from "./SwappingModal";
import DatabaseFinder from "../apis/DatabaseFinder";

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
          `http://localhost:8888/allocations/mine?${query}`,
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

  const getAvailableSwaps = async (
    allocation: IAllocation & { [key: string]: any }
  ) => {
    setModalOpen(allocation);
  };

  const deleteSwap = async (swap: ISwap) => {
    DatabaseFinder.delete(`/swaps/${swap.id}`);
    setChanged(true);
  };

  const acceptSwap = async (swap: ISwap) => {
    DatabaseFinder.post("/swaps/acceptSwap", swap);
    setChanged(true);
  };

  return (
    <Box>
      <SwappingModal
        allocation={modalOpen}
        closeModal={() => setModalOpen(null)}
      />
      {allocatedActivities.length > 0 ? (
        <div>
          <h2>My Activities</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Activity Code</TableCell>
                <TableCell align="left">Activity Group</TableCell>
                <TableCell align="left">Campus</TableCell>
                <TableCell align="left">Day of Week</TableCell>
                <TableCell align="left">Location </TableCell>
                <TableCell align="left">Start Time</TableCell>
                <TableCell align="left">Swap</TableCell>
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
                  <TableCell>
                    <Button onClick={() => getAvailableSwaps(allocation)}>
                      Offer Swap
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <h2> Swaps to consider </h2>
          <Box>
            <Table className={""} size="small" aria-label="activities table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Swap id</TableCell>
                  <TableCell align="left">From</TableCell>
                  <TableCell align="left">Into</TableCell>
                  <TableCell align="left">Desired</TableCell>
                  <TableCell> </TableCell>
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
                      {swap.into?.activity
                        ? swap.into.activity.activityCode
                        : "not swapped yet"}{" "}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {swap.desired.activityCode}-{swap.desired.activityGroup}{" "}
                      {dayConverter(swap.desired.dayOfWeek)}{" "}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => acceptSwap(swap)}>
                        Accept Swap
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h2> My open swaps </h2>
            <Table className={""} size="small" aria-label="activities table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Swap id</TableCell>
                  <TableCell align="left">From</TableCell>
                  <TableCell align="left">Into</TableCell>
                  <TableCell align="left">Desired</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
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
                    <TableCell>
                      <Button onClick={() => deleteSwap(swap)}>
                        Retract Swap
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </div>
      ) : (
        <div>
          <h2> You currently have no allocated activites for this unit.</h2>
        </div>
      )}
    </Box>
  );
};

export default Swaps;
