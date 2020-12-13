import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Activities = () => {
  const [unitCode, setUnitCode] = useState("");
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [searchedActivities, setDisplay] = useState<IActivity[]>([]);
  const history = useHistory();

  // const [getCandidatePreference setActivityCandidate]
  const getActivities = async () => {
    const res = await fetch("http://localhost:8888/activities");
    return res.json();
  };

  useEffect(() => {
    getActivities().then((res) => {
      // console.log(res);
      setActivities(res);
    });
  }, []);

  // this will allow user to search for the unit that they are looking for
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplay([]);
    activities.forEach((activity) => {
      if (activity.unit.unitCode === unitCode) {
        setDisplay((display) => [...display, activity]);
      }
    });
  };

  // click on a row of table will bring you to a page which will show the available candidates pool for that activity
  const handleClick = (
    event: React.MouseEvent<unknown>,
    activity: IActivity
  ) => {
    console.log(activity);
    history.push("candidates/" + activity.id);
  };

  return (
    <div id="main">
      <h1>Activity</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={unitCode}
            onChange={handleInputChange}
            placeholder="Enter a unit code..."
          ></input>
          <button className="icon-button" type="submit">
            Submit
          </button>
          <div>{unitCode}</div>
        </div>
      </form>

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
            {searchedActivities.map((activity, i) => (
              <TableRow
                hover
                onClick={(event) => handleClick(event, searchedActivities[i])}
                key={i}
              >
                <TableCell component="th" scope="row">
                  {activity.activityCode}
                </TableCell>
                <TableCell align="right">{activity.activityGroup}</TableCell>
                <TableCell align="right">{activity.campus}</TableCell>
                <TableCell align="right">{activity.dayOfWeek}</TableCell>
                <TableCell align="right">{activity.location}</TableCell>
                <TableCell align="right">{activity.startTime}</TableCell>
                <TableCell align="right">{activity.endTime}</TableCell>
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
