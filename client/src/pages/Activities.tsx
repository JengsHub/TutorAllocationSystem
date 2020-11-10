import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const Activities = () => {
  const [activities, setActivities] = useState<IActivity[]>([])
  
  const getActivities = async()=>{
    const res = await fetch("http://localhost:8888/activities");
    return res.json();
  }

  useEffect(() => {
    getActivities().then((res) => {
      // console.log(res);
      setActivities(res)});
  }, [])

  // if(activities.length > 0){
  // console.log(activities[0].allocations)}
  
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
            <TableCell align="right">Unit Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity, i) => (
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
              <TableCell align="right">{activity.unitId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default Activities;