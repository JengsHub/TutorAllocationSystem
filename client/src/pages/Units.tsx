import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Units = () => {
  const [units, setUnits] = useState<IPreferences[]>([]);

  useEffect(() => {
    // let user: IStaff | undefined;
    const getUnits = async () => {
      try {
        const res = await fetch(`http://localhost:8888/staffpreferences/mine`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
        });
        return await res.json();
      } catch (err) {
        console.log("No preferences found");
        return [];
      }
    };

    getUnits().then((res) => {
      // console.log(res);
      sortPreferenceScore(res, "desc");
      setUnits(res || []);
    });
  }, []);

  const sortPreferenceScore = (list: IPreferences[], way: String) => {
    console.log(list);
    list.sort((a, b) => {
      if (way === "desc") {
        return b.preferenceScore > a.preferenceScore
          ? 1
          : b.preferenceScore < a.preferenceScore
          ? -1
          : 0;
      } else {
        return a.preferenceScore > b.preferenceScore
          ? 1
          : a.preferenceScore < b.preferenceScore
          ? -1
          : 0;
      }
    });
  };

  return (
    <div id="main">
      <h1>My Units</h1>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Unit Code</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">AQF Target</TableCell>
              <TableCell align="center">Your Preference Score </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.unit.unitCode + "-"  + row.unit.campus + "-" + row.unit.offeringPeriod} </TableCell>
                <TableCell align="right">{row.unit.year}</TableCell>
                <TableCell align="right">{row.unit.aqfTarget}</TableCell>
                <TableCell align="center">{row.preferenceScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Units;
