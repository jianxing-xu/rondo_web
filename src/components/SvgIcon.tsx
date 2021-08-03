import { useEffect, useState } from "react";
import React from 'react';
import { classNames } from "utils";

interface ISvgP {
  name: string;
  className?: string,
  click?: () => void
}
const SvgIcon: React.FC<ISvgP> = ({ name, className = "", click = () => { console.log("hahah") }, children, ...props }) => {
  return (<>
    <span onClick={click} className={className} >
      <svg className={`icon ${className}`} aria-hidden="true" {...props}>
        <use xlinkHref={`#icon-${name}`}></use>
      </svg>
    </span>
  </>);
}
export default SvgIcon;