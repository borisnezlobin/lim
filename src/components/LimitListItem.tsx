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
                <h2>{limit.urlRegex}</h2>
                <p>{limit.usedToday}/{limit.perDay} used today</p>
            </div>
            <button className={styles.trashButton}>
                <TrashSimple color='red' size={24} />
            </button>
        </div>
    )
}

export { LimitListItem };
