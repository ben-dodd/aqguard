import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { format, sub } from "date-fns";
import nz from "date-fns/locale/en-NZ";

import Container from "@/components/container";
import Gauge from "@/components/gauge";

import { useLatestLogs } from "@/lib/swr-hooks";
import { getCurrent, isDeviceConnected } from "@/lib/data-processing";

export default function IndexPage() {
  const { logs, isLoading } = useLatestLogs();
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    let { values, lastUpdated } = getCurrent(logs);
    setLastUpdated(lastUpdated);
  }, [logs]);
  if (isLoading) {
    return (
      <Container>
        <Skeleton width={180} height={24} />
      </Container>
    );
  }

  console.log(lastUpdated);
  console.log(sub(new Date(), { minutes: 1 }));
  console.log(lastUpdated < sub(new Date(), { minutes: 1 }));
  return (
    <Container>
      <div className="flex flex-col items-center">
        <img src="/img/AQGuard.png" className="p-8" />
        {isDeviceConnected(lastUpdated) ? (
          <div>DEVICE IS CONNECTED</div>
        ) : (
          <div>DEVICE IS NOT CONNECTED</div>
        )}

        <div className="text-sm font-bold">
          Last updated:{" "}
          {lastUpdated ? format(lastUpdated, "Ppp", { locale: nz }) : "N/A"}
        </div>
      </div>
      {/*<div className="flex mt-8">
        <Gauge
          value={currentValues?.temperature || 0}
          min={-15}
          max={60}
          label="Temperature"
          units="C°"
        />
        <Gauge
          value={currentValues?.relativeHumidity || 0}
          min={0}
          max={100}
          label="Humidity"
          units="%"
        />
        <Gauge
          value={currentValues?.aerosolPumpOutput || 0}
          min={0}
          max={100}
          label="Aerosol Pump Output"
          units="%"
        />
      </div>*/}
    </Container>
  );
}
