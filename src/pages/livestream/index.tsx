import { useState } from 'react';
import Livestream from '@/components/LiveStream';
import VideoView from '@/components/VideoView';
import VideoControls from '@/components/VideoControls';
import { useStringee } from '@/hooks/useStringee';

const Home = () => {
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [roomToken, setRoomToken] = useState<string>('');
  const { createRoom, joinRoom, publish, joinWithId } = useStringee(roomId, setRoomId, setRoomToken);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">
        Livestream và Xem Video với
        <span className="text-blue-600"> Stringee API</span>
      </h1>

      <div className="flex flex-col md:flex-row w-full">
        <div className="flex-1 p-4">
          <Livestream roomId={roomId} roomToken={roomToken} />
        </div>
        <div className="flex-1 p-4">
          <VideoView roomId={roomId} />
        </div>
      </div>

      <VideoControls
        createRoom={createRoom}
        joinWithId={joinWithId}
        publish={publish}
        roomId={roomId}
      />
    </div>
  );
};

export default Home;
