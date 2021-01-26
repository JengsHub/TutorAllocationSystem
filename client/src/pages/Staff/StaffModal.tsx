import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React from "react";
import StaffDetails from "./StaffDetails";
// import Candidate from "./Candidate";

interface IStaffModal {
  staffName: string;
  staffId: string | null;
  closeModal: () => void;
}

const StaffModal: React.FC<IStaffModal> = ({
  staffName,
  staffId,
  closeModal,
}) => {
  return (
    <Modal
      open={staffId !== null}
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
      {staffId ? (
        <Fade in={staffId !== null}>
          <div style={{ outline: "none" }}>
            <Paper style={{ padding: 20, width: "80vw", height: "80vh" }}>
              <StaffDetails staffName={staffName} staffId={staffId} />
            </Paper>
          </div>
        </Fade>
      ) : (
        <div></div>
      )}
    </Modal>
  );
};

export default StaffModal;
