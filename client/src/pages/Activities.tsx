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

const Activities = (props: { [key: string]: any }) => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    let params: { [key: string]: any } = {
      ...props,
    };
    const getActivities = async () => {
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

    getActivities().then((res) => {
      setActivities(res);
    });
  }, [props]);

  function EmptyAllocations() {
    if (activities.length === 0) {
      return (
        <TableRow>
          <TableCell align="right">
            You currently have no allocations for this unit.{" "}
          </TableCell>
        </TableRow>
      );
    }
    return <TableRow />;
  }

  const timeReducer = (time: String) =>
    time
      .split(":")
      .map((val) => parseInt(val))
      .reduce((val, total) => val * 60 + total);

  const sortDayTime = (list: IActivity[]) => {
    return list.sort((a, b) => {
      if (
        Object.values(DayOfWeek).indexOf(a.dayOfWeek) <
        Object.values(DayOfWeek).indexOf(b.dayOfWeek)
      ) {
        return -1;
      } else if (
        Object.values(DayOfWeek).indexOf(a.dayOfWeek) >
        Object.values(DayOfWeek).indexOf(b.dayOfWeek)
      ) {
        return 1;
      } else {
        return timeReducer(a.startTime) - timeReducer(b.startTime);
      }
    });
  };

  const dayConverter = (day: string) => {
    if (day === "M") {
      return "Monday";
    } else if (day === " T") {
      return "Tuesday";
    } else if (day === "W") {
      return "Wednesday";
    } else if (day === "Th") {
      return "Thursday";
    } else {
      return "Friday";
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Activity Code</TableCell>
              <TableCell align="left">Activity Group</TableCell>
              <TableCell align="left">Campus</TableCell>
              <TableCell align="left">Day of Week</TableCell>
              <TableCell align="left">Location </TableCell>
              <TableCell align="left">Start Time</TableCell>
              <TableCell align="left">Duration</TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <EmptyAllocations />
            {sortDayTime(activities).map((activity, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {activity.activityCode}
                </TableCell>
                <TableCell align="left">{activity.activityGroup}</TableCell>
                <TableCell align="left">{activity.campus}</TableCell>
                <TableCell align="left">
                  {dayConverter(activity.dayOfWeek)}
                </TableCell>
                <TableCell align="left">{activity.location}</TableCell>
                <TableCell align="left">{activity.startTime}</TableCell>
                <TableCell align="left">{activity.duration}</TableCell>
                <TableCell align="left">TODO: Display status?</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Activities;
