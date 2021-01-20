import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DayOfWeek } from "../../enums/DayOfWeek";

import DatabaseFinder from "../../apis/DatabaseFinder";

interface ISwapProps {
  activityId: string;
}

const OfferSwap: React.FC<ISwapProps> = ({ activityId }) => {
  const [activity, setActivity] = useState<IActivity>();
  const [swappableActivities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    const getActivity = async () => {
      const res = await fetch(
        `http://localhost:8888/activities/${activityId}`,
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
      const currentActivity = await res.json();
      setActivity(currentActivity);
    };
    const getSwappable = async () => {
      const res = await fetch(
        `http://localhost:8888/swaps/swappable/${activityId}`,
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
      const options = await res.json();
      setActivities(options);
    };
    getActivity();
    getSwappable();
  }, [activityId]);

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
    <div>
      {activity ? (
        <h5>
          {activity.unit.unitCode} {activity.unit.offeringPeriod}{" "}
          {activity.unit.year}
        </h5>
      ) : null}
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Staff Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {swappableActivities.map((swappable, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {swappable.activityCode}
                </TableCell>
                <TableCell align="left">{swappable.activityGroup}</TableCell>
                <TableCell align="left">{swappable.campus}</TableCell>
                <TableCell align="left">
                  {dayConverter(swappable.dayOfWeek)}
                </TableCell>
                <TableCell align="left">{swappable.location}</TableCell>
                <TableCell align="left">{swappable.startTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OfferSwap;
