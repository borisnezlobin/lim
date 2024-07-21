import { TrashSimple } from "phosphor-react";
import { Limit } from "../lib/LimitController";
import styles from "../styles/list-item.module.css";

/** 
 * A component that displays a single limit as part of a list
 */
function LimitListItem({ limit }: { limit: Limit }) {
    return (
        <div key={limit.id} className={styles.container}>
            <div>
                <h2>{limit.name}</h2>
                <code>{limit.urlRegex.length > 20 ? limit.urlRegex.slice(0, 20) + "..." : limit.urlRegex}</code>
            </div>
            <div className={styles.right}>
                <div className="pill">{limit.perDay}</div>
                <button className={styles.trashButton}>
                    <TrashSimple color='red' size={24} />
                </button>
            </div>
        </div>
    )
}

export { LimitListItem };
