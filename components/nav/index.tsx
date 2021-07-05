import Link from "next/link";
import Container from "@/components/container";
import ButtonLink from "@/components/button-link";
import Image from "next/image";
import logo from "../../ref/logo.png";

export default function Nav({ title = "Entries" }) {
  return (
    <nav>
      <div className="flex justify-between items-center bg-green-400">
        <div className="flex p-2 items-center">
          <Image src={logo} width={40} height={40} alt="K2 Environmental Ltd" />
          <div className="font-bold text-white text-xl pl-2">
            Air Quality Monitor
          </div>
        </div>
      </div>
    </nav>
  );
}
