/**
 * formats a number of milliseconds into a human readable format in a compact way
 * @param ms the number of milliseconds to format
 * @returns a string representing the number of milliseconds in a human readable format ("3s", "5m", "1h 30m")
 */
const formatMS = (ms: number): string => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    if(hours < 1){
        if(minutes < 1){
            return `${seconds}s`;
        }

        return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
}

export { formatMS };