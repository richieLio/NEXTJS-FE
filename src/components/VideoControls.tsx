import { FC } from 'react';

interface VideoControlsProps {
  createRoom: () => void;
  joinWithId: () => void;
  publish: (screenSharing: boolean) => void;
  roomId: string | undefined;
}

const VideoControls: FC<VideoControlsProps> = ({ createRoom, joinWithId, publish, roomId }) => (
  <div className="mt-4 flex space-x-2">
    <button className="btn btn-primary" onClick={createRoom}>
      Tạo Room
    </button>
    <button className="btn btn-info" onClick={joinWithId}>
      Tham Gia Room
    </button>
    {roomId && (
      <button className="btn btn-info" onClick={() => publish(true)}>
        Phát Video Màn Hình
      </button>
    )}
  </div>
);

export default VideoControls;
