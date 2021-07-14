import Link from "next/link";
import Container from "@/components/container";
import ButtonLink from "@/components/button-link";

export default function Nav({ title = "K2 Environmental::AQ Guard" }) {
  return (
    <Container className="py-4">
      <nav>
        <div className="flex justify-between items-center bg-green-400">
          <Link href="/">
            <div className="flex p-2 items-center">
              <Image src={logo} width={40} height={40} alt="K2 Environmental Ltd" />
              <div className="font-bold text-white text-xl pl-2">
                Air Quality Monitor
              </div>
            </div>
          </Link>
          <ButtonLink href="/currentdata">Current Data Values</ButtonLink>
        </div>
      </nav>
    </Container>
  );
}
