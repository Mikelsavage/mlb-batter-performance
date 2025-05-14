import { useNavigate } from "react-router-dom";
import type { Player } from "../../types/players";
import styles from "./PlayerCard.module.scss";

export const PlayerCard = ({ player }: { player: Player }) => {
    const navigate = useNavigate();

    const { playerId, playerFullName, playerImage, teamImage } = player;

    const handleCardClick = async () => {
        navigate(`/player/${playerId}`);
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
