import { createContext, useEffect, useState } from "react";

export type UsageType = RawUsageType & {
    icon: string;
}

export type RawUsageType = {
    time: number;
    url: string
}

type UsageContextType = {
    usage: { [key: string]: UsageType } | null;
    usageArr: UsageType[];
    rawUsage: RawUsageType[] | null;
}


const UsageContext = createContext<UsageContextType>({
    usage: {},
    usageArr: [],
    rawUsage: []
});


const UsageProvider = ({ children }: { children: React.ReactNode }) => {
    const [usage, setUsage] = useState<{ [key: string]: UsageType } | null>(null);
    const [rawUsage, setRawUsage] = useState<RawUsageType[] | null>(null);

    useEffect(() => {
        if (usage == null) {
            updateUsage();
        }

        if (rawUsage == null) {
            updateRawUsage();
        }

        async function updateRawUsage() {
            // @ts-expect-error browser is "not defined", but it is in our case
            const rawUsage: RawUsageType[] = Object.values((await browser.storage.local.get("rawUsage")).rawUsage) || [];
            setRawUsage(rawUsage);
        }

        async function updateUsage() {
            // @ts-expect-error browser is "not defined", but it is in our case
            const usage = (await browser.storage.local.get("usage")).usage || {};
            setUsage(usage);
        }
    }, [usage]);

    return (
        <UsageContext.Provider value={{
            usage: usage,
            usageArr: usage ? Object.values(usage).sort((a, b) => b.time - a.time) : [],
            rawUsage: rawUsage
        }}>
            {children}
        </UsageContext.Provider>
    )
}

export { UsageContext, UsageProvider };