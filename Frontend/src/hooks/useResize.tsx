import { DependencyList, useEffect } from "react";

const useResize = (T: any, deps: DependencyList) => {
    useEffect(() => {
        T();

        window.addEventListener("resize", T);

        return () => {
            window.removeEventListener("resize", T);
        };
    }, deps);
};

export default useResize;
