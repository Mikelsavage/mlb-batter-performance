import type { Player } from "../../types/players";
import styles from "./PlayerCard.module.scss";
import { useGetPlayerByIdWithToken } from "../../services/players";

export const PlayerCard = ({ player }: { player: Player }) => {
    const { playerId, playerFullName, playerImage, teamImage } = player;

    const playerDataFetcher = useGetPlayerByIdWithToken(playerId);

    const handleCardClick = async () => {
        try {
            const playerData = playerDataFetcher;
            console.log(playerData);
        } catch (error) {
            console.error("Failed to fetch player data:", error);
        }
    };

    return (
        <button className={styles.card} onClick={handleCardClick}>
            <img
                src={playerImage}
                alt={playerFullName}
                className={styles.playerImage}
            />

            <div className={styles.playerInfo}>
                <h3>{playerFullName}</h3>
            </div>

            <div className={styles.teamImage}>
                <img src={teamImage} alt="Team Logo" />
            </div>
        </button>
    );
};
