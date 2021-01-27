import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React, { useEffect, useState } from "react";
import baseApi from "../apis/baseApi";
import StickyHeadTable from "../components/StickyHeadTable";
import { IStatusLogWithStaff } from "../type";

interface IStatusLogModal {
  activityId: string | null;
  closeModal: () => void;
}

const StatusLogModal: React.FC<IStatusLogModal> = ({
  activityId,
  closeModal,
}) => {
  const [statusLog, setStatusLog] = useState<Object[]>([]);
  const [hasChanged, setChanged] = useState<Boolean>(false);

  useEffect(() => {
    setChanged(false);
    /**
     * Gets all the status logs from the backend given the activity id associated with allocation
     * @param activityId id of the activity
     */
    const getStatusLogs = async (activityId: string | null) => {
      let statusLogs: Array<IStatusLogWithStaff> = [];
      // get all the allocations associated with the activity id
      let allocationsResponse = await baseApi(
        `/activities/${activityId}/allocation`
      );
      let allocations = allocationsResponse.data;
      // loop through the allocations and get the associated status logs
      for (let i = 0; i < allocations.length; i++) {
        let allocationId = allocations[i].id;
        let statusLogsResponse = await baseApi(
          `statuslog/${allocationId}/staffs`
        );
        let statusLogJson: IStatusLogWithStaff[] = await statusLogsResponse.data;
        statusLogs = statusLogs.concat(statusLogJson);
      }
      //Sort the status logs by date from newest to oldest
      if (statusLogs.length > 0) {
        sortStatusLogsByDate(statusLogs);
      }
      return statusLogs;
    };

    getStatusLogs(activityId).then((res) => {
      setStatusLog(res || []);
      console.log(res);
    });
  }, [activityId, hasChanged]);

  function sortStatusLogsByDate(statusLogs: Array<IStatusLogWithStaff>) {
    statusLogs = statusLogs.sort(function (
      a: IStatusLogWithStaff,
      b: IStatusLogWithStaff
    ) {
      let a_year = a.time.slice(6, 10);
      let b_year = b.time.slice(6, 10);
      let a_month = a.time.slice(3, 5);
      let b_month = b.time.slice(3, 5);
      let a_day = a.time.slice(0, 2);
      let b_day = b.time.slice(0, 2);
      let a_hour = a.time.slice(11, 13);
      let b_hour = b.time.slice(11, 13);
      let a_minute = a.time.slice(14, 16);
      let b_minute = b.time.slice(14, 16);
      let a_second = a.time.slice(17, 19);
      let b_second = b.time.slice(17, 19);
      if (a_year < b_year) {
        return 1;
      } else if (a_year > b_year) {
        return -1;
      }
      if (a_month < b_month) {
        return 1;
      } else if (a_month > b_month) {
        return -1;
      }
      if (a_day < b_day) {
        return 1;
      } else if (a_day > b_day) {
        return -1;
      }
      if (a_hour < b_hour) {
        return 1;
      } else if (a_hour > b_hour) {
        return -1;
      }
      if (a_minute < b_minute) {
        return 1;
      } else if (a_minute > b_minute) {
        return -1;
      }
      if (a_second < b_second) {
        return 1;
      } else if (a_second > b_second) {
        return -1;
      }
      return 0;
    });
  }

  // Columns of the status log modal
  const modalColumns = [
    { id: "user", label: "User", minWidth: 170 },
    {
      id: "action",
      label: "Action",
      minWidth: 100,
    },
    { id: "time", label: "Time", minWidth: 170 },
  ];

  return (
    <Modal
      open={activityId !== null}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {activityId ? (
        <Fade in={activityId !== null}>
          <div style={{ outline: "none" }}>
            <Paper style={{ padding: 20 }}>
              <h2 id="simple-modal-title" className="alignleft">
                Status Log
              </h2>
              <StickyHeadTable rows={statusLog} columns={modalColumns} />
            </Paper>
          </div>
        </Fade>
      ) : (
        <div></div>
      )}
    </Modal>
  );
};

export default StatusLogModal;
