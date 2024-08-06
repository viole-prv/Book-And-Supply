import React, { createContext, FC, useState } from "react";

import useMediaQuery from "../../hooks/useMediaQuery";

type T = {
    isDesktop: boolean;
};

export const Context = createContext<T>({
    isDesktop: false,
});

type Props = {
    children: React.ReactNode;
};

export const DefaultProvider: FC<Props> = ({ children }) => {
    const isDesktop = useMediaQuery("(width > 1024px)");

    return (
        <Context.Provider value={{ isDesktop }}>{children}</Context.Provider>
    );
};
