export const SIMPLE_MODE_PREFIX = "^[a-z]*:\\/\\/[a-z.]*(?:";
export const SIMPLE_MODE_SUFFIX = ")\\.[a-z.]{2,}";

export function smToRegex(sm: string): string {
    sm = sm.replace(/, +/g, "|").replace(/\|+/g, "|").toLowerCase();
    return SIMPLE_MODE_PREFIX + sm + SIMPLE_MODE_SUFFIX;
}

export function regexToSM(regex: string): string {
    // @ts-expect-error idk why replaceAll isn't defined
    regex = regex.replaceAll(SIMPLE_MODE_PREFIX, "").replaceAll(SIMPLE_MODE_SUFFIX, "");
    return regex.replace(/\| */g, ", ");
}

export function isSimpleMode(regex: string): boolean {
    return regex.startsWith(SIMPLE_MODE_PREFIX);
}