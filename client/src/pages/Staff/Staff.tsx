import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import baseApi from "../../apis/baseApi";
import { IStaff } from "../../types";
import StaffModal from "./StaffModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);

const Staff = () => {
  const [input, setInput] = useState<string>("");
  const [staffs, setStaffs] = useState<IStaff[]>([]);
  const [staffDefault, setStaffsDefault] = useState<IStaff[]>([]);
  const [staffModalOpen, setStaffModalOpen] = useState<string | null>(null);
  const [staffName, setStaffName] = useState<string>("");
  const classes = useStyles();

  const getAllStaff = async () => {
    try {
      const res = await baseApi.get("/staff/all");
      const jsonData = await res.data;
      setStaffs(jsonData);
      setStaffsDefault(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const updateInput = async (input: string) => {
    const filtered = staffDefault.filter((staff) => {
      return (staff.givenNames + " " + staff.lastName)
        .toLowerCase()
        .includes(input.toLowerCase());
    });
    setInput(input);
    setStaffs(filtered);
  };

  const onClickStaff = (staff: IStaff) => {
    setStaffModalOpen(staff.id);
    setStaffName(staff.givenNames + " " + staff.lastName);
  };

  return (
    <div id="main">
      <StaffModal
        staffName={staffName}
        staffId={staffModalOpen}
        closeModal={() => setStaffModalOpen(null)}
      />
      <h1>Staff</h1>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="searchStaffInput"
          label="Search staff"
          variant="outlined"
          value={input}
          onChange={(e) => updateInput(e.target.value)}
        />
      </form>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="right">AQF</TableCell>
              <TableCell align="right">Studying AQF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.map((staff, i) => (
              <TableRow key={i}>
                <TableCell align="left">
                  <u
                    className={"staffTableRow"}
                    key={staff.id}
                    onClick={() => onClickStaff(staff)}
                    style={{
                      color: "blue",
                    }}
                  >
                    {staff.givenNames} {staff.lastName}
                  </u>
                </TableCell>
                <TableCell align="left">{staff.email}</TableCell>
                <TableCell align="right">{staff.aqf}</TableCell>
                <TableCell align="right">{staff.studyingAqf}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Staff;
