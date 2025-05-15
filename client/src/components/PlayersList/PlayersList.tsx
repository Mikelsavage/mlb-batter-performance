import isEmpty from "lodash/isEmpty";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import styles from "./PlayersList.module.scss";
import { useTranslation } from "react-i18next";
import { useGetPlayersWithToken } from "../../services/players";
import { useMemo, useState } from "react";

export const PlayersList = () => {
    const { players = [], isLoading, error } = useGetPlayersWithToken();
    const [searchValue, setSearchValue] = useState("");

    const { t } = useTranslation();

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);
    };

    // Filter players by any part of their name
    const filteredPlayers = useMemo(() => {
        if (isEmpty(players)) return players;

        return players.filter((player) => {
            const playerName = player.playerFullName.toLowerCase();
            const playerNameParts = playerName.split(" ");
            return playerNameParts.some((part) => part.includes(searchValue));
        });
    }, [players, searchValue]);

    if (isLoading) return <div>{t("players.loading")}</div>;

    if (error) return <div>{t("errors.playersData")}</div>;

    return (
        <>
            <div className={styles.searchContainer}>
                <form
                    className={styles.searchForm}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label htmlFor="search">{t("players.search.label")}</label>
                    <input
                        className={styles.searchInput}
                        id="search-value"
                        onChange={handleSearchInputChange}
                        type="text"
                        placeholder={t("players.search.placeholder")}
                    />
                </form>
            </div>

            {isEmpty(filteredPlayers) ? (
                isEmpty(searchValue) ? (
                    <div>
                        <p>{t("players.empty")}</p>
                    </div>
                ) : (
                    <div>
                        <p>{t("players.search.noMatch", { searchValue })}</p>
                    </div>
                )
            ) : (
                <ul className={styles.list}>
                    {filteredPlayers?.map((player) => (
                        <li key={player.playerId}>
                            <PlayerCard player={player} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};
