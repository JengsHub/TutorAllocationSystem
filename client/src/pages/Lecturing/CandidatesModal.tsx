import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React from "react";
import Candidate from "./Candidate";

interface ICandidatesModal {
  activityId: string | null;
  closeModal: () => void;
  allocationNoReject: number;
}

const CandidatesModal: React.FC<ICandidatesModal> = ({
  activityId,
  closeModal,
  allocationNoReject,
}) => {
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
              <Candidate
                activityId={activityId}
                allocationNoReject={allocationNoReject}
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

export default CandidatesModal;
