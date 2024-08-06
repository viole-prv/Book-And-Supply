import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";
import { getCookie } from "../utils/Helper";

import { IPiece } from "./piece.service";

class FavoriteService {
    Entry = (staleTime?: number) => {
        return useQuery({
            queryKey: ["favorite"],
            queryFn: async () => {
                try {
                    const response = await API.get<IPiece[]>("/api/favorite");

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
            mutationFn: (id: number) => API.post(`/api/favorite/${id}`),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["favorite"] }),
        });
    };
}

export default new FavoriteService();
