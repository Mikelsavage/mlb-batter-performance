import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import "../../components/App/App.css";
import "../../utils/i18next";
import { useGetPlayersWithToken } from "../../services/players";

export const PlayersPage = () => {
    const { players = [], isLoading, error } = useGetPlayersWithToken();

    const { t } = useTranslation();

    if (isLoading) return <div>{t("loading")}</div>;
    if (error) return <div>{t("errors.playersData")}</div>;

    return (
        <>
            <h1>{t("players")}</h1>

            {isEmpty(players) ? (
                <div>
                    <p>{t("players.empty")}</p>
                </div>
            ) : (
                <ul>
                    {players?.map((player) => (
                        <li key={player.playerId}>{player.playerFullName}</li>
                    ))}
                </ul>
            )}
        </>
    );
};
