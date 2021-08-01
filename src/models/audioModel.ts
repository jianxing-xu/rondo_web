import { createModel } from "hox";
import { useState } from "react";

function audioModel() {
  const [curTim, setCurtim] = useState(0);
}

export const useAudioModel = createModel(audioModel);