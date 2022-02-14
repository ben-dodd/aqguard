import { isDeviceConnected } from "@/lib/data-processing";

export default function Status({ lastUpdated }) {
  return (
    <div className="flex flex-col items-center w-full sm:flex-row">
      {isDeviceConnected(lastUpdated) ? (
        <div className="text-center p-4 m-2 border-2 rounded border-green-200">
          <div>DEVICE IS CONNECTED</div>
          <div className="text-sm">Last updated: {lastUpdated || "N/A"}</div>
        </div>
      ) : (
        <div className="text-center p-4 m-2 border-2 rounded border-red-200">
          <div>DEVICE IS NOT CONNECTED / SHOWING LAST READINGS</div>
          <div className="text-sm">Last updated: {lastUpdated || "N/A"}</div>
        </div>
      )}
    </div>
  );
}
