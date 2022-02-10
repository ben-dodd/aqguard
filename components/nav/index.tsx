import { useAtom } from "jotai";
import { isAuthorisedAtom, jobAtom } from "@/lib/atoms";

import Link from "next/link";
import ButtonLink from "@/components/button-link";

export default function Nav() {
  const [isAuthorised] = useAtom(isAuthorisedAtom);
  const [job] = useAtom(jobAtom);
  return (
    <nav>
      <div className="bg-green-400 p-2 sm:flex sm:justify-between sm:items-center ">
        <Link href="/">
          <div className="flex p-2 items-center">
            <img
              src={"/img/logo.png"}
              width={40}
              height={40}
              alt="K2 Environmental Ltd"
            />
            <div className="font-bold text-white text-xl pl-2">
              Air Quality Monitor
            </div>
          </div>
        </Link>
        {isAuthorised ? (
          job?.reference === "K2" ? (
            <div className="flex w-full justify-between border-t border-gray-200 pt-2 sm:border-none">
              <ButtonLink href="/current/table" className="w-1/3">
                Table
              </ButtonLink>
              <ButtonLink href="/historical" className="mx-2 w-1/3">
                Historical
              </ButtonLink>
              <ButtonLink href="/reference" className="w-1/3">
                Admin
              </ButtonLink>
            </div>
          ) : (
            <div className="flex w-full justify-between border-t border-gray-200 pt-2 sm:border-none">
              <ButtonLink href="/current/dashboard" className="w-1/3">
                Dashboard
              </ButtonLink>
              <ButtonLink href="/current/table" className="mx-2 w-1/3">
                Table View
              </ButtonLink>
              <ButtonLink href="/trends" className="w-1/3">
                Trends
              </ButtonLink>
              {/* <ButtonLink href="/reference" className="w-1/3">
                Reference
              </ButtonLink> */}
            </div>
          )
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
