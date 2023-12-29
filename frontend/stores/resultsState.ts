// composables/results.ts
import { defineStore } from 'pinia';
import { timestampConverter } from '~/composables/utils';

export const useResults = defineStore('results', () => {
  const { getHoursPassed, getMinutesPassed } = timestampConverter();
  const results = ref<any[]>([]);
  const sortedResults = ref<any[]>([]);

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
    sortedResults.value = results.value.filter(result => getHoursPassed(parseInt(result.timestamp)) <= 24)
    return sortedResults.value
  }

  const getLastHour = () => {
    sortedResults.value = results.value.filter(result => {
      if (getMinutesPassed(parseInt(result.timestamp)) <= 60){
        return result
      }
    })
    return sortedResults.value
  }

  const getTrending = () => {
    sortedResults.value = results.value.filter(result => {
      if (result.comments >= 15 && getMinutesPassed(parseInt(result.timestamp)) <= 120){
        return result
      } else if (result.comments > 40 && getHoursPassed(parseInt(result.timestamp)) <= 6){
        return result
      }
    })
    return sortedResults.value
  }

  const getKeywordOccurence = (keyword:string) => {
    sortedResults.value = results.value.filter(result => result.title.includes(keyword))
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

  return { setResults, getResults, getSortedResults, getAll, getResultsCount, getToday, getLastHour, getTrending, getKeywordOccurence, getTop5KeywordMatches}
})