import Link from "next/link";
import ButtonLink from "@/components/button-link";
import logo from "../../ref/logo.png";

export default function Nav() {
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
        <div className="flex w-full justify-between border-t border-gray-200 pt-2 sm:border-none">
          <ButtonLink href="/currentdata" className="w-1/3">
            Current
          </ButtonLink>
          <ButtonLink href="/historical" className="mx-2 w-1/3">
            Historical
          </ButtonLink>
          <ButtonLink href="/reference" className="w-1/3">
            Reference
          </ButtonLink>
        </div>
      </div>
    </nav>
  );
}
