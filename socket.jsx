import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { server } from "./src/constants/config";

const getSocket = () => useContext(SocketContext);

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, getSocket };
