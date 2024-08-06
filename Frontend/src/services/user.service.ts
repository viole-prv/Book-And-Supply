import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";
import { getCookie, setCookie, toDate } from "../utils/Helper";

type TProfile = {
    firstName: string;
    lastName: string;
    picture: string;
    day: string;
    month: string;
    year: string;
    phoneNumber: string;
    eMail: string;
};

type TUser = {
    login: string;
    password: string;
};

export interface IUser {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    picture: string;
    day: string;
    month: string;
    year: string;
    phoneNumber: string;
    eMail: string;
    password: string;
    sessionToken: string;
}

class UserService {
    Entry = () => {
        return useQuery({
            queryKey: ["user"],
            queryFn: async () => {
                try {
                    const response = await API.get<IUser>("/api/user/profile");

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            enabled: !!getCookie("session-token"),
        });
    };

    Login = () => {
        return useMutation({
            mutationFn: async (data: TUser) => {
                try {
                    const response = await API.post<IUser>(
                        `/api/user/auth/login`,
                        { login: data.login, password: data.password },
                    );

                    if (response.status === 200) {
                        setCookie("session-token", response.data.sessionToken, {
                            expires: toDate(10080),
                            secure: true,
                            sameSite: "None",
                        });

                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            onSuccess: () => queryClient.fetchQuery({ queryKey: ["user"] }),
        });
    };

    Register = () => {
        return useMutation({
            mutationFn: async (
                data: TUser & TProfile & { reCaptcha: string },
            ) => {
                try {
                    const response = await API.post<IUser>(
                        `/api/user/auth/register?login=${data.login}&password=${data.password}`,
                        {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            picture: data.picture,
                            day: data.day,
                            month: data.month,
                            year: data.year,
                            phoneNumber: data.phoneNumber,
                            eMail: data.eMail,
                            reCaptcha: data.reCaptcha,
                        },
                    );

                    if (response.status === 200) {
                        setCookie("session-token", response.data.sessionToken, {
                            expires: toDate(10080),
                            secure: true,
                            sameSite: "None",
                        });

                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            onSuccess: () => queryClient.fetchQuery({ queryKey: ["user"] }),
        });
    };

    Update = () => {
        return useMutation({
            mutationFn: (data: TProfile) => API.put("/api/user/profile", data),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["user"] }),
        });
    };
}

export default new UserService();
