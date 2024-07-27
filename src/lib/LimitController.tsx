type Limit = {
    /** unique id for this limit, idek if it's necessary */
    id: number;
    /** how the user decides to name this limit */
    name: string;
    /** how much time (in minutes) we are allowed to use a website for */
    perDay: number;
    /** a regex specifying which websites to block */
    urlRegex: string;
    /** how much time we've used so far today */
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

    public read(): Promise<{ limits: Limit[] }> {
        return new Promise((resolve) => {
            // @ts-expect-error browser is not defined (it is)
            browser.storage.local.get("limits").then((response) => {
                if(response && response.limits) {
                    this.limits = response.limits;
                } else {
                    this.limits = [];
                }
                resolve({ limits: this.limits });
            }).catch(() => {
                this.limits = [];
                resolve({ limits: this.limits });
            });
        });
    }

    public add(limit: Limit) {
        // todo: error handling
        this.limits.push(limit);
        this.write();
    }

    public async write() {
        // @ts-expect-error browser is not defined (it is)
        await browser.storage.local.set({ limits: this.limits });
    }

    public async remove(id: number) {
        this.limits = this.limits.filter((limit) => limit.id !== id);
        await this.write();

        return this.limits;
    }
}

export { LimitController };
export type { Limit };