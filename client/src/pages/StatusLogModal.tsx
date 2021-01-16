import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React, { useEffect, useState } from "react";
import StickyHeadTable from "../components/StickyHeadTable";

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
  
  useEffect(()=>{
    setChanged(false);
    /**
     * Gets all the status logs from the backend given the activity id associated with allocation
     * @param activityId id of the activity
     */
    const getStatusLogs = async(activityId: string | null) => {
      let statusLogs: Array<Object> = [];
      // get all the allocations associated with the activity id
      let allocationsResponse = await fetch(
        `http://localhost:8888/activities/${activityId}/allocation`
      );
      let allocations = await allocationsResponse.json();
      // loop through the allocations and get the associated status logs
      for (let i = 0; i < allocations.length; i++) {
        let allocationId = allocations[i].id;
        let statusLogsResponse = await fetch(
          `http://localhost:8888/statuslog/${allocationId}/staffs`
        );
        let statusLogJson: Object[] = await statusLogsResponse.json();
  
        statusLogs = statusLogs.concat(statusLogJson);
      }


      return statusLogs;
    }

    getStatusLogs(activityId).then((res) => {
      setStatusLog(res || []);
    });
    
  }, [activityId, hasChanged]);

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
              <StickyHeadTable
                rows={statusLog}
                columns={modalColumns}
              />
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
