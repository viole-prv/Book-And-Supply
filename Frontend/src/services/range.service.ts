import { useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";

interface IRange {
    min: number;
    max: number;
    value: number[];
}

class RangeService {
    Entry = () => {
        return useQuery({
            queryKey: ["range"],
            queryFn: async (): Promise<IRange | undefined> => {
                try {
                    const response = await API.get<IRange>("/api/filter/range");

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            staleTime: 5 * 60 * 1000,
        });
    };

    Update = (min: number, max: number) => {
        queryClient.setQueryData<IRange | undefined>(["range"], (range) => {
            if (range) {
                return {
                    min: range.min,
                    max: range.max,
                    value: [min, max],
                };
            }
        });
    };
}

export default new RangeService();
