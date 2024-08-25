import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useRouter } from 'next/router';

const LiveStreamPage = () => {
  const router = useRouter();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");

  useEffect(() => {
    const id = router.query.id as string;
    if (id) setMyUniqueId(id);
  }, [router.query.id]);

  useEffect(() => {
    if (myUniqueId) {
      let peer: Peer;
      if (typeof window !== 'undefined') {
        peer = new Peer(myUniqueId, {
          host: window.location.hostname,
          port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT || '4000'),
          path: '/myapp',
          secure: process.env.NODE_ENV === 'production',
        });

        setPeerInstance(peer);

        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }).then(stream => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
          peer.on('call', call => {
            call.answer(stream);
          });
        }).catch(error => {
          console.error("Error accessing media devices.", error);
        });
      }
      return () => {
        if (peer) peer.destroy();
      };
    }
  }, [myUniqueId]);

  return (
    <div className='flex flex-col justify-center items-center p-12'>
      <p>Your ID: {myUniqueId}</p>
      <video className='w-72' playsInline ref={myVideoRef} autoPlay />
    </div>
  );
};

export default LiveStreamPage;
