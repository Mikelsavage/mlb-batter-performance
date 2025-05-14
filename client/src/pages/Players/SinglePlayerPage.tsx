import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { LineChart } from "@mui/x-charts/LineChart";
import { Layout } from "../../components/Layout/Layout";
import {
    useGetPlayerStatsByIdWithToken,
    useGetPlayersWithToken,
} from "../../services/players";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import reduce from "lodash/reduce";
import sortBy from "lodash/sortBy";
import take from "lodash/take";
import takeRight from "lodash/takeRight";
import {
    calculateAVG,
    calculateOBP,
    calculateOPS,
    calculateSLG,
    gradeAVG,
    gradeOBP,
    gradeOPS,
    gradeSLG,
} from "../../utils/statCalculations";
import { Stats } from "../../components/Stats/Stats";
import styles from "./SinglePlayerPage.module.scss";

type CalculatedStatsOverTimeReduceResult = {
    totalH: number;
    totalAB: number;
    totalBB: number;
    totalHBP: number;
    totalSF: number;
    totalTB: number;
    accumulatedStatsByDate: {
        date: Date;
        AVG: number;
        SLG: number;
        OBP: number;
        OPS: number;
    }[];
    statsByTeamFaced: {
        [team: string]: {
            GP: number;
            totalH: number;
            totalAB: number;
            totalBB: number;
            totalHBP: number;
            totalSF: number;
            totalTB: number;
            teamImage: string;
            teamName: string;
        };
    };
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
            { BB, H, AB, HBP, SF, TB, date, opponent, oppImage, opponentId }
        ) => {
            // Track the total accumulated stats over time
            result.totalH += H;
            result.totalAB += AB;
            result.totalBB += BB;
            result.totalHBP += HBP;
            result.totalSF += SF;
            result.totalTB += TB;

            result.accumulatedStatsByDate.push({
                date: new Date(date),
                AVG: parseFloat(
                    calculateAVG({
                        AB: result.totalAB,
                        H: result.totalH,
                    }).toFixed(3)
                ),
                SLG: parseFloat(
                    calculateSLG({
                        AB: result.totalAB,
                        TB: result.totalTB,
                    }).toFixed(3)
                ),
                OBP: parseFloat(
                    calculateOBP({
                        AB: result.totalAB,
                        BB: result.totalBB,
                        H: result.totalH,
                        HBP: result.totalHBP,
                        SF: result.totalSF,
                    }).toFixed(3)
                ),
                OPS: parseFloat(
                    calculateOPS({
                        AB: result.totalAB,
                        BB: result.totalBB,
                        H: result.totalH,
                        HBP: result.totalHBP,
                        SF: result.totalSF,
                        TB: result.totalTB,
                    }).toFixed(3)
                ),
            });

            // Initialize opponent stats if not already set
            if (!result.statsByTeamFaced[opponentId]) {
                result.statsByTeamFaced[opponentId] = {
                    teamImage: oppImage,
                    teamName: opponent,
                    totalH: 0,
                    totalAB: 0,
                    totalBB: 0,
                    totalHBP: 0,
                    totalSF: 0,
                    totalTB: 0,
                    GP: 0,
                };
            }

            // Add total stats by team faced
            result.statsByTeamFaced[opponentId] = {
                ...result.statsByTeamFaced[opponentId],
                GP: result.statsByTeamFaced[opponentId].GP + 1,
                totalH: result.statsByTeamFaced[opponentId].totalH + H,
                totalAB: result.statsByTeamFaced[opponentId].totalAB + AB,
                totalBB: result.statsByTeamFaced[opponentId].totalBB + BB,
                totalHBP: result.statsByTeamFaced[opponentId].totalHBP + HBP,
                totalSF: result.statsByTeamFaced[opponentId].totalSF + SF,
                totalTB: result.statsByTeamFaced[opponentId].totalTB + TB,
            };

            return result;
        },
        {
            totalH: 0,
            totalAB: 0,
            totalBB: 0,
            totalHBP: 0,
            totalSF: 0,
            totalTB: 0,
            accumulatedStatsByDate: [],
            statsByTeamFaced: {},
        } as CalculatedStatsOverTimeReduceResult
    );

    const accumulatedStatsByDate = defaultTo(
        get(calculatedStatsOverTime, "accumulatedStatsByDate"),
        []
    );
    const endOfSeasonAccumulatedStats =
        accumulatedStatsByDate.length > 0
            ? accumulatedStatsByDate[accumulatedStatsByDate.length - 1]
            : { AVG: 0, SLG: 0, OBP: 0, OPS: 0 };

    const calculatedStateByTeamFaced = map(
        calculatedStatsOverTime.statsByTeamFaced,
        (statsAgainstTeam) => {
            return {
                ...statsAgainstTeam,
                AVG: parseFloat(
                    calculateAVG({
                        AB: statsAgainstTeam.totalAB,
                        H: statsAgainstTeam.totalH,
                    }).toFixed(3)
                ),
                SLG: parseFloat(
                    calculateSLG({
                        AB: statsAgainstTeam.totalAB,
                        TB: statsAgainstTeam.totalTB,
                    }).toFixed(3)
                ),
                OBP: parseFloat(
                    calculateOBP({
                        AB: statsAgainstTeam.totalAB,
                        BB: statsAgainstTeam.totalBB,
                        H: statsAgainstTeam.totalH,
                        HBP: statsAgainstTeam.totalHBP,
                        SF: statsAgainstTeam.totalSF,
                    }).toFixed(3)
                ),
                OPS: parseFloat(
                    calculateOPS({
                        AB: statsAgainstTeam.totalAB,
                        BB: statsAgainstTeam.totalBB,
                        H: statsAgainstTeam.totalH,
                        HBP: statsAgainstTeam.totalHBP,
                        SF: statsAgainstTeam.totalSF,
                        TB: statsAgainstTeam.totalTB,
                    }).toFixed(3)
                ),
            };
        }
    );

    // Sorts in ascending order
    const sortedAvgByTeamFaced = sortBy(calculatedStateByTeamFaced, "AVG");
    const sortedOpsByTeamFaced = sortBy(calculatedStateByTeamFaced, "OPS");

    return (
        <Layout>
            <div className={styles.pageContent}>
                <div>
                    <img
                        src={player?.playerImage}
                        alt={player?.playerFullName}
                    />

                    <h2>{player?.playerFullName}</h2>
                </div>

                {!isEmpty(accumulatedStatsByDate) && (
                    <>
                        <div className={styles.statsContainer}>
                            <div className={styles.statsContainer}>
                                <h2>{t("player.stats.heading")}</h2>

                                <h3>{t("player.stats.derived.heading")}</h3>

                                <Stats
                                    stats={[
                                        {
                                            grade: gradeAVG(
                                                endOfSeasonAccumulatedStats.AVG
                                            ),
                                            label: t("stats.avg"),
                                            value: endOfSeasonAccumulatedStats.AVG,
                                        },
                                        {
                                            grade: gradeOBP(
                                                endOfSeasonAccumulatedStats.OBP
                                            ),
                                            label: t("stats.obp"),
                                            value: endOfSeasonAccumulatedStats.OBP,
                                        },
                                        {
                                            grade: gradeSLG(
                                                endOfSeasonAccumulatedStats.SLG
                                            ),
                                            label: t("stats.slg"),
                                            value: endOfSeasonAccumulatedStats.SLG,
                                        },
                                        {
                                            grade: gradeOPS(
                                                endOfSeasonAccumulatedStats.OPS
                                            ),
                                            label: t("stats.ops"),
                                            value: endOfSeasonAccumulatedStats.OPS,
                                        },
                                    ]}
                                />
                            </div>

                            <div className={styles.statsContainer}>
                                <h3>{t("player.stats.counting.heading")}</h3>

                                <Stats
                                    stats={[
                                        {
                                            label: t("stats.ab"),
                                            value: calculatedStatsOverTime.totalAB,
                                        },
                                        {
                                            label: t("stats.h"),
                                            value: calculatedStatsOverTime.totalH,
                                        },

                                        {
                                            label: t("stats.bb"),
                                            value: calculatedStatsOverTime.totalBB,
                                        },
                                        {
                                            label: t("stats.hbp"),
                                            value: calculatedStatsOverTime.totalHBP,
                                        },
                                        {
                                            label: t("stats.sf"),
                                            value: calculatedStatsOverTime.totalSF,
                                        },
                                        {
                                            label: t("stats.tb"),
                                            value: calculatedStatsOverTime.totalTB,
                                        },
                                    ]}
                                />
                            </div>

                            <div className={styles.statsContainer}>
                                <h2>{t("player.avgStats.heading")}</h2>

                                <h3>
                                    {t("player.bestAvgAgainstTeams.heading")}
                                </h3>

                                <Stats
                                    stats={map(
                                        takeRight(sortedAvgByTeamFaced, 5),
                                        (stats) => ({
                                            grade: gradeAVG(stats.AVG),
                                            imageSrc: stats.teamImage,
                                            label: stats.teamName,
                                            value: stats.AVG,
                                        })
                                    )}
                                />
                            </div>

                            <div className={styles.statsContainer}>
                                <h3>
                                    {t("player.worstAvgAgainstTeams.heading")}
                                </h3>

                                <Stats
                                    stats={map(
                                        take(sortedAvgByTeamFaced, 5),
                                        (stats) => ({
                                            grade: gradeAVG(stats.AVG),
                                            imageSrc: stats.teamImage,
                                            label: stats.teamName,
                                            value: stats.AVG,
                                        })
                                    )}
                                />
                            </div>

                            <div className={styles.statsContainer}>
                                <h2>{t("player.opsStats.heading")}</h2>

                                <h3>
                                    {t("player.bestOpsAgainstTeams.heading")}
                                </h3>

                                <Stats
                                    stats={map(
                                        takeRight(sortedOpsByTeamFaced, 5),
                                        (stats) => ({
                                            grade: gradeOPS(stats.OPS),
                                            imageSrc: stats.teamImage,
                                            label: stats.teamName,
                                            value: stats.OPS,
                                        })
                                    )}
                                />
                            </div>

                            <div className={styles.statsContainer}>
                                <h3>
                                    {t("player.worstOpsAgainstTeams.heading")}
                                </h3>

                                <Stats
                                    stats={map(
                                        take(sortedOpsByTeamFaced, 5),
                                        (stats) => ({
                                            grade: gradeOPS(stats.OPS),
                                            imageSrc: stats.teamImage,
                                            label: stats.teamName,
                                            value: stats.OPS,
                                        })
                                    )}
                                />
                            </div>
                        </div>

                        <div className={styles.chartContainer}>
                            <LineChart
                                dataset={
                                    calculatedStatsOverTime.accumulatedStatsByDate
                                }
                                xAxis={[
                                    {
                                        dataKey: "date",
                                        label: "Game Date",
                                        scaleType: "utc",
                                    },
                                ]}
                                yAxis={[
                                    {
                                        colorMap: {
                                            type: "piecewise",
                                            thresholds: [0.2, 0.26, 0.275, 0.3],
                                            colors: [
                                                "red",
                                                "orange",
                                                "yellow",
                                                "lightgreen",
                                                "green",
                                            ],
                                        },
                                        label: "AVG",
                                    },
                                ]}
                                series={[{ dataKey: "AVG" }]}
                                height={500}
                            />
                        </div>

                        <div className={styles.chartContainer}>
                            <LineChart
                                dataset={
                                    calculatedStatsOverTime.accumulatedStatsByDate
                                }
                                xAxis={[
                                    {
                                        dataKey: "date",
                                        label: "Game Date",
                                        scaleType: "utc",
                                    },
                                ]}
                                series={[
                                    { dataKey: "SLG", label: "SLG" },
                                    { dataKey: "OBP", label: "OBP" },
                                    { dataKey: "OPS", label: "OPS" },
                                ]}
                                height={500}
                            />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};
