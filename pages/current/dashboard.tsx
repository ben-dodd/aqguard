import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import nz from "date-fns/locale/en-NZ";

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
  vocMassToPPB,
  ppbToMgm3,
  getMolecularVolume,
} from "@/lib/calculations";
import Gauge from "@/components/gauge";

export default function CurrentData() {
  const { logs, isLoading } = useLatestLogs();
  const [currentValues, setCurrentValues] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    if (logs) {
      let { values, lastUpdated } = getCurrent(logs);
      let vocPPB = vocMassToPPB(values["51"], values["40"], values["47"]);
      setCurrentValues({ ...values, 52: vocPPB });
      console.log(values);
      // Add extra values
      // let wetBulbTemperature = getWetBulbTemperature(
      //   values["41"],
      //   values["40"]
      // );
      // let saturatedVaporPressure = getSaturatedVaporPressure(
      //   values?.temperature
      // );
      // let dewpoint = getDewPoint(
      //   values["41"],
      //   values["40"],
      //   saturatedVaporPressure,
      //   false
      // );
      // let dewpointAlt = getDewPoint(
      //   values["41"],
      //   values["40"],
      //   saturatedVaporPressure,
      //   true
      // );
      // let vocPPB = vocMassToPPB(values["51"], values["40"], values["47"]);
      // let molecularVolume = getMolecularVolume(values["40"], values["47"]);
      // let tvocAsFormaldehyde = ppbToMgm3(vocPPB, 30.031, molecularVolume);
      // let tvocAsAcetone = ppbToMgm3(vocPPB, 58.08, molecularVolume);
      // let tvocAsBenzene = ppbToMgm3(vocPPB, 78.11, molecularVolume);
      // let tvocAsButanal = ppbToMgm3(vocPPB, 72.11, molecularVolume);
      // let tvocAsToluene = ppbToMgm3(vocPPB, 92.14, molecularVolume);
      // let tvocAsMEK = ppbToMgm3(vocPPB, 72.11, molecularVolume);
      // let heatIndex = getHeatIndex(values["41"], values["40"]);
      // let actualVaporPressure = getActualVaporPressure(dewpoint);
      // let allValues = convertToMap({
      //   ...values,
      //   52: vocPPB,
      //   53: tvocAsFormaldehyde,
      //   54: tvocAsAcetone,
      //   55: tvocAsBenzene,
      //   56: tvocAsButanal,
      //   57: tvocAsToluene,
      //   58: tvocAsMEK,
      //   // 66: dewpoint,
      //   67: dewpointAlt,
      //   68: heatIndex,
      //   69: wetBulbTemperature,
      //   70: saturatedVaporPressure,
      //   71: actualVaporPressure,
      // });
      // setCurrentValues(allValues);
      setLastUpdated(lastUpdated);
    }
  }, [logs]);

  // TODO add option to get averages
  console.log(currentValues);

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
        Last updated:{" "}
        {lastUpdated ? format(lastUpdated, "Ppp", { locale: nz }) : "N/A"}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Gauge
          value={(currentValues && currentValues["40"]) || 0}
          min={-20}
          max={50}
          label="Temperature"
          units="C°"
        />
        <Gauge
          value={(currentValues && currentValues["41"]) || 0}
          min={0}
          max={100}
          label="Humidity"
          units="%"
        />
        <Gauge
          value={(currentValues && currentValues["50"]) || 0}
          min={0}
          max={1000}
          label="CO₂"
          units="ppm"
        />
        <Gauge
          value={(currentValues && currentValues["60"]) || 0}
          min={0}
          max={2000}
          label="VOC"
          units="ppb"
        />
        <Gauge
          value={(currentValues && currentValues["61"]) || 0}
          min={0}
          max={100}
          label="PM Count"
          units="P/cm³"
        />
        <Gauge
          value={(currentValues && currentValues["61"]) || 0}
          min={0}
          max={100}
          label="PM₁"
          units="µg/m³"
        />
        <Gauge
          value={(currentValues && currentValues["62"]) || 0}
          min={0}
          max={100}
          label="PM₂.₅"
          units="µg/m³"
        />
        <Gauge
          value={(currentValues && currentValues["63"]) || 0}
          min={0}
          max={100}
          label="PM₄"
          units="µg/m³"
        />
        <Gauge
          value={(currentValues && currentValues["64"]) || 0}
          min={0}
          max={100}
          label="PM₁₀"
          units="µg/m³"
        />
      </div>
    </Container>
  );
}
