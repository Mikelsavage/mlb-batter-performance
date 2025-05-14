import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Layout } from "../../components/Layout/Layout";
import {
    useGetPlayerStatsByIdWithToken,
    useGetPlayersWithToken,
} from "../../services/players";
import map from "lodash/map";
import reduce from "lodash/reduce";

type CalculatedStatsOverTimeReduceResult = {
    totalH: number;
    totalAB: number;
    totalBB: number;
    totalHBP: number;
    totalSF: number;
    totalTB: number;
    avgOverTime: {
        date: string;
        avg: number;
        totalH: number;
        totalAB: number;
        slg: number;
        obp: number;
        ops: number;
    }[];
};

export const SinglePlayerPage = () => {
    const params = useParams();
    const { playerId } = params;
    const { t } = useTranslation();

    const {
        players = [],
        isLoading: isGetPlayersLoading,
        error: getPlayersError,
    } = useGetPlayersWithToken();
    const player = players.find(
        (player) => player.playerId === Number(playerId)
    );

    const {
        playerStats,
        isLoading: isGetPlayerStatsByIdLoading,
        error: getPlayerStatsByIdError,
    } = useGetPlayerStatsByIdWithToken(Number(playerId));

    const isLoading = isGetPlayersLoading || isGetPlayerStatsByIdLoading;
    const error = getPlayersError || getPlayerStatsByIdError;

    if (isLoading) return <div>{t("player.loading")}</div>;

    if (error) return <div>{t("errors.player")}</div>;

    const calculatedStatsOverTime = reduce(
        playerStats,
        (
            result: CalculatedStatsOverTimeReduceResult,
            { BB, H, AB, HBP, SF, TB, date }
        ) => {
            // Track the total accumulated stats over time
            result.totalH += H;
            result.totalAB += AB;
            result.totalBB += BB;
            result.totalHBP += HBP;
            result.totalSF += SF;
            result.totalTB += TB;

            // Calculate the slg, obp, and ops from the accumulated stats
            const slg = result.totalTB / result.totalAB;
            const obp =
                (result.totalH + result.totalBB + result.totalHBP) /
                (result.totalAB +
                    result.totalBB +
                    result.totalHBP +
                    result.totalSF);
            const ops = slg + obp;

            result.avgOverTime.push({
                date,
                avg: result.totalH / result.totalAB,
                totalH: result.totalH,
                totalAB: result.totalAB,
                slg,
                obp,
                ops,
            });
            return result;
        },
        {
            totalH: 0,
            totalAB: 0,
            totalBB: 0,
            totalHBP: 0,
            totalSF: 0,
            totalTB: 0,
            avgOverTime: [],
        } as CalculatedStatsOverTimeReduceResult
    );

    console.log("calculatedStatsOverTime", calculatedStatsOverTime);

    return (
        <Layout>
            <h2>{player?.playerFullName}</h2>

            <p>{playerId}</p>

            <ul>
                {map(playerStats, ({ date, gameId, playerId }) => {
                    const uniqueKey = `${String(gameId)}-${String(playerId)}`;

                    return <li key={uniqueKey}>{date}</li>;
                })}
            </ul>
        </Layout>
    );
};
