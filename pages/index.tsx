import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import nz from "date-fns/locale/en-NZ";

import Nav from "@/components/nav";
import Container from "@/components/container";

import { useRecentLogs } from "@/lib/swr-hooks";
import { getCurrent } from "@/lib/data-processing";

export default function IndexPage() {
  const { logs, isLoading } = useRecentLogs();
  const [currentValues, setCurrentValues] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    let { values, lastUpdated } = getCurrent(logs);
    setCurrentValues(values);
    setLastUpdated(lastUpdated);
  }, [logs]);
  if (isLoading) {
    return (
      <div>
        <Nav />
        <Container>
          <Skeleton width={180} height={24} />
        </Container>
      </div>
    );
  }
  console.log(lastUpdated);
  return (
    <Container>
      <div className="text-sm font-bold">
        Last updated:{" "}
        {lastUpdated ? format(lastUpdated, "Ppp", { locale: nz }) : "N/A"}
      </div>
      <div className="m-8 text-xl flex justify-evenly">
        <div className="mr-4 font-bold text-blue-400 text-right">
          <div>Aerosol Pump Output</div>
          <div>Temperature of IADS</div>
          <div>Temperature of LED</div>
          <div>Volume Flow</div>
          <div>Air Temperature</div>
          <div>Relative Humidity</div>
          <div>Air Pressure</div>
          <div>
            CO<sub>2</sub> Concentration
          </div>
          <div>Mass Concentration of VOC</div>
          <div>Number Concentration</div>
          <div>
            PM<sub>1</sub>
          </div>
          <div>
            PM<sub>2.5</sub>
          </div>
          <div>
            PM<sub>4</sub>
          </div>
          <div>
            PM<sub>10</sub>
          </div>
          <div>
            PM<sub>total</sub>
          </div>
        </div>
        <div className="font-light text-gray-600">
          <div>{currentValues?.aerosolPumpOutput.toFixed(2)}%</div>
          <div>{currentValues?.temperatureOfIADS.toFixed(2)}C°</div>
          <div>{currentValues?.temperatureOfLED.toFixed(2)}C°</div>
          <div>{currentValues?.volumeFlow.toFixed(2)}L/min</div>
          <div>{currentValues?.temperature.toFixed(2)}C°</div>
          <div>{currentValues?.relativeHumidity.toFixed(2)}%</div>
          <div>{currentValues?.airPressure.toFixed(2)}hPa</div>
          <div>{currentValues?.co2.toFixed(2)}ppm</div>
          <div>
            {currentValues?.voc.toFixed(2)}mg/m<sup>3</sup>
          </div>
          <div>
            {currentValues?.cn.toFixed(2)}p/cm<sup>3</sup>
          </div>
          <div>
            {currentValues?.pm1.toFixed(2)}μg/m<sup>3</sup>
          </div>
          <div>
            {currentValues?.pm25.toFixed(2)}μg/m<sup>3</sup>
          </div>
          <div>
            {currentValues?.pm4.toFixed(2)}μg/m<sup>3</sup>
          </div>
          <div>
            {currentValues?.pm10.toFixed(2)}μg/m<sup>3</sup>
          </div>
          <div>
            {currentValues?.pmTot.toFixed(2)}μg/m<sup>3</sup>
          </div>
        </div>
        <div className="mx-4 font-bold text-red-400 text-right">
          {Object.keys([...Array(21).keys()]).map((k) => (
            <div>{`Particle Size ${+k + 1}`}</div>
          ))}
        </div>
        <div className="font-light text-gray-600">
          {currentValues
            ? Object.keys([...Array(21).keys()]).map((k) => (
                <div>{currentValues[`x${+k + 110}`].toFixed(2)}</div>
              ))
            : ""}
        </div>
        <div className="mx-4 font-bold text-red-400 text-right">
          {Object.keys([...Array(21).keys()]).map((k) => (
            <div>{`Particle Size ${+k + 22}`}</div>
          ))}
        </div>
        <div className="font-light text-gray-600">
          {currentValues
            ? Object.keys([...Array(21).keys()]).map((k) => (
                <div>{currentValues[`x${+k + 131}`].toFixed(2)}</div>
              ))
            : ""}
        </div>
        <div className="mx-4 font-bold text-red-400 text-right">
          {Object.keys([...Array(21).keys()]).map((k) => (
            <div>{`Particle Size ${+k + 43}`}</div>
          ))}
        </div>
        <div className="font-light text-gray-600">
          {currentValues
            ? Object.keys([...Array(21).keys()]).map((k) => (
                <div>{currentValues[`x${+k + 152}`].toFixed(2)}</div>
              ))
            : ""}
        </div>
      </div>
    </Container>
  );
}
