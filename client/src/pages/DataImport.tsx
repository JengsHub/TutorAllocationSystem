import { Grid } from "@material-ui/core";
import React from "react";
import AllocateDragDrop from "../components/AllocateDragDrop";
import TasDragDrop from "../components/TasDragDrop";
import TpsDragDrop from "../components/TpsDragDrop";
/*
 * Page: Data Import Page
 * This page displays the Data Import Components and functionalities
 * Users can use this page to import files from Allocate+, TAS and TPS
 */
const DataImport = () => {
  return (
    <div id="main">
      <h1>Data Import</h1>
      <div>
        <Grid container justify="space-evenly">
          <AllocateDragDrop />
          <TasDragDrop />
          <TpsDragDrop />
        </Grid>
      </div>
    </div>
  );
};

export default DataImport;
