import { StatsType } from "../types/stats";

export const calculateAVG = ({ AB, H }: Pick<StatsType, "AB" | "H">) => H / AB;

export const calculateOBP = ({
    AB,
    BB,
    H,
    HBP,
    SF,
}: Pick<StatsType, "AB" | "BB" | "H" | "HBP" | "SF">) =>
    (BB + H + HBP) / (AB + BB + HBP + SF);

export const calculateSLG = ({
    AB,
    TB,
}: Pick<StatsType, "AB" | "TB">): number => TB / AB;

export const calculateOPS = ({
    TB,
    AB,
    H,
    BB,
    HBP,
    SF,
}: Pick<StatsType, "AB" | "BB" | "H" | "HBP" | "SF" | "TB">) =>
    calculateSLG({ AB, TB }) + calculateOBP({ AB, BB, H, HBP, SF });

export const gradeAVG = (AVG: number): string => {
    if (AVG >= 0.3) return "S";
    if (AVG >= 0.275) return "A";
    if (AVG >= 0.26) return "B";
    if (AVG >= 0.2) return "C";
    if (AVG >= 0.1) return "D";
    return "F";
};

export const gradeOBP = (OBP: number): string => {
    if (OBP >= 0.4) return "S";
    if (OBP >= 0.35) return "A";
    if (OBP >= 0.325) return "B";
    if (OBP >= 0.3) return "C";
    if (OBP >= 0.29) return "D";
    return "F";
};

export const gradeOPS = (OPS: number): string => {
    if (OPS >= 0.9) return "S";
    if (OPS >= 0.833) return "A";
    if (OPS >= 0.767) return "B";
    if (OPS >= 0.7) return "C";
    if (OPS >= 0.633) return "D";
    if (OPS >= 0.567) return "E";
    return "F";
};

export const gradeSLG = (SLG: number): string => {
    if (SLG >= 0.6) return "S";
    if (SLG >= 0.55) return "A";
    if (SLG >= 0.5) return "B";
    if (SLG >= 0.4) return "C";
    if (SLG >= 0.35) return "D";
    if (SLG >= 0.3) return "E";
    return "F";
};
