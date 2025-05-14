import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Player } from "../types/players";

type TokenResponse = {
    token: string;
    expires: string;
};

type PlayerByIdQuery = {
    id: number;
    token: string;
};

export const playersApi = createApi({
    reducerPath: "playersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://project.trumedianetworks.com/api/",
    }),
    keepUnusedDataFor: 3600,
    endpoints: (build) => ({
        getToken: build.query<TokenResponse, void>({
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
        getPlayerById: build.query<Player | undefined, PlayerByIdQuery>({
            query: ({ id, token }) => ({
                url: `mlb/player/${id}`,
                headers: {
                    tempToken: token,
                },
            }),
        }),
    }),
});

export const { useGetTokenQuery, useLazyGetPlayerByIdQuery } = playersApi;

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

export const useGetPlayerByIdWithToken = (playerId: number) => {
    const {
        data: tokenData,
        isLoading: isTokenLoading,
        error: tokenError,
    } = useGetTokenQuery();

    const token = tokenData?.token;

    const {
        data: player,
        isLoading: isPlayersLoading,
        error: playersError,
    } = playersApi.endpoints.getPlayerById.useQuery(
        { id: playerId, token: token ?? "" },
        {
            skip: !token,
        }
    );

    return {
        player,
        isLoading: isTokenLoading || isPlayersLoading,
        error: tokenError || playersError,
    };
};
