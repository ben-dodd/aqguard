import { useEffect, useState, useMemo } from "react";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
// import nz from "date-fns/locale/en-NZ";

import Nav from "@/components/nav";
import Container from "@/components/container";
import { ResponsiveLine } from "@nivo/line";

import { useAllLogs } from "@/lib/swr-hooks";
import { getCurrent, getLineGraphData } from "@/lib/data-processing";

export default function IndexPage() {
  const { logs, isLoading } = useAllLogs();
  const [lineGraphData, setLineGraphData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    let { values, lastUpdated } = getLineGraphData(logs, [
      "aerosolPumpOutput",
      "temperatureOfIADS",
      "temperatureOfLED",
      "volumeFlow",
    ]);
    setLineGraphData(values);
    setLastUpdated(lastUpdated);
  }, [logs]);
  if (isLoading) {
    return (
      <div>
        <Container>
          <Skeleton width={180} height={24} />
        </Container>
      </div>
    );
  }
  return (
    <div>
      <Container>
        <div className="text-sm font-bold">
          Last updated: {lastUpdated ? format(lastUpdated, "Ppp") : "N/A"}
        </div>
        <div className="m-8 text-xl flex justify-evenly">
          {/*<ResponsiveLine
            data={lineGraphData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "transportation",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "count",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />*/}
        </div>
      </Container>
    </div>
  );
}
