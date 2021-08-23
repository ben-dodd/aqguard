import { useEffect, useState } from "react";
import nz from "date-fns/locale/en-NZ";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";

import Container from "@/components/container";
import Table from "@/components/table";

import { useOneHourLogs } from "@/lib/swr-hooks";
import { getCurrent, getAverages, channels } from "@/lib/data-processing";

function IndexPage() {
  const { logs, isLoading } = useOneHourLogs();
  const [lastUpdated, setLastUpdated] = useState(null);
  const [data, setData] = useState(null);

  const columns = [
    { Header: "Parameter", accessor: "parameter", width: "w-3/12" },
    { Header: "Units", accessor: "units", width: "w-1/12" },
    {
      Header: "Current Value",
      accessor: "currentValue",
      Cell: ({ row }) => {
        let isRising =
          +row?.original?.currentValue > +row?.original?.oneMinuteAverage;
        return (
          <span
            className={`font-bold ${
              isRising ? "text-red-500" : "text-blue-500"
            }`}
          >
            {row?.original?.currentValue}
          </span>
        );
      },
      width: "w-2/12",
    },
    {
      Header: "One Minute Average",
      accessor: "oneMinuteAverage",
      width: "w-2/12",
      Cell: ({ row }) => {
        let isRising =
          +row?.original?.oneMinuteAverage > +row?.original?.tenMinuteAverage;
        return (
          <span className={`${isRising ? "text-red-500" : "text-blue-500"}`}>
            {row?.original?.oneMinuteAverage}
          </span>
        );
      },
    },
    {
      Header: "Ten Minute Average",
      accessor: "tenMinuteAverage",
      width: "w-2/12",
      Cell: ({ row }) => {
        let isRising =
          +row?.original?.tenMinuteAverage > +row?.original?.oneHourAverage;
        return (
          <span className={`${isRising ? "text-red-500" : "text-blue-500"}`}>
            {row?.original?.tenMinuteAverage}
          </span>
        );
      },
    },
    { Header: "One Hour Average", accessor: "oneHourAverage", width: "w-2/12" },
  ];

  useEffect(() => {
    let { values, lastUpdated } = getCurrent(logs);
    let oneMinuteAverage = getAverages(logs, 1);
    let tenMinuteAverage = getAverages(logs, 10);
    let oneHourAverage = getAverages(logs, 60);
    setLastUpdated(lastUpdated);
    setData(
      tabulateData(values, oneMinuteAverage, tenMinuteAverage, oneHourAverage)
    );
  }, [logs]);

  if (isLoading) {
    return (
      <Container>
        <Skeleton width={180} height={24} />
      </Container>
    );
  }
  return !lastUpdated ? (
    <Container>Instrument is disconnected...</Container>
  ) : (
    <Container>
      <div className="text-sm font-bold">
        Last updated:{" "}
        {lastUpdated ? format(lastUpdated, "Ppp", { locale: nz }) : "N/A"}
      </div>
      {data ? <Table data={data} columns={columns} /> : <div />}
    </Container>
  );
}

function tabulateData(
  currentValue: any,
  oneMinuteAverage: any,
  tenMinuteAverage: any,
  oneHourAverage: any
) {
  if (currentValue) {
    let tabulatedData = [];
    console.log(currentValue);
    Object.entries(currentValue).forEach(([k, v]) => {
      let parameter,
        units = "";
      if (channels[k]) {
        parameter = channels[k].label;
        units = channels[k].units;
      }
      let row = {
        parameter,
        units,
        currentValue: isNaN(parseFloat(currentValue[k]))
          ? "N/A"
          : currentValue[k].toFixed(4),
        oneMinuteAverage: isNaN(parseFloat(oneMinuteAverage[k]))
          ? "N/A"
          : oneMinuteAverage[k].toFixed(4),
        tenMinuteAverage: isNaN(parseFloat(tenMinuteAverage[k]))
          ? "N/A"
          : tenMinuteAverage[k].toFixed(4),
        oneHourAverage: isNaN(parseFloat(oneHourAverage[k]))
          ? "N/A"
          : oneHourAverage[k].toFixed(4),
      };
      tabulatedData.push(row);
    });
    return tabulatedData;
  } else return null;
}

export default IndexPage;
