import useSWR from "swr";
import { mapLogs } from "../lib/data-processing";

async function fetcher(url: string) {
  return window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("fetched new data");
      return data ? mapLogs(data) : null;
    });
}

export function useAllLogs() {
  const { data, error } = useSWR(`/api/get-all-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useLatestLogs() {
  const { data, error } = useSWR(`/api/get-latest-logs`, fetcher, {
    refreshInterval: 5000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useThirtySecondLogs() {
  const { data, error } = useSWR(`/api/get-thirty-second-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneMinuteLogs() {
  const { data, error } = useSWR(`/api/get-one-minute-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTenMinuteLogs() {
  const { data, error } = useSWR(`/api/get-ten-minute-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneWeekLogs() {
  const { data, error } = useSWR(`/api/get-one-week-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneHourLogs() {
  const { data, error } = useSWR(`/api/get-one-hour-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneDayLogs() {
  const { data, error } = useSWR(`/api/get-one-day-logs`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}
