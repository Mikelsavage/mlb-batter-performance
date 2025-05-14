import clsx from "clsx";
import snakeCase from "lodash/snakeCase";
import styles from "./Stat.module.scss";

type StatProps = {
    grade?: string;
    imageSrc?: string;
    label: string;
    value: number | string;
};

export const Stat = ({ grade, imageSrc, label, value }: StatProps) => {
    return (
        <div className={styles.statCard}>
            {imageSrc && (
                <img src={imageSrc} alt={label} className={styles.image} />
            )}

            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>

            {grade && (
                <span
                    className={clsx(
                        styles.grade,
                        styles[`${snakeCase(grade)}`]
                    )}
                >
                    {grade}
                </span>
            )}
        </div>
    );
};
