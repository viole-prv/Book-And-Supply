import { useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";

interface IList {
    id: number;
    name: string;
}

interface ISort {
    value: number;
    list: IList[];
}

class SortService {
    Entry = () => {
        return useQuery({
            queryKey: ["sort"],
            queryFn: async () => {
                try {
                    const response = await API.get<ISort>("/api/filter/sort");

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

    Update = (value: number) => {
        queryClient.setQueryData<ISort | undefined>(["sort"], (sort) => {
            if (sort) {
                return { ...sort, value };
            }
        });
    };
}

export default new SortService();
