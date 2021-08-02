import { useEffect, useState } from "react";
import React from 'react';

interface ISvgP {
  name: string;
}
const SvgIcon: React.FC<ISvgP> = ({ name, children, ...props }) => {
  console.log(name, children, props);
  return (<>

  </>);
}
export default SvgIcon;