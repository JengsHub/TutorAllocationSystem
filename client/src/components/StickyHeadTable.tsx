import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import { ActionEnums } from "../enums/ActionEnum";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable(input: any) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  let rows: any[] = [];
  for (let i = 0; i < input.rows.length; i++) {
    let row = input.rows[i];
    let statusLogObject;
    if (row.targetStaff == null) {
      statusLogObject = {
        user: row.staff.givenNames + " " + row.staff.lastName,
        action: row.action,
        target: " ",
        time: row.time,
      };
    } else {
      statusLogObject = {
        user: row.staff.givenNames + " " + row.staff.lastName,
        action: row.action,
        target: row.targetStaff.givenNames + " " + row.targetStaff.lastName,
        time: row.time,
      };
    }

    rows.push(statusLogObject);
  }

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "#c0c0c0",
    },
  }))(TableCell);

  const columns = input.columns;
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // console.log("inside table");
  // console.log(rows);
  // console.log(columns);

  const customTableCell = (row: any) => {
    if (
      row["action"] === ActionEnums.LECTURER_PROPOSE ||
      row["action"] === ActionEnums.WORKFORCE_PROPOSE ||
      row["action"] === ActionEnums.WORKFORCE_APPROVE ||
      row["action"] === ActionEnums.LECTURER_APPROVE
    ) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>
            {" "}
            {row["action"]} <b>{row["target"]}</b>
          </span>
          <ErrorOutlineIcon style={{ color: "#ff9800" }} />
        </div>
      );
    } else if (
      row["action"] === ActionEnums.LECTURER_REJECT ||
      row["action"] === ActionEnums.WORKFORCE_REJECT
    ) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>
            {" "}
            {row["action"]} <b>{row["target"]}</b>
          </span>
          <CancelOutlinedIcon color="secondary" />
        </div>
      );
    } else if (row["action"] === ActionEnums.TA_ACCEPT) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span> {row["action"]} </span>
          <CheckCircleOutlineOutlinedIcon style={{ color: "#4caf50" }} />
        </div>
      );
    } else if (row["action"] === ActionEnums.TA_REJECT) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span> {row["action"]} </span>
          <CancelOutlinedIcon color="secondary" />
        </div>
      );
    }

    return <div>Something went wrong.</div>;
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table className="grid" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {/* {columns.map((column:any) => ( */}
              {columns.map((column: any) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    <TableCell> {row["user"]} </TableCell>
                    <TableCell>{customTableCell(row)}</TableCell>
                    <TableCell> {row["time"]} </TableCell>
                    {/* {columns.map((column: any) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {customTableCell(value)}
                        </TableCell>
                      );
                    })} */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
