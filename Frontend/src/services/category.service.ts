import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";
import { IPair } from "../utils/Helper";

export type TProperty = Omit<IProperty, "tag" | "array"> & {
    array: Array<string>;
};

export type TCategory = Omit<ICategory, "property"> & {
    property: TProperty[];
};

export interface IProperty {
    name: string;
    array: IPair[];
}

export interface ICategory {
    id: number;
    tag: string;
    name: string;
    property: IProperty[];
}

class CategoryService {
    Entry = (staleTime?: number) => {
        return useQuery({
            queryKey: ["category"],
            queryFn: async () => {
                try {
                    const response =
                        await API.get<ICategory[]>("/api/category");

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            staleTime: staleTime,
        });
    };

    ByTag = (tag: string, staleTime?: number) => {
        return useQuery({
            queryKey: ["category", { tag }],
            queryFn: async () => {
                try {
                    const response = await API.get<ICategory>(
                        `/api/category/${tag}`,
                    );

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            staleTime: staleTime,
        });
    };

    Create = () => {
        return useMutation({
            mutationFn: (data: Omit<TCategory, "id">) =>
                API.post("/api/category", {
                    tag: data.tag,
                    name: data.name,
                    property: data.property,
                }),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["category"] }),
        });
    };

    Update = () => {
        return useMutation({
            mutationFn: (data: TCategory) =>
                API.put(`/api/category/${data.id}`, {
                    tag: data.tag,
                    name: data.name,
                    property: data.property,
                }),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["category"] }),
        });
    };

    Property(tag: string, name: string, value: boolean, key?: string) {
        queryClient.setQueryData<ICategory | undefined>(
            ["category", { tag }],
            (category) => {
                if (category) {
                    const property = category.property.map((property) => {
                        if (property.name === name) {
                            const array = property.array.map((pair) => {
                                return {
                                    key: pair.key,
                                    value: key
                                        ? pair.key === key
                                            ? value
                                            : pair.value
                                        : value,
                                };
                            });

                            return { ...property, array };
                        }

                        return property;
                    });

                    return { ...category, property };
                }
            },
        );
    }
}

export default new CategoryService();
