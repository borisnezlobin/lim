
type Limit = {
    id: number;
    /** how much time (in minutes) we are allowed to use a website for */
    perDay: number;
    /** a regex specifying which websites to block */
    urlRegex: string;
    /** amount we have used a website matching urlRegex today in milliseconds */
    usedToday: number;
    /** after time is up, do we show a "one more minute" button for this limit?
     * (note: "after time" is actually one minute before time is up, lol)
    */
    allowOneMoreMinute: boolean;
}

class LimitController {
    limits: Limit[] = [];

    constructor() {
        // read from storage.local the limits and how much they've been used so far today
    }

    public async read() {
        // @ts-ignore
        this.limits = await browser.storage.local.get("limits");
    }

    public add(limit: Limit) {
        // todo: error handling
        this.limits.push(limit);
        this.write();
    }

    public async write() {
        // @ts-ignore
        await browser.storage.local.set({ limits: this.limits });
    }
}

export { LimitController };
export type { Limit };