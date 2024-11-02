import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./context/authContex.tsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>,
);
