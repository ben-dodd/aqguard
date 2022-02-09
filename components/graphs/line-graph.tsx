import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";

export default function LineGraph({ data, dataLabels }) {
  return (
    <div className="p-8 m-4">
      <LineChart width={500} height={300} data={data}>
        <XAxis>
          <Label
            value="Time (10min intervals)"
            position="insideBottom"
            offset={-10}
          />
        </XAxis>
        <YAxis>
          <Label
            value={`${dataLabels?.label} (${dataLabels?.units})`}
            angle={-90}
            position={"insideBottomLeft"}
            offset={10}
          />
        </YAxis>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
      </LineChart>
    </div>
  );
}
