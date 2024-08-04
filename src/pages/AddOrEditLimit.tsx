import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LimitControllerContext } from '../lib/LimitControllerContext';

export const SIMPLE_MODE_PREFIX = "^[a-z]*:\\/\\/[a-z.]*[";
export const SIMPLE_MODE_SUFFIX = "]\\.[a-z.]{2,}";

/**
 * Page that has a limit-creation form (name of website, some options, and time per day)
 */
function AddOrEditLimitPage() {
    const location = useLocation();
    const isAdding = location.pathname === "/create";

    const [website, setWebsite] = useState<string>(isAdding ? "" : location.state.limit.urlRegex.replaceAll(SIMPLE_MODE_PREFIX, "").replaceAll(SIMPLE_MODE_SUFFIX, ""));
    const [name, setName] = useState<string>(isAdding ? "" : location.state.limit.name);
    const [time, setTime] = useState<string>(isAdding ? "" : location.state.limit.perDay.toString());
    const [simpleMode, setSimpleMode] = useState<boolean>(isAdding ? true : location.state.limit.urlRegex.startsWith(SIMPLE_MODE_PREFIX));
    const { addLimit, editLimit } = useContext(LimitControllerContext);
    const nav = useNavigate();

    const submit = () => {
        // todo: validate input (IMPORTANT (ish))
        let regex = website;
        if (simpleMode) {
            // todo: check that the regex is actually like fr a domain with no non-alphanumeric characters
            // like
            const validSimpleRegex = /^[a-z0-9]+$/;
            if (!validSimpleRegex.test(regex)) {
                alert("Invalid simple regex"); // but with ui
                return;
            }
            regex = SIMPLE_MODE_PREFIX + regex + SIMPLE_MODE_SUFFIX; // ...hope this works
        }

        if (isAdding) {
            addLimit(name, regex, parseFloat(time));
        } else {
            editLimit(location.state.limit.id, name, regex, parseFloat(time));
        }
        nav("/");
    }

    // @ts-expect-error should work
    const url = browser.runtime.getURL("html/regexlimits.html");

    return (
        <div>
            <h1>{isAdding ? "Create" : "Edit"} Limit</h1>
            <form style={{ width: "100%" }}>
                <InputWithTitle placeholder="Ex: Social Media" title='Name' value={name} onChange={setName} />
                <InputWithTitle placeholder={`Ex: twitter${simpleMode ? "" : "\\.[a-z\.]{2,}\\/elonmusk\\/status\\/[0-9]*"}`} title='Website RegEx' value={website} onChange={setWebsite} />
                <p style={{ display: 'flex', flexDirection: 'row', gap: 6, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <label style={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <input type="checkbox" checked={simpleMode} onChange={(e) => setSimpleMode(e.target.checked)} />
                        <p>Simple mode</p>
                    </label>
                    <a href={url.replaceAll("regexlimits", "simplemode")} className='muted' style={{ textDecoration: "underline" }}>
                        What's Simple Mode?
                    </a>
                </p>
                <InputWithTitle placeholder="Ex: 20" title='Time per day' value={time} onChange={setTime} />
            </form>
            <p>
                Don't know what RegEx is? Check out <a href={url} target="_blank" rel="noopener noreferrer">our guide</a>.
            </p>

            <button onClick={submit} style={{
                marginRight: "1em",
                marginTop: "1em",
            }}>
                {isAdding ? "Create" : "Save"}
            </button>
            <button onClick={() => nav("/")}>
                Cancel
            </button>
        </div>
    )
}

const InputWithTitle = ({ title, placeholder, value, onChange }: { title: string, value: string, placeholder?: string, onChange: (value: string) => void }) => {
    return (
        <div>
            <p style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: 0 }}>
                {title}
            </p>
            <input
                maxLength={title === "Name" ? 20 : undefined}
                value={value}
                type="text"
                placeholder={placeholder ?? title}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export { AddOrEditLimitPage }
