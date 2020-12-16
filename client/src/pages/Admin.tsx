import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Clear, Done, Edit } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { RoleEnum } from "../enums/RoleEnum";
import { AuthContext } from "../session";

/***
 * TODO:
 * - Clean up code
 * - Refactor out the editable table as a component
 * - Avoid `any` type
 * - Secure this route only for Admin role
 */
interface IRow {
  role: string;
  roleId: string;
  unitCode: string;
  unitId: string;
  givenNames: string;
  lastName: string;
  email: string;
  id: number;
  isEditMode: boolean;
  staffId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
}));

const CustomTableCell = ({ row, name, onChange }: any) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Select
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
        >
          <MenuItem value={RoleEnum.LECTURER}>Lecturer</MenuItem>
          <MenuItem value={RoleEnum.TA}>TA</MenuItem>
        </Select>
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

const Admin = () => {
  const { adminAccess } = React.useContext(AuthContext);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [rows, setRows] = useState<IRow[]>([]);
  const [previous, setPrevious] = React.useState<any>({});
  const classes = useStyles();

  const onToggleEditMode = (id: number) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onSaveChange = async (id: number) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });

    // TODO: send request to update role
    console.log("TODO: send request to update role");
    const data = rows.find((r) => r.id === id);
    if (data) {
      const res = await fetch(
        `http://localhost:8888/roles/unit/${data.unitId}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            title: data.role,
            staffId: data.staffId
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }
  };

  const onChange = (e: any, row: IRow) => {
    if (!previous[row.id]) {
      setPrevious((state: any) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = (id: number) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        let r = previous[id] ? previous[id] : row;
        r.isEditMode = !r.isEditMode;
        return r;
      }
      return row;
    });
    setRows(newRows);
    setPrevious((state: any[]) => {
      delete state[id];
      return state;
    });
  };

  const fetchStaff = async () => {
    let values = {
      unitCode: selectedUnit ? selectedUnit.unitCode : null,
      year: selectedPeriod ? selectedPeriod.year : null,
    };

    let params = {};
    // TODO: better way to do this
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        // @ts-ignore
        params[key] = value;
      }
    }

    const res = await fetch(
      "http://localhost:8888/staff?" + new URLSearchParams(params),
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );

    // TODO: better way for row id?
    const resJson = (await res.json()).map((e: any, index: number) => ({
      ...e,
      id: index,
    }));
    console.log(resJson);
    setRows(resJson);
  };

  // TODO: fetch data from backend
  const teachingPeriods = [{ year: 2020 }, { year: 2019 }];
  const units = [{ unitCode: "FIT3170" }, { unitCode: "FIT2100" }];

  return (
    <div id="main">
      <h1> Admin </h1>
      {/* <div>Admin access: {adminAccess.toString()}</div> */}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            options={teachingPeriods}
            getOptionLabel={(option) => option.year.toString()}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teaching period"
                variant="outlined"
              />
            )}
            value={selectedPeriod}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedPeriod(newValue);
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            options={units}
            getOptionLabel={(option) => option.unitCode}
            renderInput={(params) => (
              <TextField {...params} label="Unit" variant="outlined" />
            )}
            disabled={selectedPeriod === null}
            value={selectedUnit}
            onChange={(event, newValue) => {
              // @ts-ignore
              setSelectedUnit(newValue);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedPeriod === null}
            onClick={fetchStaff}
          >
            SELECT
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className={classes.selectTableCell}>
                  {row.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={() => onSaveChange(row.id)}
                      >
                        <Done />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(row.id)}
                      >
                        <Clear />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="delete"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <Edit />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>{row.unitCode}</TableCell>
                <TableCell>
                  {row.givenNames} {row.lastName}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                {/* <TableCell>{row.role}</TableCell> */}
                <CustomTableCell
                  {...{ row, name: "role", onChange }}
                ></CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Admin;
