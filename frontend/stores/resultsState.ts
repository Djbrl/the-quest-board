// composables/results.ts
import { defineStore } from 'pinia';
import { timestampConverter } from '~/composables/utils';

export const useResults = defineStore('results', () => {
  const { getHoursPassed, getMinutesPassed } = timestampConverter();
  const lightMode = ref(false);
  const results = ref<any[]>([]);
  const sortedResults = ref<any[]>([]);
  const visibleResults = ref<any[]>([]);

  const setVisibleResults = (data:Array<any>) => {
    visibleResults.value = data;
  }

  const getVisibleResults = () => {
    return visibleResults.value;
  }

  const setResults = (data:Array<any>) => {
    results.value = data;
    sortedResults.value = data;
  }

  const getResults = () => {
    return results.value;
  }

  const getAll = () => {
    sortedResults.value = results.value
    return sortedResults.value
  }

  const getSortedResults = () => {
    return sortedResults.value
  }

  const getResultsCount = () => {
    return results.value.length;
  }

  const getToday = () => {
    sortedResults.value = results.value.filter(result => getHoursPassed(result.created_utc) <= 24)
    console.log(sortedResults.value)
    return sortedResults.value
  }

  const getLastHour = () => {
    sortedResults.value = results.value.filter(result => {
      if (getMinutesPassed(result.created_utc) <= 90){
        return result
      }
    })
    return sortedResults.value
  }

  const getTrending = () => {
    sortedResults.value = results.value.filter(result => {
      if (result.num_comments >= 15 && getMinutesPassed(result.created_utc) <= 120){
        return result
      } else if (result.num_comments > 40 && getHoursPassed(result.created_utc) <= 6){
        return result
      }
    })
    return sortedResults.value
  }

  const getKeywordOccurence = (keyword:string) => {
    sortedResults.value = results.value.filter((result:any) => {
      const title:string = result.title.toLowerCase()
      if(title.includes(keyword.toLowerCase())){
        return result
      }
    })
    if(sortedResults.value.length === 0) {
      return []
    }
    return sortedResults.value
  }

  const getTop5KeywordMatches = (keywords:Array<string>) => {
    const keywordCounts: Record<string, number> = {};

    results.value.forEach((result) => {
        const title = result.title.toLowerCase();
        keywords.forEach((keyword) => {
            if (title.includes(keyword.toLowerCase())) {
                keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            }
        });
    });

    const sortedKeywords = Object.keys(keywordCounts).sort(
        (a, b) => keywordCounts[b] - keywordCounts[a]
    );

    return sortedKeywords.slice(0, 5);
  }

  const toggleLightMode = () => {
    lightMode.value = !lightMode.value
  }

  const getCurrentTheme = () => {
    if (lightMode.value === true){
      return 'light'
    } else {
      return 'dark'
    }
  }
  return { getCurrentTheme, toggleLightMode, setResults, getResults, setVisibleResults, getVisibleResults, getSortedResults, getAll, getResultsCount, getToday, getLastHour, getTrending, getKeywordOccurence, getTop5KeywordMatches}
})