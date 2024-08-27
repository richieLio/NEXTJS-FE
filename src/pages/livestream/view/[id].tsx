import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/stringeeApi";
import { NextPage } from "next";

const ViewLivestream: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [callClient, setCallClient] = useState<any | null>(null);
  const [room, setRoom] = useState<any | null>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      initializeStringeeClient();
    }
  }, [id]);

  const initializeStringeeClient = async () => {
    if (window.StringeeClient && window.StringeeVideo) {
      const client = new window.StringeeClient();

      client.on("authen", (res: any) => {
        console.log("Client authenticated:", res);
      });

      const userId = `${(Math.random() * 100000).toFixed(6)}`;
      try {
        const userToken = await api.getUserToken(userId);
        console.log("User token obtained:", userToken);
        client.connect(userToken);

        client.on("connect", () => {
          console.log("Client connected");
          setCallClient(client);
        });

        client.on("error", (err: any) => {
          console.error("Client error:", err);
        });
      } catch (err) {
        console.error("Error getting user token:", err);
      }
    } else {
      console.error("StringeeClient or StringeeVideo is not available.");
    }
  };

  const joinRoom = async () => {
    if (!callClient || !id) return;

    try {
      const token = await api.getRoomToken(id as string);
      console.log('Room token obtained:', token);

      if (!token) {
        console.error('Room token is empty.');
        return;
      }

      const roomData = await window.StringeeVideo.joinRoom(callClient, token);
      const room = roomData.room;
      console.log('Room data:', roomData);
      console.log('Joined room:', room);

      if (!room) {
        console.error('Failed to join room.');
        return;
      }

      setRoom(room);

      // Subscribe to existing tracks
      roomData.listTracksInfo.forEach((trackInfo: any) => {
        if (trackInfo.serverId) {
          subscribe(trackInfo);
        }
      });

    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  const subscribe = async (trackInfo: any) => {
    if (!room) return;
    console.log('Subscribing to track:', trackInfo);

    try {
      if (!trackInfo.serverId) {
        console.error('Invalid track serverId:', trackInfo.serverId);
        return;
      }

      const track = await room.subscribe(trackInfo.serverId);
      track.on('ready', () => {
        console.log('Track ready:', track);

        const videoElement = document.createElement('video');
        videoElement.srcObject = track.attach().srcObject;
        videoElement.setAttribute('controls', 'true');
        videoElement.setAttribute('playsinline', 'true');
        videoElement.className = 'w-full max-w-md border mb-4';
        remoteVideosRef.current?.appendChild(videoElement);

        videoElement.oncanplay = () => {
          console.log('Video can play:', videoElement);
          videoElement.play().catch((err) => {
            console.error('Failed to play video:', err);
          });
        };

        videoElement.onerror = (err) => {
          console.error('Video playback error:', err);
        };
      });
    } catch (err) {
      console.error('Failed to subscribe to track:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Watch Livestream</h1>
      <div className="mb-4">
        <button
          onClick={initializeStringeeClient}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
        >
          Initialize Client
        </button>
        <button
          onClick={joinRoom}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Join Room
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Remote Video Feeds</h2>
        <div ref={remoteVideosRef} className="flex flex-wrap gap-4"></div>
      </div>
    </div>
  );
};

export default ViewLivestream;
