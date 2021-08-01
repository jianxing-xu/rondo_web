import { createModel } from "hox";


function globalModel() { }

export const useGlobalModel = createModel(globalModel);