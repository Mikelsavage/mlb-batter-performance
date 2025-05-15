import { useTranslation } from "react-i18next";
import { PlayersList } from "../../components/PlayersList/PlayersList";
import { Layout } from "../../components/Layout/Layout";

export const PlayersPage = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <h2>{t("players")}</h2>

            <p>{t("players.description")}</p>

            <PlayersList />
        </Layout>
    );
};
