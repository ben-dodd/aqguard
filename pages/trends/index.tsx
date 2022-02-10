import { useEffect, useState } from "react";
import { format, intervalToDuration, formatDuration } from "date-fns";

import Skeleton from "react-loading-skeleton";
import Container from "@/components/container";

import { useAllLogs } from "@/lib/swr-hooks";
import { channels, getDailyBreakdown, mapLogs } from "@/lib/data-processing";
import LineGraph from "@/components/graphs/line-graph";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";

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
      <div className="py-8">
        <div className="text-center w-full font-bold text-3xl pb-4">
          <span style={{ color: "#a02222" }}>Temperature</span> and{" "}
          <span style={{ color: "#1d92a8" }}>Humidity</span>
        </div>
        <LineChart
          width={1800}
          height={500}
          data={getTempAndHumidity(measurements)}
        >
          <XAxis dataKey="date" height={50}>
            <Label value="Time (10min intervals)" position="insideBottom" />
          </XAxis>
          <YAxis yAxisId="temp">
            <Label
              value={`Temperature`}
              angle={-90}
              position={"insideLeft"}
              offset={10}
            />
          </YAxis>
          <YAxis yAxisId="hum" orientation="right">
            <Label
              value={`Humidity`}
              angle={-90}
              position={"insideRight"}
              offset={10}
            />
          </YAxis>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            stroke="#a02222"
            strokeWidth={3}
            dot={false}
          />
          <Line
            yAxisId="hum"
            type="monotone"
            dataKey="hum"
            stroke="#1d92a8"
            strokeWidth={3}
            dot={false}
          />
          {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
        </LineChart>
      </div>
      <div className="grid grid-cols-2">
        <LineGraph
          data={measurements["40"]?.reverse()}
          dataLabels={channels["40"]}
        />
        <LineGraph
          data={measurements["41"]?.reverse()}
          dataLabels={channels["41"]}
        />
        <LineGraph
          data={measurements["50"]?.reverse()}
          dataLabels={channels["50"]}
        />
        <LineGraph
          data={measurements["51"]?.reverse()}
          dataLabels={channels["51"]}
        />
        <LineGraph
          data={measurements["61"]?.reverse()}
          dataLabels={channels["61"]}
        />
        <LineGraph
          data={measurements["62"]?.reverse()}
          dataLabels={channels["62"]}
        />
        <LineGraph
          data={measurements["63"]?.reverse()}
          dataLabels={channels["63"]}
        />
        <LineGraph
          data={measurements["64"]?.reverse()}
          dataLabels={channels["64"]}
        />
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
function getTempAndHumidity(measurements: any): any[] {
  let data = [];
  measurements["40"]?.forEach((d, i) => {
    data.push({
      date: dayjs(d?.dateTime)?.format("D/MM, H:mma"),
      temp: d?.value,
      hum: measurements["41"][i]?.value,
    });
  });
  console.log(data);
  return data?.reverse();
}

// function timeFormat(tickItem) {
//   console.log(tickItem);
//   return dayjs(tickItem)?.format("HH:mm");
// }
