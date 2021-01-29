import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React from "react";
import { IAllocation } from "../../type";
import SwappingActivities from "./SwappingActivities";

//This is the Modal for SwappingActivities

interface ICandidatesModal {
  allocation: IAllocation | null;
  closeModal: () => void;
}

const SwappingModal: React.FC<ICandidatesModal> = ({
  allocation,
  closeModal,
}) => {
  return (
    <Modal
      open={allocation !== null}
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
      {allocation?.id ? (
        <Fade in={allocation !== null}>
          <div style={{ outline: "none" }}>
            <Paper style={{ padding: 20 }}>
              <SwappingActivities allocation={allocation} />
            </Paper>
          </div>
        </Fade>
      ) : (
        <div></div>
      )}
    </Modal>
  );
};

export default SwappingModal;
