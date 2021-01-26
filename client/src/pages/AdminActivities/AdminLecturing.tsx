// import { makeStyles } from "@material-ui/core";
// import Box from "@material-ui/core/Box";
// import Button from "@material-ui/core/Button";
// import Collapse from "@material-ui/core/Collapse";
// import Paper from "@material-ui/core/Paper";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import baseApi from "../../apis/baseApi";
import StatusLogModal from "../StatusLogModal";
import CandidatesModal from "./CandidatesModal";
import LecturingActivity from "./LecturingActivity";

const Lecturing = () => {
  // const [units, setUnits] = useState<IUnit[]>([]);
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [statusLogModalOpen, setStatusLogModalOpen] = useState<string | null>(
    null
  );

  useEffect(() => {
    // let user: IStaff | undefined;
    const getUnits = async () => {
      try {
        const res = await baseApi.get("/units/all");
        return await res.data;
      } catch (err) {
        console.error(err);
        return [];
      }
    };

    getUnits().then((res) => {
      // setUnits(res || []);
    });
  }, []);

  // const [openRows, setOpenRows] = useState<boolean[]>(
  //   Array(units.length).fill(false)
  // );

  // const useRowStyles = makeStyles({
  //   root: {
  //     "& > *": {
  //       borderBottom: "unset",
  //     },
  //   },
  // });

  // function Row(props: { row: IUnit & { [key: string]: any } }) {
  //   const { row } = props;
  //   const [open, setOpen] = useState(false);
  //   const classes = useRowStyles();
  //   return (
  //     <React.Fragment>
  //       <TableRow className={classes.root}>
  //         <TableCell>
  //           <Button onClick={() => setOpen(!open)}>
  //             {row.unitCode + "-" + row.campus + "-" + row.offeringPeriod}{" "}
  //           </Button>
  //         </TableCell>
  //         <TableCell align="right">{row.year}</TableCell>
  //         <TableCell align="right">{row.aqfTarget}</TableCell>
  //         <TableCell align="center">{row.activities.length}</TableCell>
  //       </TableRow>
  //       <TableRow>
  //         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
  //           <Collapse in={open} timeout="auto" unmountOnExit>
  //             <Box margin={1}>
  //               <Typography variant="h6" gutterBottom component="div">
  //                 {" "}
  //                 The activities of {row.unitCode}{" "}
  //               </Typography>
  //               <LecturingActivity
  //                 {...{
  //                   // unitId: row.id,
  //                   setModalOpen,
  //                 }}
  //               ></LecturingActivity>
  //             </Box>
  //           </Collapse>
  //         </TableCell>
  //       </TableRow>
  //     </React.Fragment>
  //   );
  // }

  return (
    <div id="main">
      <CandidatesModal
        activityId={modalOpen}
        closeModal={() => setModalOpen(null)}
      />
      <StatusLogModal
        activityId={statusLogModalOpen}
        closeModal={() => setStatusLogModalOpen(null)}
      />
      <h1>Offering</h1>
      <LecturingActivity
        {...{
          setModalOpen,
          setStatusLogModalOpen,
        }}
      ></LecturingActivity>
    </div>
  );
};

export default Lecturing;
