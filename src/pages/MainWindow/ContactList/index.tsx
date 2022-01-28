import React from "react";
import { classNames } from "utils";
import _ from "./index.module.css";

export const ContactList: React.FC = () => {
  return <div className={classNames(_.contacts)}>ContactList</div>;
};
