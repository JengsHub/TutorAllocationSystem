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
import React, { useState, useEffect } from "react";
import { RoleEnum } from "../enums/RoleEnum";
import baseApi from "../apis/baseApi";
import { IRole, IStaff, IUnit } from "../types";
import { useRef } from "react";

/***
 * TODO:
 * - Clean up code
 * - Refactor out the editable table as a component
 * (if we intend to reuse this type of table elsewhere)
 * - Avoid `any` type
 * - Secure this route only for Admin role
 */
interface IRow {
  title: string;
  newTitle: string;
  roleId: string;
  unit: IUnit;
  unitId: string;
  staff: IStaff;
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
          value={row.newTitle ? row.newTitle : row.title}
          name={name}
          onChange={(e) => onChange(e, row)}
        >
          <MenuItem value={RoleEnum.LECTURER}>Lecturer</MenuItem>
          <MenuItem value={RoleEnum.TA}>TA</MenuItem>
        </Select>
      ) : (
        row.title
      )}
    </TableCell>
  );
};

const UnitRoles = () => {
  // const { adminAccess } = React.useContext(AuthContext);
  const [userRoles, setUserRoles] = useState<IRole[]>([]);
  const [rolesToDisplay, setRolesToDisplay] = useState<IRole[]>([]);
  const [rows, setRows] = useState<IRow[]>([]);
  const [previous, setPrevious] = React.useState<any>({});
  const classes = useStyles();

  const [unitCodeOption, setUnitCodeOption] = useState<string[]>([]);
  const [yearOption, setYearOption] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<any>("All");
  const [selectedUnit, setSelectedUnit] = useState<any>("All");

  const [hasChanged, setChanged] = useState<Boolean>(false);
  const initialRender = useRef(true);

  useEffect(() => {
    setChanged(false);
    const getUserRoles = async () => {
      try {
        const res = await baseApi.get("/roles");
        return await res.data;
      } catch (e) {
        console.log("Error fetching roles", e);
        return [];
      }
    };

    getUserRoles().then((res) => {
      setUserRoles(res);
      setRolesToDisplay(res);
      setUpAutoComplete(res);
    });
  }, [hasChanged]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      let tempArray: (IRole & { [key: string]: any })[] = userRoles;
      if (selectedPeriod !== "All") {
        tempArray = tempArray.filter(function (role) {
          return role.unit.year.toString() === selectedPeriod;
        });
      }
      if (selectedUnit !== "All") {
        tempArray = tempArray.filter(function (role) {
          return role.unit.unitCode === selectedUnit;
        });
      }

      setRolesToDisplay(tempArray);
    }
  }, [userRoles, selectedPeriod, selectedUnit]);

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

    const data = rows.find((r) => r.id === id);
    if (data) {
      console.log(data);
      // TODO: handle status of request to provide feedback to user, especially if update failed
      await baseApi.put(`/roles/unit/${data.unitId}`, {
        title: data.title,
        staffId: data.staffId,
      });
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
    console.log(userRoles);
    const resJson = rolesToDisplay.map((e: any, index: number) => ({
      ...e,
      id: index,
    }));
    setRows(resJson);
  };

  function setUpAutoComplete(res: IRole & { [key: string]: any }[]) {
    let uniqueList: string[] = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].unit.unitCode)) {
        uniqueList.push(res[i].unit.unitCode);
      }
    }
    uniqueList.push("All");
    setUnitCodeOption(uniqueList);
    uniqueList = [];

    for (let i = 0; i < res.length; i++) {
      if (!uniqueList.includes(res[i].unit.year.toString())) {
        uniqueList.push(res[i].unit.year.toString());
      }
    }
    uniqueList.push("All");
    setYearOption(uniqueList);
    uniqueList = [];
  }

  // TODO: fetch data from backend
  // const teachingPeriods = [{ year: 2020 }, { year: 2019 }];
  // const units = [{ unitCode: "FIT3170" }, { unitCode: "FIT2100" }];

  return (
    <div id="main">
      <h1> Unit Roles </h1>
      {/* <div>Admin access: {adminAccess.toString()}</div> */}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            options={yearOption}
            getOptionLabel={(option) => option.toString()}
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
            options={unitCodeOption}
            getOptionLabel={(option) => option}
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
                <TableCell>{row.unit.unitCode}</TableCell>
                <TableCell>
                  {row.staff.givenNames} {row.staff.lastName}
                </TableCell>
                <TableCell>{row.staff.email}</TableCell>

                <CustomTableCell
                  {...{ row, name: "title", onChange: onChange }}
                ></CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UnitRoles;
