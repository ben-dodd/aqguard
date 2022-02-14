import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import nz from "date-fns/locale/en-NZ";

import Container from "@/components/container";

import { useAllLogs, useLatestLogs } from "@/lib/swr-hooks";
import {
  getCurrent,
  isDeviceConnected,
  convertToMap,
  getLastUpdated,
} from "@/lib/data-processing";
import {
  getDewPoint,
  getWetBulbTemperature,
  getHeatIndex,
  getSaturatedVaporPressure,
  getActualVaporPressure,
  vocMassToPPB,
  ppbToMgm3,
  getMolecularVolume,
} from "@/lib/calculations";
import Gauge from "@/components/gauge";
import { MappedLogObject } from "@/lib/types";

export default function CurrentData() {
  const { logs, isLoading } = useAllLogs();
  const currentValues: MappedLogObject = logs ? logs[logs?.length - 1] : {};
  const lastUpdated = getLastUpdated(logs);

  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      {isDeviceConnected(lastUpdated) ? (
        <div className="text-center p-4 m-2 border-2 rounded border-green-200">
          <div>DEVICE IS CONNECTED</div>
          <small>Showing latest readings</small>
        </div>
      ) : (
        <div className="text-center p-4 m-2 border-2 rounded border-red-200">
          <div>DEVICE IS NOT CONNECTED</div>
          <small>Showing last readings</small>
        </div>
      )}
      <div className="text-xs text-center">
        Last updated: {lastUpdated || "N/A"}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Gauge
          value={currentValues?.temperature || 0}
          min={-20}
          max={50}
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
          value={currentValues?.co2 || 0}
          min={0}
          max={1000}
          label="CO₂"
          units="ppm"
        />
        <Gauge
          value={currentValues?.vocPPB || 0}
          min={0}
          max={2000}
          label="VOC"
          units="ppb"
        />
        <Gauge
          value={currentValues?.cn || 0}
          min={0}
          max={100}
          label="PM Count"
          units="P/cm³"
        />
        <Gauge
          value={currentValues?.pm1 || 0}
          min={0}
          max={100}
          label="PM₁"
          units="µg/m³"
        />
        <Gauge
          value={currentValues?.pm25 || 0}
          min={0}
          max={100}
          label="PM₂.₅"
          units="µg/m³"
        />
        <Gauge
          value={currentValues?.pm4 || 0}
          min={0}
          max={100}
          label="PM₄"
          units="µg/m³"
        />
        <Gauge
          value={currentValues?.pm10 || 0}
          min={0}
          max={100}
          label="PM₁₀"
          units="µg/m³"
        />
      </div>
    </Container>
  );
}
