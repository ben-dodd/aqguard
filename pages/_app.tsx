import "../styles/index.css";
import Nav from "@/components/nav";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAllLogs } from "@/lib/swr-hooks";

function App({ Component, pageProps }) {
  dayjs.extend(customParseFormat);
  return (
    <div className="w-screen h-screen">
      <Nav />
      <Component {...pageProps} />
    </div>
  );
}

export default App;
