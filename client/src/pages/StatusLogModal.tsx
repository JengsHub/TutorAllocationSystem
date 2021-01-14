import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React from "react";
import StickyHeadTable from "../components/StickyHeadTable";

interface ICandidatesModal {
  allocationId: string | null;
  closeModal: () => void;
}

const StatusLogModal: React.FC<ICandidatesModal> = ({
  allocationId,
  closeModal,
}) => {
  // get the rows of status log
  const statusLogRows = ["qwe"];
  
  // await fetch(
  //   `http://localhost:8888/statuslog/${allocationId}`,
  //   {
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Credentials": "true",
  //     },
  //   }
  // );

  const modalColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { 
      id: 'action', 
      label: 'Action', 
      minWidth: 100 
    },
    { id: 'time', label: 'Time', minWidth: 170 }
  ];
  

  return (
    <Modal
      open={allocationId !== null}
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
      {allocationId ? (
        <Fade in={allocationId !== null}>
          <div style={{ outline: "none" }}>
            <Paper style={{ padding: 20 }}>
              {/* <StickyHeadTable rows={statusLogRows} columns={modalColumns}  /> */}
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