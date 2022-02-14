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
import { MappedLogObject } from "@/lib/types";

export default function CurrentData() {
  const { logs, isLoading } = useAllLogs();
  const currentValues = convertToMap(logs ? logs[logs?.length - 1] : {});
  const lastUpdated = getLastUpdated(logs);

  // TODO add option to get averages

  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {[
          { header: "General Air Quality Indicators", accessor: "general" },
          { header: "Volatile Organic Compounds", accessor: "voc" },
          { header: "Particulate Matter", accessor: "pm" },
          { header: "Equipment Status", accessor: "equipment" },
          { header: "PM Size Bands", accessor: "pmBand" },
        ].map((group) => (
          <div className="px-4">
            <div className="mb-2 font-bold pt-8 text-center">
              {group?.header}
            </div>
            <div className="w-full px-4 bg-blue-100">
              {currentValues?.[group?.accessor]?.map((row: any) => (
                <div className="border-b border-white py-2 flex text-xs">
                  <div className="w-3/5">{row?.label}</div>
                  <div className="w-2/5">
                    {isNaN(row?.value)
                      ? "N/A"
                      : `${row?.value?.toFixed(row?.toFixed || 2)} ${
                          row?.unit
                        }`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
