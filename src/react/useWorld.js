import { useContext } from "react";

import Context from "./Context";

const useWorld = () => {
  const { world } = useContext(Context);
  return world;
};

export default useWorld;
