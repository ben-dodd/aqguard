import { useEffect, useState } from "react";
import { format, intervalToDuration, formatDuration } from "date-fns";

import Skeleton from "react-loading-skeleton";
import Container from "@/components/container";

import { useAllLogs } from "@/lib/swr-hooks";
import { getDailyBreakdown } from "@/lib/data-processing";

export default function Historical() {
  const { logs, isLoading } = useAllLogs();
  const [days, setDays] = useState({});
  useEffect(() => {
    setDays(getDailyBreakdown(logs));
  }, [logs]);

  //Count assumes every 30 seconds there are 2 logs
  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      {Object.entries(days).map(([day, count]: [string, number]) => (
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
      ))}
    </Container>
  );
}
