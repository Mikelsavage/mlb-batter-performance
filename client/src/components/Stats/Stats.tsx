import { Stat } from "../Stat/Stat";
import kebabCase from "lodash/kebabCase";
import map from "lodash/map";
import styles from "./Stats.module.scss";

type StatsProps = {
    stats: {
        grade?: string;
        imageSrc?: string;
        label: string;
        value: number | string;
    }[];
};

export const Stats = ({ stats }: StatsProps) => {
    return (
        <div className={styles.statsContainer}>
            {map(stats, (stat) => (
                <Stat
                    grade={stat.grade}
                    imageSrc={stat.imageSrc}
                    key={kebabCase(stat.label)}
                    label={stat.label}
                    value={stat.value}
                />
            ))}
        </div>
    );
};
