import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";
import { getCookie } from "../utils/Helper";

export interface IPiece {
    id: number;
    tag: string;
    name: string;
    picture: string;
    price: number;
    quantity: number;
    category: string;
}

export interface IOrder {
    id: number;
    tag: string;
    condition: string;
    price: number;
    quantity: number;
    date: string;
    piece: IPiece[];
}

class OrderService {
    Entry = (staleTime?: number) => {
        return useQuery({
            queryKey: ["order"],
            queryFn: async () => {
                try {
                    const response = await API.get<IOrder[]>("/api/order");

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            enabled: !!getCookie("session-token"),
            staleTime: staleTime,
        });
    };

    ByTag = (tag: string) => {
        return useQuery({
            queryKey: ["order", { tag }],
            queryFn: async () => {
                try {
                    const response = await API.get<IOrder>(`/api/order/${tag}`);

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

    Create = () => {
        return useMutation({
            mutationFn: () => API.post("/api/order/"),
            onSuccess: () => {
                void queryClient.invalidateQueries({ queryKey: ["bag"] });
                void queryClient.invalidateQueries({ queryKey: ["order"] });
            },
        });
    };

    Update = () => {
        return useMutation({
            mutationFn: (tag: string) => API.put(`/api/order/${tag}`),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["order"] }),
        });
    };
}

export default new OrderService();
