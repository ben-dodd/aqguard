import { useAtom } from "jotai";
import { isAuthorisedAtom, jobAtom } from "@/lib/atoms";

import Link from "next/link";
import ButtonLink from "@/components/button-link";
import { isDeviceConnected } from "@/lib/data-processing";

export default function Nav({ lastUpdated }) {
  const [isAuthorised] = useAtom(isAuthorisedAtom);
  const [job] = useAtom(jobAtom);
  return (
    <nav>
      <div className="bg-green-400 p-2 sm:flex sm:justify-between sm:items-center w-full pr-8">
        <div>
          <Link href="/">
            <div className="flex p-2 items-center">
              <div
                className={`max-w-xs ${
                  isDeviceConnected(lastUpdated) ? "" : "opacity-50"
                }`}
              >
                <img
                  src={"/img/AQGuard.png"}
                  width={40}
                  height={40}
                  alt="K2 Environmental Ltd"
                />
              </div>
              <div className="font-bold text-white text-xl pl-2">
                K2 Air Quality Monitor
              </div>
            </div>
          </Link>
          <div className={`text-sm text-white`}>{`DEVICE IS ${
            isDeviceConnected(lastUpdated) ? "" : "NOT "
          }CONNECTED // LAST UPDATED: ${lastUpdated || "N/A"}`}</div>
        </div>
        <div className="flex border-t border-gray-200 pt-2 sm:border-none">
          <ButtonLink href="/" className="">
            Dashboard
          </ButtonLink>
          <ButtonLink href="/current/table" className="mx-2">
            Current Values
          </ButtonLink>
          {/* <ButtonLink href="/table" className="mr-2">
                Data Table
              </ButtonLink> */}
          <ButtonLink href="/trends" className="">
            Charts
          </ButtonLink>
        </div>
      </div>
    </nav>
  );
}
