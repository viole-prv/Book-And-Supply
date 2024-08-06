import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";

interface IPromotion {
    id: number;
    name: string;
    value: number;
}

type TPromotion = Omit<IPromotion, "id">;

class PromotionService {
    Entry = () => {
        return useQuery({
            queryKey: ["promotion"],
            queryFn: async () => {
                try {
                    const response =
                        await API.get<IPromotion[]>("/api/promotion");

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
            mutationFn: (data: TPromotion) => API.post("/api/promotion", data),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["promotion"] }),
        });
    };
}

export default new PromotionService();
