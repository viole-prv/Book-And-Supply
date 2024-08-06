import Axios from "axios";

import { getCookie, setCookie, toDate } from "./Helper";

export const URL = "https://localhost:7247";

const API = Axios.create({
    withCredentials: true,
    baseURL: URL,
});

API.interceptors.request.use((response) => {
    const cookie = getCookie("session-token");

    if (cookie) {
        response.headers.Authorization = `Bearer ${cookie}`;
    }

    return response;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (getCookie("session-token")) {
            const T = error.config;

            if (error.response?.status === 401 && !T._retry) {
                T._retry = true;

                try {
                    const response = await API.post("/api/user/auth/secure");

                    if (response.status === 200) {
                        setCookie("session-token", response.data.sessionToken, {
                            expires: toDate(10080),
                            secure: true,
                            sameSite: "None",
                        });
                    }
                } catch (e) {
                    console.log(e);
                }

                return API.request(T);
            }
        }

        return Promise.reject(error);
    },
);

export default API;
