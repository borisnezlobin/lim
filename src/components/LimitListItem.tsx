import { PencilSimple, TrashSimple } from "phosphor-react";
import { Limit } from "../lib/LimitController";
import styles from "../styles/list-item.module.css";
import { useContext } from "react";
import { LimitControllerContext } from "../lib/LimitControllerContext";
import { useNavigate } from "react-router-dom";
import { isSimpleMode, regexToSM } from "../utils";

const MINUTES = 60 * 1000;

/** 
 * A component that displays a single limit as part of a list
 */
function LimitListItem({ limit }: { limit: Limit }) {
    const nav = useNavigate();
    const { deleteLimit, cancelDeletion } = useContext(LimitControllerContext);

    const name = limit.name.length > 20 ? limit.name.slice(0, 20) + "..." : limit.name;


    const antiSimpled = isSimpleMode(limit.urlRegex) ? regexToSM(limit.urlRegex) : limit.urlRegex;
    const regex = antiSimpled.length > 20 ? antiSimpled.slice(0, 20) + "..." : antiSimpled;

    const editLimit = () => {
        nav(`/edit`, { state: { limit } });
    }

    const isOvertime = limit.usedToday >= limit.perDay * MINUTES;
    const queued = limit.delayedDelete !== null;

    return (
        <div
            key={limit.id}
            className={`${styles.container} ${isOvertime ? styles.overtime : ""}`}
        >
            <div>
                <h2>{name}</h2>
                <code>{regex}</code>
            </div>
            <div className={styles.right}>
                <code className={`${isOvertime ? styles.overtime : ""} ${styles.usage}`}>
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                        {Math.floor(limit.usedToday / MINUTES)}
                    </span>
                    /{limit.perDay}
                </code>
                <button className={styles.iconButton} onClick={editLimit}>
                    <PencilSimple size={24} />
                </button>
                <button className={styles.iconButton} onClick={() => deleteLimit(limit.id)}>
                    <TrashSimple color='#a40a0b' size={24} />
                </button>
            </div>
            {queued &&
                <div className={styles.queued}>
                    <p style={{ padding: "8px 20px", borderRadius: 16 }}>
                        Queued for deletion.
                        <p className="muted">
                            Will be deleted tomorrow.
                        </p>
                    </p>
                    <button className={styles.cancel} onClick={() => cancelDeletion(limit.id)}>
                        Cancel Deletion
                    </button>
                </div>
            }
        </div>
    )
}

export { LimitListItem };
