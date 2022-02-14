import { useEffect, useState } from "react";
import { getCurrent, getLastUpdated } from "@/lib/data-processing";

import Container from "@/components/container";
import Status from "@/components/status";

import { useAllLogs } from "@/lib/swr-hooks";

export default function IndexPage() {
  const { logs, isLoading } = useAllLogs();
  const lastUpdated = getLastUpdated(logs);

  return (
    <Container>
      <Status lastUpdated={lastUpdated} />
    </Container>
  );
}
