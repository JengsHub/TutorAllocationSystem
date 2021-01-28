import React, { MouseEvent } from "react";
import "./CustomButton.scss";
import classNames from "classnames";
/**
 * This component specifies a custom button
 * Button can be configured with various colours using the following props:
 * isBlue - Blue Button
 * isGreen - Green Button
 * isRed - Red Button
 * isYellow - Yellow Button
 * isGrey - Grey Button
 * 
 * Button can also be configured with various icons using the following props:
 * isCheck - Check or Tick Icon
 * isCross - Cross or 'X' Icon
 * isTrash - Trash or Bin Icon
 * 
 * Button can also be configured with various size using the following props:
 * '' or null - Default Button
 * isSmall - Small Button
 * isCompact - Compact or Round Button
 */
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
