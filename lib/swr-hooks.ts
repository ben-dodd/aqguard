import useSWR from "swr";
import { mapLogs } from "../lib/data-processing";

async function mappedFetcher(url: string) {
  return window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data ? mapLogs(data) : null;
    });
}

async function rawFetcher(url: string) {
  return window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

export function useAllLogs() {
  const { data, error } = useSWR(`/api/get-all-logs`, rawFetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useLatestLogs() {
  const { data, error } = useSWR(`/api/get-latest-logs`, mappedFetcher, {
    refreshInterval: 5000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useThirtySecondLogs() {
  const { data, error } = useSWR(
    `/api/get-thirty-second-logs`,
    mappedFetcherCA
  );
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneMinuteLogs() {
  const { data, error } = useSWR(`/api/get-one-minute-logs`, mappedFetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTenMinuteLogs() {
  const { data, error } = useSWR(`/api/get-ten-minute-logs`, mappedFetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneWeekLogs() {
  const { data, error } = useSWR(`/api/get-one-week-logs`, mappedFetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneHourLogs() {
  const { data, error } = useSWR(`/api/get-one-hour-logs`, mappedFetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useOneDayLogs() {
  const { data, error } = useSWR(`/api/get-one-day-logs`, mappedFetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}
