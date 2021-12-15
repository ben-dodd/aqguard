import { isDeviceConnected } from "@/lib/data-processing";

import { format } from "date-fns";
import nz from "date-fns/locale/en-NZ";

export default function Status({ lastUpdated }) {
  return (
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
  );
}
