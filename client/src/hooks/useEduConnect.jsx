import { useContext } from "react";
import { EduConnectContext } from "../../provider/Provider";

const useEduConnect = () => {
  return useContext(EduConnectContext);
};

export default useEduConnect;