import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (serverPath: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(serverPath);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverPath]);

  return socketRef;
};

export default useSocket;
