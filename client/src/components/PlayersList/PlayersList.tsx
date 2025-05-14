import { Player } from "../../types/players";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import styles from "./PlayersList.module.scss";

export const PlayersList = ({ players }: { players: Player[] }) => {
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
