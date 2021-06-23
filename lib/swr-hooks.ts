import useSWR from "swr";
import { mapLogs } from "../lib/data-processing";

function fetcher(url: string) {
  return window
    .fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("fetched new data");
      return data ? mapLogs(data) : null;
    });
}

export function useLogs() {
  const { data, error } = useSWR(`/api/get-logs`, fetcher, {
    refreshInterval: 10000,
  });
  // const logs = data ? mapLogs(data) : null;
  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
  };
}
