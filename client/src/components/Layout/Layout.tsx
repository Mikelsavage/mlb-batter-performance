import styles from "./Layout.module.scss";

type LayoutProps = {
    children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
    <div className={styles.layout}>
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <h1>Player Hitting Evaluations</h1>
            </div>
        </header>

        <main className={styles.main}>{children}</main>
    </div>
);
