import React, { MouseEvent } from "react";
import { CustomButton, CustomStatus } from "../components";

const Dashboard = () => {
  const handleButtonClick = (event: MouseEvent) => {
    console.log(event);
  };

  return (
    <div id="main">
      <h1>Dashboard</h1>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Default Button</span>
          <CustomButton
            id="red-btn"
            value=""
            type="button"
            isCross
            isRed
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="green-btn"
            value=""
            type="button"
            isCheck
            isGreen
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="trash-btn"
            value=""
            type="button"
            isRed
            isTrash
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="swap-btn"
            value="Swap"
            type="button"
            isBlue
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="cancel-swap-btn"
            value="Cancel Swap"
            type="button"
            isRed
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="add-btn"
            value="Add"
            type="button"
            isGrey
            onButtonClick={handleButtonClick}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Small Button</span>
          <CustomButton
            id="red-btn"
            value=""
            type="button"
            isCross
            isRed
            isSmall
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="green-btn"
            value=""
            type="button"
            isCheck
            isGreen
            isSmall
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="trash-btn"
            value=""
            type="button"
            isRed
            isTrash
            isSmall
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="swap-btn"
            value="Swap"
            type="button"
            isBlue
            isSmall
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="cancel-swap-btn"
            value="Cancel Swap"
            type="button"
            isRed
            isSmall
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="add-btn"
            value="Add"
            type="button"
            isGrey
            isSmall
            onButtonClick={handleButtonClick}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Compact Button</span>
          <CustomButton
            id="red-btn"
            value=""
            type="button"
            isCross
            isRed
            isCompact
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="green-btn"
            value=""
            type="button"
            isCheck
            isGreen
            isCompact
            onButtonClick={handleButtonClick}
          />
          <CustomButton
            id="trash-btn"
            value=""
            type="button"
            isRed
            isTrash
            isCompact
            onButtonClick={handleButtonClick}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Default Status</span>
          <CustomStatus
            id="waiting-res-btn"
            value="Waiting for response"
            isBlue
            isClock
          />
          <CustomStatus
            id="waiting-res-btn"
            value="Error With Approval"
            isRed
            isExclamationTriangle
          />
          <CustomStatus
            id="waiting-res-btn"
            value="Swap Offered"
            isGreen
            isExclamationCircle
          />
          <CustomStatus id="yellow-btn" value="Accepted Offer" isBlue isCheck />
          <CustomStatus id="yellow-btn" value="Confirmed" isGreen isCheck />
          <CustomStatus
            id="yellow-btn"
            value="Swap Available"
            isYellow
            isExclamationDiamond
          />
          <CustomStatus
            id="yellow-btn"
            value="Accepted Offer"
            isGreen
            isCheck
          />

          <CustomStatus
            id="yellow-btn"
            value="TA has rejected"
            isRed
            isExclamationTriangle
          />
          <CustomStatus
            id="yellow-btn"
            value="Workforce has approved"
            isGreen
            isCheck
          />
          <CustomStatus
            id="yellow-btn"
            value="Workforce has rejected"
            isRed
            isCross
          />
          <CustomStatus
            id="yellow-btn"
            value="Lecturer has approved"
            isGreen
            isCheck
          />
          <CustomStatus id="yellow-btn" value="No actions yet" isGrey />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Small Status</span>
          <CustomStatus
            id="waiting-res-btn"
            value="Waiting for response"
            isBlue
            isClock
            isSmall
          />
          <CustomStatus
            id="waiting-res-btn"
            value="Error With Approval"
            isRed
            isExclamationTriangle
            isSmall
          />
          <CustomStatus
            id="waiting-res-btn"
            value="Swap Offered"
            isGreen
            isExclamationCircle
            isSmall
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Compact Status</span>
          <CustomStatus
            id="waiting-res-btn"
            value="Waiting for response"
            isBlue
            isClock
            isCompact
          />
          <CustomStatus
            id="waiting-res-btn"
            value="Error With Approval"
            isRed
            isExclamationTriangle
            isCompact
          />
          <CustomStatus
            id="waiting-res-btn"
            value="Swap Offered"
            isGreen
            isExclamationCircle
            isCompact
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
