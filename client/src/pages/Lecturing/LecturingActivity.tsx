import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../../enums/DayOfWeek";
import { ApprovalEnum } from "../../enums/ApprovalEnum";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import DatabaseFinder from "../../apis/DatabaseFinder";

const LecturingActivity = (props: { [key: string]: any }) => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [hasChanged, setChanged] = useState<Boolean>(false);

  useEffect(() => {
    let params: { [key: string]: any } = {
      ...props,
    };
    const getActivities = async () => {
      try {
        console.log(params.unitId);
        const res = await fetch(
          `http://localhost:8888/units/${params.unitId}/activities`,
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
  }, [props, hasChanged]);

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

  const allocationApproved = async (allocation: IAllocation) => {
    // TODO: Handle approval
    await DatabaseFinder.post(
      `http://localhost:8888/allocations/approval/${allocation.id}/Lecturer`
    );
    setChanged(true);
  };

  const allocationRejected = async (allocation: IAllocation) => {
    // TODO: Handle approval
    await DatabaseFinder.delete(
      `http://localhost:8888/allocations/${allocation.id}`
    );
    setChanged(true);
  };

  function ApprovalCell(props: { allocation: IAllocation }) {
    const { allocation } = props;
    let approval = allocation.approval;
    switch (approval) {
      case ApprovalEnum.INIT:
        return (
          <>
            <IconButton onClick={() => allocationApproved(allocation)}>
              <DoneIcon />
            </IconButton>
            <IconButton onClick={() => allocationRejected(allocation)}>
              <ClearIcon />
            </IconButton>
          </>
        );
      case ApprovalEnum.LECTURER:
        return (
          <>
            {" "}
            <div> Waiting on TA response to offer </div>
          </>
        );
      case ApprovalEnum.TA:
        return (
          <>
            {" "}
            <div> TA Has Accepted </div>{" "}
          </>
        );
      case ApprovalEnum.WORKFORCE:
        return (
          <>
            {" "}
            <div> Work-Force Have Confirmed </div>{" "}
          </>
        );
      default:
        console.error("Unknown approval");
        return (
          <>
            {" "}
            <div>Errror With Allocations Approval</div>{" "}
          </>
        );
    }
  }

  /*
  NOTE
  For the approval tablecell, we could prob display the status e.g. APPROVED/REJECTED is it has been dealt with. 
  Else, we just provide the buttons for approval/rekjection.
   */
  return (
    <Box>
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
              <TableCell align="center">Allocations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortDayTime(activities).map((activity, i) => (
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
                <TableCell align="left">
                  {activity.allocations.length > 0 ? (
                    activity.allocations.map(
                      (allocation: IAllocation & { [key: string]: any }, j) => (
                        <TableRow key={j}>
                          <TableCell>
                            {" "}
                            {allocation.staff.givenNames}{" "}
                            {allocation.staff.lastName}
                          </TableCell>
                          <TableCell align="right">
                            <ApprovalCell allocation={allocation} />
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableCell> No Allocations Yet </TableCell>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LecturingActivity;
