import { SERVER } from "../constants";
import type { TokenResponse, UserResponse } from "../interfaces/responses";
import { Http } from "./http.class";
import { MyGeolocation } from "./my-geolocation";

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  lat: number;
  lng: number;
  photo: string;
}
export class AuthService {
  #http = new Http();

  async login(email: string, password: string): Promise<void> {
    let lat = 0;
    let lng = 0;

    try {
      const coords = await MyGeolocation.getLocation();
      lat = coords.latitude;
      lng = coords.longitude;
    } catch {
      lat = 0;
      lng = 0;
    }
    const resp = await this.#http.post<
      TokenResponse,
      { email: string; password: string; lat: number; lng: number }
    >(`${SERVER}/auth/login`, { email, password, lat, lng });
    localStorage.setItem("token", resp.accessToken);
  }
  async register(userData: UserRegister): Promise<void> {
    await this.#http.post<UserResponse, UserRegister>(
      `${SERVER}/auth/register`,
      userData
    );
  }
  async checkToken(): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token");
    }
    await this.#http.get<void>(`${SERVER}/auth/validate`);
  }
  
  logout(): void {
    localStorage.removeItem("token");
    location.assign("login.html");
  }
}
