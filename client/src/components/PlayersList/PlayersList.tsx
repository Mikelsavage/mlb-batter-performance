import isEmpty from "lodash/isEmpty";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import styles from "./PlayersList.module.scss";
import { useTranslation } from "react-i18next";
import { useGetPlayersWithToken } from "../../services/players";

export const PlayersList = () => {
    const { players = [], isLoading, error } = useGetPlayersWithToken();

    const { t } = useTranslation();

    if (isLoading) return <div>{t("players.loading")}</div>;

    if (error) return <div>{t("errors.playersData")}</div>;

    if (isEmpty(players)) {
        return (
            <div>
                <p>{t("players.empty")}</p>
            </div>
        );
    }

    return (
        <ul className={styles.list}>
            {players?.map((player) => (
                <li key={player.playerId}>
                    <PlayerCard player={player} />
                </li>
            ))}
        </ul>
    );
};
