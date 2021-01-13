import React from "react";
import "./CustomButton.scss";
import classNames from 'classnames';

interface Props {
    value:string;
    id:string;
    type: "submit" | "button" | "reset";
    isBlue?:boolean;
    isGreen?:boolean;
    isRed?:boolean;
    isYellow?:boolean;
    isCheck?:boolean;
    isCross?:boolean;
    isTrash?:boolean;
    isDisabled?:boolean;
    onButtonClick?: () => {};
}

const CustomButton: React.FC<Props> = ({value,id,type,isBlue,isGreen,isRed,isYellow,isTrash,isCheck,isCross,isDisabled,onButtonClick}) => {
  const classes = classNames({
    "custom-btn": true,
    "custom-btn--blue": isBlue,
    "custom-btn--green": isGreen,
    "custom-btn--red": isRed,
    "custom-btn--yellow": isYellow,
    "custom-btn--isCheck": isCheck,
    "custom-btn--isCross": isCross,
    "custom-btn--isTrash": isTrash,
  });


  return (
    <button
      className={classes}
      type={type}
      id={id}
      onClick={onButtonClick}
      disabled={isDisabled}
    >
      {value}
    </button>
  );
};

export default CustomButton;
