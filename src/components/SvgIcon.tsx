import { useEffect, useState, forwardRef } from "react";
import React from "react";
import { classNames } from "utils";

interface ISvgP {
  name: string;
  className?: string;
  stop?: boolean;
  click?: () => void;
}
const SvgIcon: React.FC<ISvgP> = forwardRef(
  (
    {
      name,
      className = "",
      click = () => {},
      children,
      stop = false,
      ...props
    },
    ref: any
  ) => {
    return (
      <>
        <span
          onClick={(e) => {
            click();
            if (stop) {
              e.stopPropagation();
            }
          }}
          className={className}
        >
          <svg
            className={`icon ${className}`}
            aria-hidden="true"
            {...props}
            ref={ref}
          >
            <use xlinkHref={`#icon-${name}`}></use>
          </svg>
        </span>
      </>
    );
  }
);
export default SvgIcon;
