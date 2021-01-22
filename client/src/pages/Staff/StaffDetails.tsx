import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { getStaffPreference, getAvailability } from "../../apis/api";

interface IStaffDetailsProps {
  staffName: string;
  staffId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    width: "100%",
    // minWidth: 650,
    // minHeight: 500,
  },
}));

const StaffDetails: React.FC<IStaffDetailsProps> = ({ staffName, staffId }) => {
  const [staffPreferences, setStaffPreferences] = useState<IPreferences[]>([]);
  const [availabilities, setAvailabilities] = useState<IAvailability[]>([]);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (staffId) {
      getStaffPreference(staffId).then((res) => {
        setStaffPreferences(res);
      });
      getAvailability(staffId).then((res) => {
        setAvailabilities(res);
      });
    }
  }, [staffId]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <h3>{staffName}</h3>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Preferences" />
            <Tab label="Availabilities" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <TableContainer component={Paper} className={classes.table}>
            <Table className={""} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Unit Code</TableCell>
                  <TableCell align="right">Offering period</TableCell>
                  <TableCell align="right">Year</TableCell>
                  <TableCell align="right">Campus</TableCell>
                  <TableCell align="right">Preference Score</TableCell>
                  <TableCell align="right">Lecturer Score</TableCell>
                  <TableCell align="right">Head Tutor Candidate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffPreferences.map((staffPreference) => (
                  <TableRow>
                    <TableCell align="left">
                      {staffPreference.unit.unitCode}
                    </TableCell>
                    <TableCell align="right">
                      {staffPreference.unit.offeringPeriod}
                    </TableCell>
                    <TableCell align="right">
                      {staffPreference.unit.year}
                    </TableCell>
                    <TableCell align="right">
                      {staffPreference.unit.campus}
                    </TableCell>
                    <TableCell align="right">
                      {staffPreference.preferenceScore}
                    </TableCell>
                    <TableCell align="right">
                      {staffPreference.lecturerScore}
                    </TableCell>
                    <TableCell align="right">
                      {staffPreference.isHeadTutorCandidate ? "YES" : "NO"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {availabilities.length > 0 ? (
            <h4>
              Max hours:{availabilities[0].maxHours} Max activities:
              {availabilities[0].maxNumberActivities}
            </h4>
          ) : (
            <h4>Max hours: Max activities: </h4>
          )}
          <TableContainer component={Paper} className={classes.table}>
            <Table className={""} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Day</TableCell>
                  <TableCell align="left">Start time</TableCell>
                  <TableCell align="right">End time</TableCell>
                  <TableCell align="right">Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availabilities.map((availability) => (
                  <TableRow>
                    <TableCell align="left">{availability.day}</TableCell>
                    <TableCell align="left">{availability.startTime}</TableCell>
                    <TableCell align="right">{availability.endTime}</TableCell>
                    <TableCell align="right">{availability.year}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </div>
    </div>
  );
};

export default StaffDetails;
