import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useRouter } from "next/router";

const ViewLiveStreamPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [streamerId, setStreamerId] = useState<string>("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const id = router.query.id as string;
    if (id) setStreamerId(id);
  }, [router.query.id]);

  useEffect(() => {
    if (streamerId) {
      let peer: Peer;
      if (typeof window !== "undefined") {
        peer = new Peer({
          host: window.location.hostname,
          port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT || "4000"),
          path: "/myapp",
          secure: process.env.NODE_ENV === "production",
        });

        setPeerInstance(peer);

        peer.on("open", () => {
          navigator.mediaDevices
            .getUserMedia({
              video: true,
              audio: true,
            })
            .then((stream) => {
              setLocalStream(stream);

              const call = peer.call(streamerId, stream);
              call.on("stream", (remoteStream) => {
                if (videoRef.current) {
                  videoRef.current.srcObject = remoteStream;
                  videoRef.current.play();
                }
              });
            })
            .catch((error) => {
              console.error("Error accessing media devices.", error);
            });
        });

        return () => {
          if (peer) peer.destroy();
        };
      }
    }
  }, [streamerId]);

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <p>Viewing Streamer ID: {streamerId}</p>
      <video className="w-72" playsInline ref={videoRef} autoPlay />
    </div>
  );
};

export default ViewLiveStreamPage;
