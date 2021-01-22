import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Swaps from "./Swaps";

const Swapping = () => {
  const [units, setUnits] = useState<IPreferences[]>([]);

  useEffect(() => {
    // let user: IStaff | undefined;
    const getUnits = async () => {
      try {
        const res = await fetch(`http://localhost:8888/staffpreferences/mine`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
        });
        return await res.json();
      } catch (err) {
        console.log("No preferences found");
        return [];
      }
    };

    getUnits().then((res) => {
      // console.log(res);
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

  function Row(props: { row: IPreferences }) {
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
            }}
          ></Swaps>
        </Box>
      </React.Fragment>
    );
  }

  const sortPreferenceScore = (list: IPreferences[], way: String) => {
    console.log(list);
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
      {units.map((row) => (
        <Row key={row.id} row={row} />
      ))}
    </div>
  );
};

export default Swapping;
