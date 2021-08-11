import { useEffect, useState } from "react";
import React from 'react';
import { classNames } from "utils";

interface ISvgP {
  name: string;
  className?: string,
  click?: () => void
}
const SvgIcon: React.FC<ISvgP> = ({ name, className = "", click = () => { }, children, ...props }) => {
  return (<>
    {/* <span onClick={(e) => {
      e.stopPropagation();
      click();
    }} className={className} > */}
    <svg onClick={e => {
      // e.stopPropagation();
      click();
    }} className={`icon ${className}`} aria-hidden="true" {...props}>
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
    {/* </span> */}
  </>);
}
export default SvgIcon;