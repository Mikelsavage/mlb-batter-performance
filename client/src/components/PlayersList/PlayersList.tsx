import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import styles from "./PlayersList.module.scss";
import { useTranslation } from "react-i18next";
import { useGetPlayersWithToken } from "../../services/players";
import { useMemo, useState } from "react";

type SortOrderType = "asc" | "desc";

export const PlayersList = () => {
    const { players = [], isLoading, error } = useGetPlayersWithToken();
    const [searchValue, setSearchValue] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrderType>("asc");

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
            return playerName.includes(searchValue);
        });
    }, [players, searchValue]);

    if (isLoading) return <div>{t("players.loading")}</div>;

    if (error) return <div>{t("errors.playersData")}</div>;

    return (
        <>
            <div className={styles.filters}>
                <div className={styles.searchContainer}>
                    <form
                        className={styles.searchForm}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label htmlFor="search">
                            {t("players.search.label")}
                        </label>
                        <input
                            className={styles.searchInput}
                            id="search-value"
                            onChange={handleSearchInputChange}
                            type="text"
                            placeholder={t("players.search.placeholder")}
                        />
                    </form>
                </div>

                <div className={styles.sortContainer}>
                    <label htmlFor="sort">{t("players.sort.label")}</label>

                    <div className={styles.buttonGroup}>
                        <label
                            className={styles.sortButtonContainer}
                            htmlFor="sort-asc"
                        >
                            <input
                                type="radio"
                                id="sort-asc"
                                name="sort"
                                value="asc"
                                checked={sortOrder === "asc"}
                                onChange={() => setSortOrder("asc")}
                            />

                            <span className={styles.sortButton}>
                                {t("players.sort.asc")}
                            </span>
                        </label>

                        <label
                            className={styles.sortButtonContainer}
                            htmlFor="sort-desc"
                        >
                            <input
                                className={styles.sortButton}
                                type="radio"
                                id="sort-desc"
                                name="sort"
                                value="desc"
                                checked={sortOrder === "desc"}
                                onChange={() => setSortOrder("desc")}
                            />

                            <span className={styles.sortButton}>
                                {t("players.sort.desc")}
                            </span>
                        </label>
                    </div>
                </div>
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
                    {orderBy(filteredPlayers, "playerFullName", sortOrder)?.map(
                        (player) => (
                            <li key={player.playerId}>
                                <PlayerCard player={player} />
                            </li>
                        )
                    )}
                </ul>
            )}
        </>
    );
};
