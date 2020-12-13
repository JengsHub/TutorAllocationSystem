import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../enums/DayOfWeek";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Activities = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [sortedField, setSort] = useState<string>("dayTime")

  useEffect(() => {
    let user: IStaff | undefined;
    const getActivities = async () => {
      const authRes = await fetch("http://localhost:8888/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
      });
  
      const jsonRes = await authRes.json();
      user = jsonRes.user;
  
      if (user) {
        const res = await fetch(
          `http://localhost:8888/allocations/mine/${user.id}`
        );
        return await res.json();
      }
      return [];
    };

    getActivities().then((res) => {
      // console.log(res);
      setActivities(res);
    });
  }, []);

  const timeReducer = (time: String) => time.split(":").map(val => parseInt(val)).reduce((val, total) => val*60 + total)

  const sortDayTime = (list: IActivity[]) => {
    return list.sort((a, b) => {
      if (Object.values(DayOfWeek).indexOf(a.dayOfWeek) < Object.values(DayOfWeek).indexOf(b.dayOfWeek)) {return -1}
      else if (Object.values(DayOfWeek).indexOf(a.dayOfWeek) > Object.values(DayOfWeek).indexOf(b.dayOfWeek)) {return 1}
      else {
        return timeReducer(a.startTime) - timeReducer(b.startTime)
      } 
    })
  }

  return (
    <div id="main">
      <h1>Activities</h1>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Activity Code</TableCell>
              <TableCell align="right">Activity Group</TableCell>
              <TableCell align="right">Campus</TableCell>
              <TableCell align="right">Day of Week</TableCell>
              <TableCell align="right">Location </TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Unit Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortDayTime(activities)
            .map((activity, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {activity.activityCode}
                </TableCell>
                <TableCell align="right">{activity.activityGroup}</TableCell>
                <TableCell align="right">{activity.campus}</TableCell>
                <TableCell align="right">{activity.dayOfWeek}</TableCell>
                <TableCell align="right">{activity.location}</TableCell>
                <TableCell align="right">{activity.startTime}</TableCell>
                <TableCell align="right">{activity.duration}</TableCell>
                <TableCell align="right">{activity.unit.unitCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Activities;
