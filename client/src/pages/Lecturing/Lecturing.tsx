import React, { useState } from "react";
import StatusLogModal from "../StatusLogModal";
import LecturingActivity from "./LecturingActivity";
/*
 * Page: Offering
 * This is where non-admins see the offerings of units
 * here they can apply to allocate themselves to an activity in an offering.
 */

/**
 * Lecturing component
 * Props: None
 */
const Lecturing = () => {
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
      <LecturingActivity
        {...{
          setStatusLogModalOpen,
        }}
      ></LecturingActivity>
    </div>
  );
};

export default Lecturing;
