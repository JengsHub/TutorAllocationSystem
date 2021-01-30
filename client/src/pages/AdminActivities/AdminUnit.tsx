import React, { useState } from "react";
import StatusLogModal from "../StatusLogModal";
import AdminUnitActivity from "./AdminUnitActivity";

/*
 * Page: Activities
 * This is where admins can view the list of activities and interact with them
 */

const AdminUnit = () => {
  const [statusLogModalOpen, setStatusLogModalOpen] = useState<string | null>(
    null
  );

  return (
    <div id="main">
      <StatusLogModal
        activityId={statusLogModalOpen}
        closeModal={() => setStatusLogModalOpen(null)}
      />
      <h1>Offering</h1>
      <AdminUnitActivity
        {...{
          setStatusLogModalOpen,
        }}
      ></AdminUnitActivity>
    </div>
  );
};

export default AdminUnit;
