import React, { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';

interface VideoConsultationProps {
  appointmentId: string;
  patientId: string;
  doctorId: string;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({
  appointmentId,
  patientId,
  doctorId,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = getSocket();

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setupPeerConnection(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
    };
  }, []);

  const setupPeerConnection = (stream: MediaStream) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    stream.getTracks().forEach(track => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle signaling
    socket.on('offer', async (offer) => {
      await peerConnection.current?.setRemoteDescription(offer);
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer);
      socket.emit('answer', { answer, appointmentId });
    });

    socket.on('answer', async (answer) => {
      await peerConnection.current?.setRemoteDescription(answer);
    });

    socket.on('ice-candidate', async (candidate) => {
      await peerConnection.current?.addIceCandidate(candidate);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          appointmentId,
        });
      }
    };
  };

  const startCall = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer);
    socket.emit('offer', { offer, appointmentId });
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="relative">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg"
        />
        <div className="absolute bottom-4 left-4 space-x-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
            End Call
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">
            Mute
          </button>
        </div>
      </div>
      <div className="relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default VideoConsultation; 