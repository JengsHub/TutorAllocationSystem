import React from "react";
import { CustomButton } from "../components";

const Dashboard = () => {
  return (
    <div id="main">
      <h1>Dashboard</h1>
      <CustomButton id='red-btn' value='' isCross type="button" isRed/>
      <CustomButton id='green-btn' value='' isCheck type="button" isGreen/>
      <CustomButton id='green-btn' value='' isTrash type="button" isRed/>

      <CustomButton id='waiting-res-btn' value='Waiting for response' type="button" isBlue/>
      <CustomButton id='yellow-btn' value='Accepted Offer' type="button" isYellow/>
      <CustomButton id='yellow-btn' value='Confirmed' type="button" isGreen/>



    </div>
  );
};

export default Dashboard;
