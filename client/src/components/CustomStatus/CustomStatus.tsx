import React from "react";
import "./CustomStatus.scss";
import classNames from "classnames";
import { Tooltip } from "@material-ui/core";

interface Props {
  value: string;
  isBlue?: boolean;
  isGreen?: boolean;
  isRed?: boolean;
  isYellow?: boolean;
  isGrey?: boolean;
  isCheck?: boolean;
  isCross?: boolean;
  isHourglass?: boolean;
  isClock?: boolean;
  isExclamationCircle?: boolean;
  isExclamationDiamond?: boolean;
  isExclamationOctagon?: boolean;
  isExclamationSquare?: boolean;
  isExclamationTriangle?: boolean;

  isSmall?: boolean;
  isCompact?: boolean;
}

const CustomStatus: React.FC<Props> = ({
  value,
  isBlue,
  isGreen,
  isRed,
  isYellow,
  isGrey,
  isHourglass,
  isClock,
  isExclamationCircle,
  isExclamationDiamond,
  isExclamationOctagon,
  isExclamationSquare,
  isExclamationTriangle,
  isCheck,
  isCross,
  isSmall,
  isCompact,
}) => {
  const classes = classNames({
    "custom-status": true,
    "custom-status--blue": isBlue,
    "custom-status--green": isGreen,
    "custom-status--red": isRed,
    "custom-status--yellow": isYellow,
    "custom-status--grey": isGrey,
    "custom-status--small": isSmall,
    "custom-status--compact": isCompact,
  });

  const iconClasses = classNames({
    "custom-status__icon--check-icon": isCheck,
    "custom-status__icon--cross-icon": isCross,
    "custom-status__icon--hourglass-icon": isHourglass,
    "custom-status__icon--clock-icon": isClock,
    "custom-status__icon--exclamation-circle-icon": isExclamationCircle,
    "custom-status__icon--exclamation-diamond-icon": isExclamationDiamond,
    "custom-status__icon--exclamation-octagon-icon": isExclamationOctagon,
    "custom-status__icon--exclamation-square-icon": isExclamationSquare,
    "custom-status__icon--exclamation-triangle-icon": isExclamationTriangle,
  });

  return (
    <div className={classes}>
      {isCompact ? (
        <Tooltip title={value}>
          <img className={iconClasses} alt="" />
        </Tooltip>
      ) : (
        <>
          <div className="custom-status__value" style={{ paddingRight: 5 }}>
            {value}
          </div>
          <img className={iconClasses} alt="" />
        </>
      )}
    </div>
  );
};

export default CustomStatus;
