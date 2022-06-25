import { createContext, useContext, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Context {
  socket?: Socket;
  setSocket: (_: Socket) => void;
}

const SocketContext = createContext<Context>({ setSocket: (_: Socket) => {} });

function SocketProvider(): JSX.Element {
  const [socket, setSocket] = useState<Socket>();

  return <SocketContext.Provider value={{ socket, setSocket }} />;
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
