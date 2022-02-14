import Skeleton from "react-loading-skeleton";
import Container from "@/components/container";

import { useAllLogs } from "@/lib/swr-hooks";
import dayjs from "dayjs";
import { dateTimeFormat } from "@/lib/data-processing";

export default function Trends() {
  const { logs, isLoading } = useAllLogs();
  return isLoading ? (
    <Container>
      <Skeleton width={180} height={24} />
    </Container>
  ) : (
    <Container>
      <div />
    </Container>
  );
}

function formatXDate(tickItem) {
  return dayjs(tickItem, dateTimeFormat).format("D/MM, h:mma");
}
