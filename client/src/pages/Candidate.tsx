import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Candidate = () => {
  let location = useLocation();

  // TODO: this activityId can use a different way to obtain, such as useparams but it is undefined for some reason if possible someone can solve it
  let activityId = location.pathname.substring(12);
  const [candidatesPreference, setCandidatePreference] = useState<
    IPreferences[]
  >([]);
  const [activity, setActivity] = useState<IActivity>();

  const getCandidatePreference = async () => {
    const res = await fetch(
      "http://localhost:8888/activities/" + activityId + "/candidates/lecturer"
    );
    return res.json();
  };

  // TODO: instead of calling api again, actually can pass the activity object selected to this component, but i also dk how to do it.
  const getActivity = async () => {
    const res = await fetch("http://localhost:8888/activities/" + activityId);
    return res.json();
  };

  useEffect(() => {
    getActivity().then((res) => {
      // console.log(res);
      setActivity(res);
    });
    // console.log(activityId);
    getCandidatePreference().then((res) => {
      // console.log(res);
      setCandidatePreference(res);
    });
  }, []);

  return (
    <div id="main">
      <h1>Available Candidates </h1>
      {activity ? (
        <div>
          <h5>
            {activity.unit.unitCode} {activity.unit.offeringPeriod}{" "}
            {activity.unit.year}
          </h5>
          <h5>
            {activity.activityGroup} {activity.activityCode}{" "}
            {activity.startTime}-{activity.endTime} {activity.dayOfWeek}
          </h5>
        </div>
      ) : (
        console.log(false)
      )}
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Staff First Name</TableCell>
              <TableCell align="right">Staff Last Name</TableCell>
              <TableCell align="right">Preference Score</TableCell>
              <TableCell align="right">Lecturer Score</TableCell>
              <TableCell align="right">Head Tutor Candidate?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidatesPreference.map((candidatePreference, i) => (
              <TableRow key={i}>
                <TableCell>{candidatePreference.staff.givenNames}</TableCell>
                <TableCell align="right">
                  {candidatePreference.staff.lastName}
                </TableCell>
                <TableCell align="right">
                  {candidatePreference.preferenceScore}
                </TableCell>
                <TableCell align="right">
                  {candidatePreference.lecturerScore}
                </TableCell>
                <TableCell align="right">
                  {candidatePreference.isHeadTutorCandidate ? "YES" : "NO"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Candidate;
