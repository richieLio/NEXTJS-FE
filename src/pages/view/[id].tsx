import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useRouter } from 'next/router';

const LiveStreamPage = () => {
  const router = useRouter();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");

  useEffect(() => {
    if (router.query.id) {
      setMyUniqueId(router.query.id as string);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (myUniqueId) {
      let peer: Peer;
      if (typeof window !== 'undefined') {
        peer = new Peer(myUniqueId, {
          host: 'localhost',
          port: 9000,
          path: '/myapp',
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
        });
      }
      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [myUniqueId]);

  return (
    <div className='flex flex-col justify-center items-center p-12'>
      <p>you are watching video stream id : {myUniqueId}</p>
      <video className='w-72' playsInline ref={myVideoRef} autoPlay />
    </div>
  );
};

export default LiveStreamPage;