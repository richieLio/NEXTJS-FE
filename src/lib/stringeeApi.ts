// lib/api.ts

import axios, { AxiosRequestConfig } from "axios";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || "";
const PROJECT_SECRET = process.env.NEXT_PUBLIC_PROJECT_SECRET || "";
const BASE_URL = "https://api.stringee.com/v1/room2";
class API {
  private projectId: string;
  private projectSecret: string;
  private restToken: string;

  constructor(projectId: string, projectSecret: string) {
    this.projectId = projectId;
    this.projectSecret = projectSecret;
    this.restToken = "";
  }

  private async _getToken(params: {
    userId?: string;
    roomId?: string;
    rest?: boolean;
  }) {
    const response = await axios.get(
      "https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php",
      {
        params: {
          keySid: this.projectId,
          keySecret: this.projectSecret,
          ...params,
        },
      }
    );

    const tokens = response.data;
    console.log({ tokens });
    return tokens;
  }

  private _authHeader(): AxiosRequestConfig["headers"] {
    return {
      "X-STRINGEE-AUTH": this.restToken,
    };
  }

  async createRoom() {
    const roomName = Math.random().toFixed(4);
    const response = await axios.post(
      `${BASE_URL}/create`,
      {
        name: roomName,
        uniqueName: roomName,
      },
      {
        headers: this._authHeader(),
      }
    );

    const room = response.data;
    console.log({ room });
    return room;
  }

  public async listRoom() {
    const response = await axios.get(`${BASE_URL}/list`, {
      headers: this._authHeader(),
    });

    const rooms = response.data.list;
    console.log({ rooms });
    return rooms;
  }

  public async deleteRoom(roomId: string) {
    const response = await axios.put(
      `${BASE_URL}/delete`,
      {
        roomId,
      },
      {
        headers: this._authHeader(),
      }
    );

    console.log({ response });

    return response.data;
  }

  public async clearAllRooms() {
    const rooms = await this.listRoom();
    const response = await Promise.all(
      rooms.map((room: { roomId: string }) => this.deleteRoom(room.roomId))
    );

    return response;
  }

  public async setRestToken() {
    const tokens = await this._getToken({ rest: true });
    const restToken = tokens.rest_access_token;
    this.restToken = restToken;

    return restToken;
  }

  public async getUserToken(userId: string) {
    const tokens = await this._getToken({ userId });
    return tokens.access_token;
  }

  public async getRoomToken(roomId: string) {
    const tokens = await this._getToken({ roomId });
    return tokens.room_token;
  }

  public isSafari(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return !ua.includes("chrome") && ua.includes("safari");
  }
}

export const api = new API(PROJECT_ID, PROJECT_SECRET);
