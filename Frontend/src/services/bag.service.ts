import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";
import { getCookie } from "../utils/Helper";

import { IPrice } from "./piece.service";

type TBag = {
    id: number;
    quantity: number;
};

export interface IPiece {
    id: number;
    tag: string;
    name: string;
    picture: string;
    price: IPrice;
    count: number;
    category: string;
}

export interface IBag {
    id: number;
    quantity: number;
    piece: IPiece;
}

class BagService {
    Entry = (staleTime?: number) => {
        return useQuery({
            queryKey: ["bag"],
            queryFn: async () => {
                try {
                    const response = await API.get<IBag[]>("/api/bag");

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

    Update = () => {
        return useMutation({
            mutationFn: (data: TBag) =>
                API.post(`/api/bag/${data.id}`, {
                    quantity: data.quantity,
                }),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["bag"] }),
        });
    };
}

export default new BagService();
