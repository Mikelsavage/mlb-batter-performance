import styles from "./Layout.module.scss";

type LayoutProps = {
    children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
    <div className={styles.layout}>
        <main className={styles.main}>{children}</main>
    </div>
);
