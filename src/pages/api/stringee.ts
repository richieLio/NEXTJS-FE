import axios from 'axios';

const PROJECT_ID = "SKIuNgIgQclWM0GFSPCJO7eervWS7hKkQg";
const PROJECT_SECRET = "Tk1NaUZGVElWZ3VpNFZVQlZVVTZseWFsWTlHTndyMw==";
const BASE_URL = "https://api.stringee.com/v1/room2";

export const api = {
  createRoom: async () => {
    const roomName = Math.random().toFixed(4);
    const response = await axios.post(
      `${BASE_URL}/create`,
      {
        name: roomName,
        uniqueName: roomName
      },
      {
        headers: { "X-STRINGEE-AUTH": await getRestToken() }
      }
    );
    return response.data;
  },
  getRoomToken: async (roomId: string) => {
    const response = await axios.get(`${BASE_URL}/token`, {
      params: {
        roomId,
        keySid: PROJECT_ID,
        keySecret: PROJECT_SECRET
      }
    });
    return response.data.room_token;
  },
  publish: async (roomId: string, screenSharing: boolean) => {
    // Implement the publish logic
  },
  // Other API methods...
};

const getRestToken = async () => {
  const response = await axios.get("https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php", {
    params: {
      keySid: PROJECT_ID,
      keySecret: PROJECT_SECRET,
      rest: true
    }
  });
  return response.data.rest_access_token;
};
