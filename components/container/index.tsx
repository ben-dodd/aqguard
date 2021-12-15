import { useAtom } from "jotai";
import { isAuthorisedAtom } from "@/lib/atoms";
import LoginScreen from "@/components/login-screen";

function Container({ className = "", children }) {
  const [isAuthorised] = useAtom(isAuthorisedAtom);
  return isAuthorised ? (
    <div className={"mx-auto px-2 text-gray-800 " + className}>{children}</div>
  ) : (
    <LoginScreen />
  );
}

export default Container;
