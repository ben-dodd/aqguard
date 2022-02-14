import Skeleton from "react-loading-skeleton";
import Container from "@/components/container";

import { useAllLogs } from "@/lib/swr-hooks";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dayjs from "dayjs";
import { dateTimeFormat } from "@/lib/data-processing";

export default function Trends() {
  const { logs, isLoading } = useAllLogs();
  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      <div className="py-4">
        <div className="text-center w-full font-bold text-xl pb-4">
          <span style={{ color: "#a02222" }}>Temperature</span> and{" "}
          <span style={{ color: "#1d92a8" }}>Humidity</span>
        </div>
        <ResponsiveContainer width="95%" aspect={3}>
          <LineChart data={logs}>
            <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
              <Label value="Time (10min intervals)" position="insideBottom" />
            </XAxis>
            <YAxis yAxisId="temperature">
              <Label
                value={`Temperature`}
                angle={-90}
                position={"insideLeft"}
                offset={10}
              />
            </YAxis>
            <YAxis yAxisId="relativeHumidity" orientation="right">
              <Label
                value={`Humidity`}
                angle={-90}
                position={"insideRight"}
                offset={10}
              />
            </YAxis>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              stroke="#a02222"
              strokeWidth={1}
              dot={false}
            />
            <Line
              yAxisId="relativeHumidity"
              type="monotone"
              dataKey="relativeHumidity"
              stroke="#1d92a8"
              strokeWidth={1}
              dot={false}
            />
            {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="py-4">
        <div className="text-center w-full font-bold text-xl pb-4">
          <span style={{ color: "#a0d000" }}>
            CO<sub>2</sub>
          </span>{" "}
          and <span style={{ color: "#e90050" }}>VOCs</span>
        </div>
        <ResponsiveContainer width="95%" aspect={3}>
          <LineChart data={logs}>
            <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
              <Label value="Time (10min intervals)" position="insideBottom" />
            </XAxis>
            <YAxis yAxisId="co2">
              <Label
                value={`CO2 (ppm)`}
                angle={-90}
                position={"insideLeft"}
                offset={10}
              />
            </YAxis>
            <YAxis yAxisId="voc" orientation="right">
              <Label
                value={`VOC (ppm)`}
                angle={-90}
                position={"insideRight"}
                offset={10}
              />
            </YAxis>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Line
              yAxisId="co2"
              type="monotone"
              dataKey="co2"
              stroke="#a0d000"
              strokeWidth={1}
              dot={false}
            />
            <Line
              yAxisId="voc"
              type="monotone"
              dataKey="voc"
              stroke="#e90050"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="py-4">
        <div className="text-center w-full font-bold text-xl pb-4">
          Particulate Matter
        </div>
        <ResponsiveContainer width="90%" aspect={3}>
          <LineChart data={logs}>
            <XAxis dataKey="isoDate" height={50} tickFormatter={formatXDate}>
              <Label value="Time (10min intervals)" position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value={`PM (µg/m³)`}
                angle={-90}
                position={"insideLeft"}
                offset={10}
              />
            </YAxis>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Legend verticalAlign="top" height={36} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="pm1"
              stroke="#a00000"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pm25"
              stroke="#f0c000"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pm4"
              stroke="#00a0f0"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pm10"
              stroke="#00a000"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}

function formatXDate(tickItem) {
  return dayjs(tickItem, dateTimeFormat).format("D/MM, h:mma");
}
