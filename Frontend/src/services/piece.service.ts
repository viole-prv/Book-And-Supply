import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../index";
import API from "../utils/API";
import { IPair } from "../utils/Helper";

interface IBanner {
    tag: string;
    list: IPiece[];
}

export type TProperty = Omit<IProperty, "array"> & {
    array: IPair[];
};

export type TPiece = Omit<
    IPiece,
    | "price"
    | "property"
    | "category"
    | "order"
    | "promotion"
    | "favorite"
    | "critique"
> & {
    price: number;
    property: TProperty[];
    category: number | null;
    promotion: number | null;
};

export interface IPrice {
    current: number;
    primary: number;
    rate: number;
}

interface IProperty {
    name: string;
    array: Array<string>;
}

interface ICategory {
    id: number;
    tag: string;
}

interface IPromotion {
    id: number;
    name: string;
}

export interface ICritique {
    star: number;
    count: number;
    score: Record<number, number>;
}

export interface IPiece {
    id: number;
    tag: string;
    name: string;
    picture: string[];
    price: IPrice;
    count: number;
    property: IProperty[];
    description: string;
    category: ICategory | null;
    promotion: IPromotion | null;
    favorite: number;
    critique: ICritique;
}

interface IEntry {
    count: number;
    list: IPiece[];
}

type TEntry = {
    tag: string;
    currentPage: number;
    pageSize: number;
    fromPrice?: number;
    toPrice?: number;
    sort?: number;
    property?: Record<string, Array<string>>;
};

class PieceService {
    Entry = (entry: TEntry) => {
        const {
            tag,
            currentPage,
            pageSize,
            fromPrice,
            toPrice,
            sort,
            property,
        } = entry;

        return useQuery({
            queryKey: ["piece", entry],
            queryFn: async () => {
                try {
                    const data = {
                        currentPage,
                        pageSize,
                        ...(fromPrice !== undefined && { fromPrice }),
                        ...(toPrice !== undefined && { toPrice }),
                        ...(sort !== undefined && { sort }),
                        ...(property !== undefined && { property }),
                    };

                    const response = await API.post<IEntry>(
                        `/api/piece/${tag}`,
                        data,
                    );

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            enabled:
                entry.fromPrice !== undefined &&
                entry.toPrice !== undefined &&
                entry.sort !== undefined &&
                entry.property !== undefined,
            placeholderData: keepPreviousData,
        });
    };

    ByTag = (tag: string) => {
        return useQuery({
            queryKey: ["piece", { tag }],
            queryFn: async () => {
                try {
                    const response = await API.get<IPiece>(`/api/piece/${tag}`);

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
            mutationFn: (data: Omit<TPiece, "id">) =>
                API.post("/api/piece", {
                    tag: data.tag,
                    name: data.name,
                    picture: data.picture,
                    price: data.price,
                    property: data.property.map((property) => ({
                        name: property.name,
                        array: property.array
                            .filter((pair) => pair.value)
                            .map((pair) => pair.key),
                    })),
                    description: data.description,
                    count: data.count,
                    category: data.category,
                    promotion: data.promotion,
                }),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["piece"] }),
        });
    };

    Update = () => {
        return useMutation({
            mutationFn: (data: TPiece) =>
                API.put(`/api/piece/${data.id}`, {
                    tag: data.tag,
                    name: data.name,
                    picture: data.picture,
                    price: data.price,
                    property: data.property.map((property) => ({
                        name: property.name,
                        array: property.array
                            .filter((pair) => pair.value)
                            .map((pair) => pair.key),
                    })),
                    description: data.description,
                    count: data.count,
                    category: data.category,
                    promotion: data.promotion,
                }),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["piece"] }),
        });
    };

    Similar = (tag: string) => {
        return useQuery({
            queryKey: ["similar", { tag }],
            queryFn: async () => {
                try {
                    const response = await API.get<IPiece[]>(
                        `/api/piece/similar/${tag}`,
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

    Banner = () => {
        return useQuery({
            queryKey: ["banner"],
            queryFn: async () => {
                try {
                    const response =
                        await API.get<IBanner[]>("/api/piece/banner");

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
        });
    };

    Look = (query: string) => {
        return useQuery({
            queryKey: ["look", { query }],
            queryFn: async () => {
                try {
                    const response = await API.get<IPiece[]>(
                        `/api/piece/look?query=${query}`,
                    );

                    if (response.status === 200) {
                        return response.data;
                    }
                } catch (error) {
                    throw error;
                }
            },
            enabled: !!query,
        });
    };
}

export default new PieceService();
