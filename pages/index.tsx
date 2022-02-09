import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { jobAtom } from "@/lib/atoms";
import { getCurrent } from "@/lib/data-processing";

import Container from "@/components/container";
import Status from "@/components/status";
import Gauge from "@/components/gauge";

import { useLatestLogs, useProcesses } from "@/lib/swr-hooks";

export default function IndexPage() {
  const { logs, isLoading } = useLatestLogs();
  // const { processes } = useProcesses(job?.id);

  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    let { values, lastUpdated } = getCurrent(logs);
    setLastUpdated(lastUpdated);
  }, [logs]);

  return (
    <Container>
      <Status lastUpdated={lastUpdated} />
    </Container>
  );
}
