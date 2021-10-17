import { CloseCircleFilled } from "@ant-design/icons";
import { useCoreModel } from "models/coreModule";
import React from "react";
export const HideAllIcon = () => {
  return <CloseCircleFilled onClick={useCoreModel.data?.hdieAll} />;
};
