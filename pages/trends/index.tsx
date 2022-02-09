import { useEffect, useState } from "react";
import { format, intervalToDuration, formatDuration } from "date-fns";

import Skeleton from "react-loading-skeleton";
import Container from "@/components/container";

import { useAllLogs } from "@/lib/swr-hooks";
import { channels, getDailyBreakdown, mapLogs } from "@/lib/data-processing";
import LineGraph from "@/components/graphs/line-graph";

export default function Trends() {
  const { logs, isLoading } = useAllLogs();
  let measurements = mapLogs(logs);
  console.log(measurements);
  // const [days, setDays] = useState({});
  // useEffect(() => {
  //   setDays(getDailyBreakdown(logs));
  // }, [logs]);

  //Count assumes every 30 seconds there are 2 logs
  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      <div className="grid grid-cols-2">
        <LineGraph data={measurements["40"]} dataLabels={channels["40"]} />
        <LineGraph data={measurements["41"]} dataLabels={channels["41"]} />
        <LineGraph data={measurements["50"]} dataLabels={channels["50"]} />
        <LineGraph data={measurements["51"]} dataLabels={channels["51"]} />
        <LineGraph data={measurements["61"]} dataLabels={channels["61"]} />
        <LineGraph data={measurements["62"]} dataLabels={channels["62"]} />
        <LineGraph data={measurements["63"]} dataLabels={channels["63"]} />
        <LineGraph data={measurements["64"]} dataLabels={channels["64"]} />
      </div>
      {/* {Object.entries(days).map(([day, count]: [string, number]) => (
        <div className="flex p-2 m-2 bg-green-200 text-xs">
          <div className="w-3/5 font-bold">
            {format(new Date(day), "d MMMM yyyy")}
          </div>
          <div className="w-2/5">
            {formatDuration(
              intervalToDuration({
                start: 0,
                end: ((count * 10) / 2) * 1000,
              }),
              { format: ["hours", "minutes"], delimiter: ", " }
            )}
          </div>
        </div>
      ))} */}
    </Container>
  );
}
