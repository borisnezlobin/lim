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