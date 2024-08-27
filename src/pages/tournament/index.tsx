import { useState, useEffect } from "react";
import { api } from '@/lib/stringeeApi'; // Adjust the path if necessary
import { NextPage } from "next";

const ActiveLivestreams: NextPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveRooms = async () => {
      try {
        await api.setRestToken();
        const activeRooms = await api.listRoom();
        console.log("Active rooms:", activeRooms);
        setRooms(activeRooms);
      } catch (error) {
        console.error('Error fetching active rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRooms();
  }, []);

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await api.deleteRoom(roomId);
      // Update state to remove the deleted room from the list
      setRooms(rooms.filter(room => room.roomId !== roomId));
      console.log('Room deleted successfully:', roomId);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Livestreams</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map(room => (
            <li key={room.roomId} className="mb-2 flex items-center">
              <span className="font-semibold">Room ID:</span> {room.roomId}
              <span className="ml-4 font-semibold">Name:</span> {room.name}
              <button
                onClick={() => handleDeleteRoom(room.roomId)}
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No active livestreams at the moment.</div>
      )}
    </div>
  );
};

export default ActiveLivestreams;
