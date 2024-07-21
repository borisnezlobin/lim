
const getURL = (str) => {
    try {
        const url = new URL(str).hostname;
        return url ? url : str.split("#")[0];
    } catch (e) {
        return str.split("#")[0];
    }
};

const limitMatches = (url, limit) => {
    return url.match(limit.url);
};

export { getURL, limitMatches };