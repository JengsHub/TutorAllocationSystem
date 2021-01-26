import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import baseApi from "../../apis/baseApi";
import StaffModal from "./StaffModal";

const Staff = () => {
  const [staffs, setStaffs] = useState<IStaff[]>([]);
  const [staffModalOpen, setStaffModalOpen] = useState<string | null>(null);
  const [staffName, setStaffName] = useState<string>("");

  const getAllStaff = async () => {
    try {
      const res = await baseApi.get("/staff/all");
      const jsonData = await res.data;
      setStaffs(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

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
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">AQF</TableCell>
              <TableCell align="right">Studying AQF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.map((staff) => (
              <TableRow>
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
                <TableCell align="right">{staff.email}</TableCell>
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
