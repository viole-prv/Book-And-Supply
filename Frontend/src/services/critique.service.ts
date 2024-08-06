import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";

type TCritique = Omit<ICritique, "date" | "name" | "picture">;

export interface ICritique {
    id: number;
    star: number;
    message: string;
    date: string;
    name: string;
    picture: string;
}

class CritiqueService {
    Entry = (tag: string) => {
        return useQuery({
            queryKey: ["critique", { tag }],
            queryFn: async () => {
                try {
                    const response = await API.get<ICritique[]>(
                        `/api/critique/${tag}`,
                    );

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
        });
    };

    Create = () => {
        return useMutation({
            mutationFn: (data: TCritique) =>
                API.post(`/api/critique/${data.id}`, {
                    star: data.star,
                    message: data.message,
                }),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["critique"] }),
        });
    };
}

export default new CritiqueService();
