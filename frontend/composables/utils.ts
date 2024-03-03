export function timestampConverter() {
    const getMinutesPassed = (timestamp:number) => {
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const minutesPassed = Math.floor((currentTimestamp - timestamp) / 60);
        return minutesPassed;
    };
      
    const getSecondsPassed = (timestamp:number) => {
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const secondsPassed = currentTimestamp - timestamp;
        return secondsPassed;
    };
  
    const getHoursPassed = (timestamp:number) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const hoursPassed = Math.floor((currentTimestamp - timestamp) / 3600);
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

export function isHotGig(timestamp:number, comments:number) {
    const now = Math.floor(Date.now() / 1000); 
    const seconds = timestampConverter().getSecondsPassed(timestamp); 
  
    if (seconds < 3600 * 2 && comments >= 15) return true;
    if (seconds >= 5400 && seconds < 3600 * 4 && comments >= 40) return true;
  
    return false;
}