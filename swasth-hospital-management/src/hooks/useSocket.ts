import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

export const useSocket = (patientId: string) => {
  const socket = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_BASE_URL || '', {
      path: '/api/socketio',
      autoConnect: true
    });

    socket.current.emit('join-patient-room', patientId);

    return () => {
      if (socket.current) {
        socket.current.emit('leave-patient-room', patientId);
        socket.current.disconnect();
      }
    };
  }, [patientId]);

  const subscribeToUpdates = (callback: (data: any) => void) => {
    if (socket.current) {
      socket.current.on('patient-updated', callback);
    }
  };

  const unsubscribeFromUpdates = (callback: (data: any) => void) => {
    if (socket.current) {
      socket.current.off('patient-updated', callback);
    }
  };

  const emitUpdate = (data: any) => {
    if (socket.current) {
      socket.current.emit('update-patient', {
        patientId,
        ...data,
      });
    }
  };

  return {
    subscribeToUpdates,
    unsubscribeFromUpdates,
    emitUpdate,
  };
}; 