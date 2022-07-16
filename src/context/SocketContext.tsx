import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Context {
  socket?: Socket;
  setSocket: (_: Socket) => void;
}

const SocketContext = createContext<Context>({
  setSocket: (_: Socket) => {},
});

function SocketProvider(props: PropsWithChildren<unknown>): JSX.Element {
  const [socket, setSocket] = useState<Socket>();

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>{props.children}</SocketContext.Provider>
  );
}

export const useSocket: () => Context = () => useContext(SocketContext);

export default SocketProvider;
