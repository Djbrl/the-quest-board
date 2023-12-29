export function timestampConverter() {
    const getMinutesPassed = (timestamp: number) => {
        const currentTimestamp = Date.now();
        const minutesPassed = Math.floor((currentTimestamp - timestamp) / (60 * 1000));
        return minutesPassed;
    };
  
    const getSecondsPassed = (timestamp: number) => {
        const currentTimestamp = Date.now();
        const secondsPassed = Math.floor((currentTimestamp - timestamp) / (1000));
        return secondsPassed;
    };
  
    const getHoursPassed = (timestamp: number) => {
        const currentTimestamp = Date.now();
        const hoursPassed = Math.floor((currentTimestamp - timestamp) / (60 * 60 * 1000));
        return hoursPassed;
    };
  
    return {
      getMinutesPassed,
      getSecondsPassed,
      getHoursPassed,
    };
}

export function goToPost (url: string) {
    window.open(`https://reddit.com${url}`, '_blank');
}

export function isHotGig (timestamp: string, comments: string) {
    const now = Date.now();
    const seconds = Math.floor((now - parseInt(timestamp)) / 1000);
    if (seconds < 3600 * 2 && parseInt(comments) >= 15) return true;
    if (seconds >= 5400 && seconds < 3600 * 4 && parseInt(comments) >= 40) return true;
    return false;
}