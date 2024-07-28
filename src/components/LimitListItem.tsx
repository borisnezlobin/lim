import { PencilSimple, TrashSimple } from "phosphor-react";
import { Limit } from "../lib/LimitController";
import styles from "../styles/list-item.module.css";
import { useContext } from "react";
import { LimitControllerContext } from "../lib/LimitControllerContext";
import { useNavigate } from "react-router-dom";

const MINUTES = 60 * 1000;

/** 
 * A component that displays a single limit as part of a list
 */
function LimitListItem({ limit }: { limit: Limit }) {
    const nav = useNavigate();
    const { deleteLimit } = useContext(LimitControllerContext);

    const name = limit.name.length > 20 ? limit.name.slice(0, 20) + "..." : limit.name;

    const editLimit = () => {
        nav(`/edit`, { state: { limit } });
    }

    const isOvertime = limit.usedToday > limit.perDay * MINUTES;

    return (
        <div key={limit.id} className={`${styles.container} ${isOvertime ? styles.overtime : ""}`}>
            <code className={`${isOvertime ? styles.overtime : ""}`}>
                {Math.floor(limit.usedToday / MINUTES)} / {limit.perDay}
            </code>
            <div>
                <h2>{name}</h2>
                <code>{limit.urlRegex.length > 20 ? limit.urlRegex.slice(0, 20) + "..." : limit.urlRegex}</code>
            </div>
            <div className={styles.right}>
                <button className={styles.iconButton} onClick={editLimit}>
                    <PencilSimple size={24} />
                </button>
                <button className={styles.iconButton} onClick={() => deleteLimit(limit.id)}>
                    <TrashSimple color='red' size={24} />
                </button>
            </div>
        </div>
    )
}

export { LimitListItem };
