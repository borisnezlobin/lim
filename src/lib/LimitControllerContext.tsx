import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Limit, LimitController } from './LimitController';
import { UsageContext } from './UsageContext';

type LimitControllerContextType = {
    limits: Limit[] | null;
    addLimit: (name: string, regex: string, time: number) => void;
    isEmpty: () => boolean;
    deleteLimit: (id: number) => void;
    editLimit: (id: number, name: string, regex: string, time: number) => void;
}

const LimitControllerContext = createContext<LimitControllerContextType>({
    limits: null,
    addLimit: () => {},
    isEmpty: () => true,
    deleteLimit: () => {},
    editLimit: () => {}
});

const LimitControllerProvider = ({ children }: { children: React.ReactNode }) => {
    const { rawUsage } = useContext(UsageContext);
    const limitController = useMemo(() => new LimitController(), []);
    const [limits, setLimits] = useState<Limit[] | null>(null);

    useEffect(() => {
        if(limits === null) {
            limitController.read().then((result) => {
                setLimits(result.limits);
            });
        }
    }, [limits, limitController]);

    function addLimit(name: string, regex: string, time: number){
        const limit: Limit = {
            id: Date.now(),
            name: name,
            urlRegex: regex,
            perDay: time,
            allowOneMoreMinute: false,
            usedToday: 0
        }

        for(const usage of rawUsage ? rawUsage : []){
            if(usage.url.match(regex)){
                limit.usedToday += usage.time;
            }
        }

        limitController.add(limit);
        setLimits(limitController.limits);
    }

    function deleteLimit(id: number){
        limitController.remove(id).then((limits) => {
            setLimits(limits);
        });
    }

    function editLimit(id: number, name: string, regex: string, time: number){
        limitController.edit(id, name, regex, time, rawUsage ?? []).then((limits) => {
            setLimits(limits);
        });
    }

    function isEmpty(){
        return limits === null || limits === undefined || limits.length === 0;
    }

    return (
        <LimitControllerContext.Provider value={{
            limits,
            addLimit,
            isEmpty,
            deleteLimit,
            editLimit
        }}>
            {children}
        </LimitControllerContext.Provider>
    );
}


export { LimitControllerContext, LimitControllerProvider };