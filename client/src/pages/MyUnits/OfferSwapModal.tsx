import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import React from "react";
import Swap from "./OfferSwap";

interface ISwapsModal {
  activityId: string | null;
  closeModal: () => void;
}

const OfferSwapsModal: React.FC<ISwapsModal> = ({ activityId, closeModal }) => {
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
              <Swap activityId={activityId} />
            </Paper>
          </div>
        </Fade>
      ) : (
        <div></div>
      )}
    </Modal>
  );
};

export default OfferSwapsModal;
