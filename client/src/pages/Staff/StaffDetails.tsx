import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import StaffPreferences from "./StaffPreferences";
import Availabilities from "./Availabilities";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

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
          <span>{children}</span>
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
}));

const StaffDetails: React.FC<IStaffDetailsProps> = ({ staffName, staffId }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

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
          <StaffPreferences staffId={staffId} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Availabilities staffId={staffId} />
        </TabPanel>
      </div>
    </div>
  );
};

export default StaffDetails;
