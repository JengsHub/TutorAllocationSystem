import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import Activities from "./Activities";

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

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  function Row(props: { row: IPreferences}){
    const { row } = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <Button onClick={() => setOpen(!open)}>{ row.unit.unitCode + "-" + row.unit.campus + "-" + row.unit.offeringPeriod } </Button>
          </TableCell>
          <TableCell align="right">{row.unit.year}</TableCell>
          <TableCell align="right">{row.unit.aqfTarget}</TableCell>
          <TableCell align="center">{row.preferenceScore}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style = {{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin = {1}>
                <Typography variant="h6" gutterBottom component="div"> My Allocations for {row.unit.unitCode} </Typography>
                  <Activities></Activities>
                </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

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
              <Row key={row.id} row = {row}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Units;
