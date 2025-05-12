import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Player } from "../types/players";

export const playersApi = createApi({
    reducerPath: "playersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://project.trumedianetworks.com/api/",
    }),
    endpoints: (build) => ({
        getToken: build.query<{ token: string; expires: string }, void>({
            query: () => ({
                url: "token",
                headers: {
                    "Content-Type": "application/json",
                    apiKey: import.meta.env.VITE_API_KEY,
                },
            }),
        }),
        getPlayers: build.query<Player[], string>({
            query: (token) => ({
                url: "mlb/players",
                headers: {
                    tempToken: token,
                },
            }),
        }),
    }),
});

export const { useGetTokenQuery } = playersApi;

// Custom hook that combines getToken and getPlayers
export const useGetPlayersWithToken = () => {
    const {
        data: tokenData,
        isLoading: isTokenLoading,
        error: tokenError,
    } = useGetTokenQuery();

    const token = tokenData?.token;

    const {
        data: players,
        isLoading: isPlayersLoading,
        error: playersError,
    } = playersApi.endpoints.getPlayers.useQuery(token ?? "", {
        skip: !token,
    });

    return {
        players,
        isLoading: isTokenLoading || isPlayersLoading,
        error: tokenError || playersError,
    };
};
