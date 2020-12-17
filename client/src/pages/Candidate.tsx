import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import DatabaseFinder from "../apis/DatabaseFinder";

const Candidate = () => {
  let location = useLocation();

  // TODO: this activityId can use a different way to obtain, such as useparams
  // but it is undefined for some reason if possible someone can solve it
  let activityId = location.pathname.substring(12);
  const [candidatesPreference, setCandidatePreference] = useState<
    IPreferences[]
  >([]);
  const [activity, setActivity] = useState<IActivity>();
  const [selecteds, setSelected] = useState<number[]>([]);

  const getCandidatePreference = async () => {
    const res = await fetch(
      "http://localhost:8888/activities/" + activityId + "/candidates/lecturer"
    );
    return res.json();
  };

  // TODO: instead of calling api again, actually can pass the activity object
  // selected to this component, but i also dk how to do it.
  const getActivity = async () => {
    const res = await fetch("http://localhost:8888/activities/" + activityId);
    return res.json();
  };

  useEffect(() => {
    getActivity().then((res) => {
      // console.log(res);
      setActivity(res);
    });
    console.log(activityId);
    getCandidatePreference().then((res) => {
      // console.log(res);
      setCandidatePreference(res);
    });
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = candidatesPreference.map((_, i) => i);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, i: number) => {
    const selectedIndex = selecteds.indexOf(i);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selecteds, i);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selecteds.slice(1));
    } else if (selectedIndex === selecteds.length - 1) {
      newSelected = newSelected.concat(selecteds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selecteds.slice(0, selectedIndex),
        selecteds.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const makeOffers = () => {
    console.log(selecteds);
    selecteds.forEach(async (i) => {
      console.log(candidatesPreference[i]);
      var allocation: Allocation = {
        activityId: activityId,
        staffId: candidatesPreference[i].staffId,
      };
      try {
        await DatabaseFinder.post("/allocations", allocation);
      } catch (err) {
        throw err;
      }
    });
    setSelected([]);
    
    getCandidatePreference().then((res) => {
      // console.log(res);
      setCandidatePreference(res);
    });
  };
  const isSelected = (i: number) => selecteds.indexOf(i) !== -1;

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
      ) : null}
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={
                    selecteds.length > 0 &&
                    selecteds.length < candidatesPreference.length
                  }
                  checked={
                    selecteds.length > 0 &&
                    selecteds.length == candidatesPreference.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Staff First Name</TableCell>
              <TableCell align="right">Staff Last Name</TableCell>
              <TableCell align="right">Preference Score</TableCell>
              <TableCell align="right">Lecturer Score</TableCell>
              <TableCell align="right">Head Tutor Candidate?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidatesPreference.map((candidatePreference, i) => (
              <TableRow key={i} onClick={(event) => handleClick(event, i)}>
                <TableCell>
                  <Checkbox checked={isSelected(i)}/>
                </TableCell>
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
      <Button onClick={makeOffers}> Request Offer</Button>
    </div>
  );
};

export default Candidate;
