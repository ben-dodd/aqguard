import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
// import nz from "date-fns/locale/en-NZ";

import Container from "@/components/container";

import { useLatestLogs } from "@/lib/swr-hooks";
import {
  getCurrent,
  isDeviceConnected,
  convertToMap,
} from "@/lib/data-processing";
import {
  getDewPoint,
  getWetBulbTemperature,
  getHeatIndex,
  getSaturatedVaporPressure,
  getActualVaporPressure,
} from "@/lib/calculations";

export default function CurrentData() {
  const { logs, isLoading } = useLatestLogs();
  const [currentValues, setCurrentValues] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    if (logs) {
      let { values, lastUpdated } = getCurrent(logs);
      // Add extra values
      let wetBulbTemperature = getWetBulbTemperature(
        values["41"],
        values["40"]
      );
      let saturatedVaporPressure = getSaturatedVaporPressure(
        values?.temperature
      );
      let dewpoint = getDewPoint(
        values["41"],
        values["40"],
        saturatedVaporPressure,
        false
      );
      let dewpointAlt = getDewPoint(
        values["41"],
        values["40"],
        saturatedVaporPressure,
        true
      );
      let heatIndex = getHeatIndex(values["41"], values["40"]);
      let actualVaporPressure = getActualVaporPressure(dewpoint);
      let allValues = convertToMap({
        ...values,
        66: dewpoint,
        67: dewpointAlt,
        68: heatIndex,
        69: wetBulbTemperature,
        70: saturatedVaporPressure,
        71: actualVaporPressure,
      });
      setCurrentValues(allValues);
      setLastUpdated(lastUpdated);
    }
  }, [logs]);

  console.log(currentValues);
  // TODO add option to get averages

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
        Last updated: {lastUpdated ? format(lastUpdated, "Ppp") : "N/A"}
      </div>
      {[
        { header: "General Air Quality Indicators", accessor: "general" },
        { header: "Volatile Organic Compounds", accessor: "voc" },
        { header: "Particulate Matter", accessor: "pm" },
        { header: "Equipment Status", accessor: "equipment" },
        { header: "PM Size Bands", accessor: "pmBand" },
      ].map((group) => (
        <>
          <div className="mb-2 font-bold pt-8 text-center">{group?.header}</div>
          <div className="w-full px-4 bg-blue-100">
            {currentValues?.[group?.accessor]?.map((row: any) => (
              <div className="border-b border-white py-2 flex text-xs">
                <div className="w-3/5">{row?.label}</div>
                <div className="w-2/5">
                  {isNaN(row?.value)
                    ? "N/A"
                    : `${row?.value?.toFixed(row?.toFixed || 2)} ${row?.unit}`}
                </div>
              </div>
            ))}
          </div>
        </>
      ))}
    </Container>
  );
}
