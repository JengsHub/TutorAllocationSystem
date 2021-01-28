import Box from "@material-ui/core/Box";
import React, { useEffect, useState } from "react";
import baseApi from "../../apis/baseApi";
import Swaps from "./Swaps";
import { IPreference } from "../../type";

const Swapping = () => {
  const [units, setUnits] = useState<IPreference[]>([]);

  useEffect(() => {
    // let user: IStaff | undefined;
    const getUnits = async () => {
      try {
        const res = await baseApi.get(`/staffpreferences/mine`);
        return await res.data;
      } catch (err) {
        console.log("No preferences found");
        return [];
      }
    };

    getUnits().then((res) => {
      sortPreferenceScore(res, "desc");
      setUnits(res || []);
    });
  }, []);

  //   const useRowStyles = makeStyles({
  //     root: {
  //       "& > *": {
  //         borderBottom: "unset",
  //       },
  //     },
  //     header: {
  //       fontSize: "large",
  //     },
  //   });

  function Row(props: { row: IPreference }) {
    const { row } = props;

    return (
      <React.Fragment>
        <Box margin={1}>
          <h1>
            {" "}
            {row.unit.unitCode +
              "-" +
              row.unit.offeringPeriod +
              "-" +
              row.unit.year}{" "}
          </h1>
          <Swaps
            {...{
              unitId: row.unitId,
              isLecturerApproved: true,
              isWorkforceApproved: true,
            }}
          ></Swaps>
        </Box>
      </React.Fragment>
    );
  }

  const sortPreferenceScore = (list: IPreference[], way: String) => {
    list.sort((a, b) => {
      if (way === "desc") {
        return b.preferenceScore > a.preferenceScore
          ? 1
          : b.preferenceScore < a.preferenceScore
          ? -1
          : 0;
      } else {
        return a.preferenceScore > b.preferenceScore
          ? 1
          : a.preferenceScore < b.preferenceScore
          ? -1
          : 0;
      }
    });
  };

  return (
    <div id="main">
      {units.length < 1 ? <h1>No activities found for any unit.</h1> : null}
      {units.map((row) => (
        <Row key={row.id} row={row} />
      ))}
    </div>
  );
};

export default Swapping;
