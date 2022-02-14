import "../styles/index.css";
import Nav from "@/components/nav";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAllLogs } from "@/lib/swr-hooks";
import { getLastUpdated } from "@/lib/data-processing";

function App({ Component, pageProps }) {
  dayjs.extend(customParseFormat);
  const { logs, isLoading } = useAllLogs();
  const lastUpdated = getLastUpdated(logs);
  return (
    <div className="w-screen h-screen">
      <Nav lastUpdated={lastUpdated} />
      <Component {...pageProps} />
    </div>
  );
}

export default App;
