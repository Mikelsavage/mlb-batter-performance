import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import "../../components/App/App.css";
import "../../utils/i18next";
import { useGetPlayersWithToken } from "../../services/players";
import { PlayersList } from "../../components/PlayersList/PlayersList";
import { Layout } from "../../components/Layout/Layout";

export const PlayersPage = () => {
    const { players = [], isLoading, error } = useGetPlayersWithToken();

    const { t } = useTranslation();

    if (isLoading) return <div>{t("loading")}</div>;
    if (error) return <div>{t("errors.playersData")}</div>;

    return (
        <Layout>
            <h1>{t("players")}</h1>

            {isEmpty(players) ? (
                <div>
                    <p>{t("players.empty")}</p>
                </div>
            ) : (
                <PlayersList players={players} />
            )}
        </Layout>
    );
};
