import * as dotenv from "dotenv";
import { Cookie, CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import queryString from "querystring";
import CryptoJS from "crypto-js";

dotenv.config();

export const megeyeConfig = {
  apiBaseUrl: process.env.MEGEYE_API_BASE_URL || "",
  cookieDomain: process.env.MEGEYE_COOKIE_DOMAIN || "",
  megeyeUsername: process.env.MEGEYE_USERNAME || "",
  megeyePassword: process.env.MEGEYE_PASSWORD || "",
};

export class MegeyeManager {
  private cookieJar: CookieJar;
  public client: AxiosInstance;

  constructor() {
    this.cookieJar = new CookieJar();
    this.client = wrapper(
      axios.create({
        jar: this.cookieJar,
        withCredentials: true,
      })
    );
  }

  public setCookie(sessionID: string): void {
    const cookie = new Cookie({
      key: "sessionID",
      value: sessionID,
      domain: megeyeConfig.cookieDomain,
      path: "/",
      httpOnly: true,
      maxAge: 3600,
    });

    try {
      this.cookieJar.setCookie(cookie, megeyeConfig.apiBaseUrl, (err) => {
        if (err) {
          console.warn("Failed to set cookie:", err);
        }
      });
    } catch (error) {
      console.warn("Failed to set cookie:", error);
    }
  }

  public async getCookie(): Promise<string | null> {
    try {
      const cookieString = await this.cookieJar.getCookieString(
        megeyeConfig.apiBaseUrl
      );
      // Parse the cookie string to find the desired cookie
      const cookies = cookieString.split(";").map((cookie) => cookie.trim());
      const targetCookie = cookies.find((cookie) =>
        cookie.startsWith("sessionID=")
      );
      return targetCookie || null;
    } catch (error) {
      console.warn("Failed to retrieve cookie:", error);
    }
    return null;
  }

  public async requestNewCookie(): Promise<void> {
    try {
      const challengeResponse = await this.client.get(
        `${megeyeConfig.apiBaseUrl}/api/auth/login/challenge`,
        {
          params: {
            username: megeyeConfig.megeyeUsername,
          },
        }
      );
      if (challengeResponse.status !== 200) {
        throw new Error("Failed to obtain challenge");
      }
      const { session_id, salt, challenge } = challengeResponse.data;
      const combination = megeyeConfig.megeyePassword + salt + challenge;
      const encryptedPassword = CryptoJS.SHA256(combination).toString();
      const response = await this.client.post(
        `${megeyeConfig.apiBaseUrl}/api/auth/login`,
        {
          session_id: session_id,
          username: megeyeConfig.megeyeUsername,
          password: encryptedPassword,
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to obtain new cookie");
      }
      this.setCookie(response.data.session_id);
    } catch (error) {
      console.error("Failed to obtain new cookie:", error);
      throw error;
    }
  }

  // Handler function to perform requests
  public async MegeyeGlobalHandler(
    payload: IHandler,
  ): Promise<[boolean, any]> {
    const client = this.client;
    const _handler = async (payload: IHandler): Promise<[boolean, any]> => {
      try {
        const { path, type, data, isBloob } = payload;
        const token = payload._token;
        const baseURL = `${megeyeConfig.apiBaseUrl}${path}`;
        let success = false;
        const maxAttempt = 2;
        let attempt = 0;

        const performRequest = async (): Promise<AxiosInstance> => {
          let response: AxiosResponse = {} as AxiosResponse;
          while (!success && attempt < maxAttempt) {
            attempt++;
            try {
              // Perform the API request
              if (type === "get") {
                response = await client.get(baseURL, {
                  params: data,
                  responseType: isBloob ? "blob" : "json",
                  paramsSerializer: (params) => this.parseParams(params),
                  headers: {
                    "Content-Type": "application/json",
                    ...(token != null
                      ? {
                          Authorization: `${token}`,
                        }
                      : {}),
                  },
                });
              } else if (type === "put") {
                response = await client.put(
                  baseURL,
                  payload.isUrlencoded ? queryString.stringify(data) : data,
                  {
                    headers: {
                      "Content-Type": payload.isFormData
                        ? "multipart/form-data"
                        : payload.isUrlencoded
                        ? "application/x-www-form-urlencoded"
                        : "application/json",
                      ...(token != null
                        ? {
                            Authorization: `${token}`,
                          }
                        : {}),
                    },
                    params: payload.params,
                    paramsSerializer: (params) => this.parseParams(params),
                  }
                );
              } else if (type === "patch") {
                response = await client.patch(
                  baseURL,
                  payload.isUrlencoded ? queryString.stringify(data) : data,
                  {
                    headers: {
                      "Content-Type": payload.isFormData
                        ? "multipart/form-data"
                        : payload.isUrlencoded
                        ? "application/x-www-form-urlencoded"
                        : "application/json",
                      ...(token != null
                        ? {
                            Authorization: `${token}`,
                          }
                        : {}),
                    },
                  }
                );
              } else if (type === "delete") {
                response = await client.delete(baseURL, {
                  headers: {
                    "Content-Type": payload.isFormData
                      ? "multipart/form-data"
                      : payload.isUrlencoded
                      ? "application/x-www-form-urlencoded"
                      : "application/json",
                    ...(token != null
                      ? {
                          Authorization: `${token}`,
                        }
                      : {}),
                  },
                  data: data,
                });
              } else {
                response = await client.post(baseURL, data, {
                  headers: {
                    "Content-Type": payload.isFormData
                      ? "multipart/form-data"
                      : payload.isUrlencoded
                      ? "application/x-www-form-urlencoded"
                      : "application/json",
                    ...(token != null
                      ? {
                          Authorization: `${token}`,
                        }
                      : {}),
                  },
                  params: payload.params,
                  paramsSerializer: (params) => this.parseParams(params),
                });
              }
              success = true;
            } catch (error: any) {
              response = error.response;
              console.log(error);
            }
          }
          if (!success) {
            console.log("All attempts to perform request failed");
          }
          return response.data;
        };

        const response = await performRequest();
        return [success, response];
      } catch (error: any) {
        return [false, error];
      }
    };

    return _handler(payload);
  }

  // Helper function to serialize parameters for URL
  public parseParams(params: any): string {
    let options = "";

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((element) => {
          if (Array.isArray(element)) {
            element.forEach((subElement) => {
              options += `${key}=${subElement}&`;
            });
          } else {
            options += `${key}=${element}&`;
          }
        });
      } else {
        options += `${key}=${value}&`;
      }
    });
    return options ? options.slice(0, -1) : options;
  }
}

// Define the interface for the request handler
interface IHandler {
  path: string;
  type: string;
  data?: any;
  params?: any;
  _token?: string;
  isFormData?: boolean;
  isUrlencoded?: boolean;
  isBloob?: boolean;
}

// Define the interface for the response
export interface IResponse<T> {
  success: boolean;
  msg: string;
  data: T;
}

interface map {
  [key: string]: string;
}
export const IType: map = {
  get: "get",
  post: "post",
  put: "put",
  delete: "delete",
  patch: "patch",
};

export const listUrl = {
  personnelManagement: {
    query: {
      path: "/api/persons/query",
      type: IType.post,
    },
  },
};
