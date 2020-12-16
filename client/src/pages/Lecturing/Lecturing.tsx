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
import LecturingActivity from "./LecturingActivity";

const Lecturing = () => {
  const [units, setUnits] = useState<IUnit[] & { [key: string]: any }>([]);

  useEffect(() => {
    // let user: IStaff | undefined;
    const getUnits = async () => {
      try {
        const res = await fetch(`http://localhost:8888/units/byRole/Lecturer`, {
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
        console.log("No units found with lecturer roll");
        console.error(err);
        return [];
      }
    };

    getUnits().then((res) => {
      setUnits(res || []);
    });
  }, []);

  const useRowStyles = makeStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
  });

  function Row(props: { row: IUnit & { [key: string]: any } }) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <Button onClick={() => setOpen(!open)}>
              {row.unitCode + "-" + row.campus + "-" + row.offeringPeriod}{" "}
            </Button>
          </TableCell>
          <TableCell align="right">{row.year}</TableCell>
          <TableCell align="right">{row.aqfTarget}</TableCell>
          <TableCell align="center">{row.activities.length}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  {" "}
                  The activites of {row.unitCode}{" "}
                </Typography>
                <LecturingActivity
                  {...{
                    unitId: row.id,
                  }}
                ></LecturingActivity>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

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
              <TableCell align="center">Activites in this Unit </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Lecturing;
