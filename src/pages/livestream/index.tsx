import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { NextPage } from "next";
import { api } from "@/lib/stringeeApi"; // Adjust the path if necessary

const Livestreams: NextPage = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [callClient, setCallClient] = useState<any | null>(null);
  const [room, setRoom] = useState<any | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false); // New state for stopping
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [viewerCount, setViewerCount] = useState(0);
  useEffect(() => {
    const initializeStringeeClient = async () => {
      if (window.StringeeClient && window.StringeeVideo) {
        const client = new window.StringeeClient();

        client.on("authen", (res: any) => {
          console.log("on authen:", res);
        });

        const userId = `${(Math.random() * 100000).toFixed(6)}`;
        try {
          const userToken = await api.getUserToken(userId);
          client.connect(userToken);

          client.on('connect', () => {
            setCallClient(client);
          });

          client.on('error', (err: any) => {
            console.error('Connection failed:', err);
          });
        } catch (error) {
          console.error("Error fetching user token:", error);
        }
      } else {
        console.error("StringeeClient or StringeeVideo is not available.");
      }
    };

    if (
      typeof window !== "undefined" &&
      window.StringeeClient &&
      window.StringeeVideo
    ) {
      initializeStringeeClient();
    }
  }, []);

  const handleStartLivestream = async () => {
    if (!callClient) {
      console.error("StringeeClient instance is not initialized.");
      return;
    }

    if (isStarting) {
      console.log("Livestream is already starting.");
      return;
    }

    setIsStarting(true);

    try {
      await api.setRestToken();
      const room = await api.createRoom();
      const token = await api.getRoomToken(room.roomId);

      setCurrentRoomId(room.roomId);
      setRoomToken(token);

      await startLivestreaming(room.roomId, token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
      } else {
        console.error("Unknown Error:", error);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const startLivestreaming = async (roomId: string, token: string) => {
    if (!callClient) {
      console.error("StringeeClient instance is not initialized.");
      return;
    }

    try {
      const localTrack = await window.StringeeVideo.createLocalVideoTrack(
        callClient,
        {
          audio: true,
          video: true,
          videoDimensions: { width: 640, height: 360 },
        }
      );

      if (localVideoRef.current) {
        const videoElement = localTrack.attach();
        localVideoRef.current.srcObject = videoElement.srcObject;
        localVideoRef.current.play();
        console.log("Camera and microphone access granted.");
      } else {
        console.error("Local video ref is not set.");
      }

      const roomData = await window.StringeeVideo.joinRoom(callClient, token);
      const room = roomData.room;
      console.log("Room data:", roomData);

      if (!room) {
        console.error("Failed to join room.");
        return;
      }

      // Update viewer count on room events
      room.on("joinroom", (e: any) => {
        console.log("A user has joined the room:", e);
        setViewerCount((prevCount) => prevCount + 1);
      });

      room.on("leaveroom", (e: any) => {
        console.log("A user has left the room:", e);
        setViewerCount((prevCount) => Math.max(prevCount - 1, 0));
      });

      room.on("addtrack", (e: any) => {
        const track = e.info.track;
        if (track.serverId) {
          console.log("New track added:", track);
          subscribe(track);
        } else {
          console.error("Invalid track added:", track);
        }
      });

      room.on("removetrack", (e: any) => {
        const track = e.track;
        if (track) {
          const mediaElements = track.detach();
          mediaElements.forEach((element: HTMLVideoElement) =>
            element.remove()
          );
        }
      });

      await room.publish(localTrack);
      console.log("Local track published.");
      setRoom(room);
      console.log("Stream successfully published.");
    } catch (err) {
      console.error("Failed to access camera or microphone:", err);
    }
  };

  const subscribe = async (trackInfo: any) => {
    if (!room) return;
    console.log("Subscribing to track:", trackInfo);

    try {
      if (!trackInfo.serverId) {
        console.error("Invalid track serverId:", trackInfo.serverId);
        return;
      }

      const track = await room.subscribe(trackInfo.serverId);
      track.on("ready", () => {
        console.log("Track ready:", track);
        const videoElement = track.attach();
        videoElement.setAttribute("controls", "true");
        videoElement.setAttribute("playsinline", "true");
        document.querySelector("#videos")?.appendChild(videoElement);
      });
    } catch (err) {
      console.error("Failed to subscribe to track:", err);
    }
  };

  const handleStopLivestream = async () => {
    try {
      await api.deleteRoom(currentRoomId);
      console.log("Livestream stopped and room deleted.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
      } else {
        console.error("Unknown Error:", error);
      }
    } finally {
      setRoom(null);
      setCurrentRoomId(null);
      setRoomToken(null);
      setIsStopping(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Livestream Management</h1>
      <div className="mb-6">
        <button
          onClick={handleStartLivestream}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isStarting || isStopping}
        >
          Start Livestream
        </button>
        <button
          onClick={handleStopLivestream}
          className="px-4 py-2 bg-red-500 text-white rounded ml-4"
          disabled={isStopping || !currentRoomId}
        >
          Stop Livestream
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Broadcasting Video</h2>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          className="w-full max-w-md border"
        ></video>
      </div>
      <div>
        <p>Viewer Count: {viewerCount}</p>
      </div>
    </div>
  );
};

export default Livestreams;
