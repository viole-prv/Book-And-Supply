import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
    const [match, setMatch] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        const T = () => setMatch(media.matches);

        T();

        media.addEventListener("change", T);

        return () => {
            media.removeEventListener("change", T);
        };
    }, [query]);

    return match;
};

export default useMediaQuery;
