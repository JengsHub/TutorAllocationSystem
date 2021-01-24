import React, { MouseEvent } from "react";
import "./CustomButton.scss";
import classNames from "classnames";

interface Props {
  value: string;
  type: "submit" | "button" | "reset";
  isBlue?: boolean;
  isGreen?: boolean;
  isRed?: boolean;
  isYellow?: boolean;
  isGrey?: boolean;
  isCheck?: boolean;
  isCross?: boolean;
  isTrash?: boolean;
  isDisabled?: boolean;
  isSmall?: boolean;
  isCompact?: boolean;
  style?: React.CSSProperties;
  onButtonClick?: (event: MouseEvent) => void;
}

const CustomButton: React.FC<Props> = ({
  value,
  type,
  isBlue,
  isGreen,
  isRed,
  isYellow,
  isGrey,
  isTrash,
  isCheck,
  isCross,
  isDisabled,
  isSmall,
  isCompact,
  onButtonClick,
  style,
}) => {
  const classes = classNames({
    "custom-btn": true,
    "custom-btn--blue": isBlue,
    "custom-btn--green": isGreen,
    "custom-btn--red": isRed,
    "custom-btn--yellow": isYellow,
    "custom-btn--grey": isGrey,
    "custom-btn--small": isSmall,
    "custom-btn--compact": isCompact,
  });

  const iconClasses = classNames({
    "custom-btn__icon--check-icon": isCheck,
    "custom-btn__icon--cross-icon": isCross,
    "custom-btn__icon--trash-icon": isTrash,
  });

  return (
    <button
      className={classes}
      type={type}
      onClick={onButtonClick}
      disabled={isDisabled}
      style={style}
    >
      {value ? value : <img className={iconClasses} alt="" />}
    </button>
  );
};

export default CustomButton;
