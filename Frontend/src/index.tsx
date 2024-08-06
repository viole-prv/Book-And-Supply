import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

root.render(
    <QueryClientProvider client={queryClient}>
        <App />
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>,
);
