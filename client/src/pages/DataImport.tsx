import React from "react";
import AllocateDragDrop from "../components/AllocateDragDrop"
import TasDragDrop from "../components/TasDragDrop"
import TpsDragDrop from "../components/TpsDragDrop"
import {Grid} from "@material-ui/core"

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
