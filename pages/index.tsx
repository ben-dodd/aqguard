import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import nz from "date-fns/locale/en-NZ";

import Container from "@/components/container";
import Gauge from "@/components/gauge";

import { useRecentLogs } from "@/lib/swr-hooks";
import { getCurrent } from "@/lib/data-processing";
import {
  getDewPoint,
  getWetBulbTemperature,
  getHeatIndex,
  getSaturatedVaporPressure,
  getActualVaporPressure,
} from "@/lib/calculations";

export default function IndexPage() {
  const { logs, isLoading } = useRecentLogs();
  const [currentValues, setCurrentValues] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const pmChannels = {
    110: "0.1911",
    111: "0.2054",
    112: "0.2207",
    113: "0.2371",
    114: "0.2548",
    115: "0.2738",
    116: "0.2943",
    117: "0.3162",
    118: "0.3398",
    119: "0.3652",
    120: "0.3924",
    121: "0.4217",
    122: "0.4532",
    123: "0.4870",
    124: "0.5233",
    125: "0.5623",
    126: "0.6043",
    127: "0.6494",
    128: "0.6978",
    129: "0.7499",
    130: "0.8058",
    131: "0.8660",
    132: "0.9306",
    133: "1.000",
    134: "1.0746",
    135: "1.1548",
    136: "1.2409",
    137: "1.3335",
    138: "1.4330",
    139: "1.5399",
    140: "1.6548",
    141: "1.7783",
    142: "1.9110",
    143: "2.0535",
    144: "2.2067",
    145: "2.3714",
    146: "2.5483",
    147: "2.7384",
    148: "2.9427",
    149: "3.1623",
    150: "3.3982",
    151: "3.6517",
    152: "3.9242",
    153: "4.2170",
    154: "4.5316",
    155: "4.8697",
    156: "5.2330",
    157: "5.6234",
    158: "6.0430",
    159: "6.4938",
    160: "6.9783",
    161: "7.4989",
    162: "8.0584",
    163: "8.6596",
    164: "9.3057",
    165: "10.0000",
    166: "10.7461",
    167: "11.5478",
    168: "12.4094",
    169: "13.3352",
    170: "14.3301",
    171: "15.3993",
    172: "16.5482",
    173: "17.7828",
  };
  useEffect(() => {
    let { values, lastUpdated } = getCurrent(logs);
    let wetBulbTemperature = getWetBulbTemperature(
      values?.relativeHumidity,
      values?.temperature
    );
    let saturatedVaporPressure = getSaturatedVaporPressure(values?.temperature);
    let dewpoint = getDewPoint(
      values?.relativeHumidity,
      values?.temperature,
      saturatedVaporPressure,
      false
    );
    let dewpointAlt = getDewPoint(
      values?.relativeHumidity,
      values?.temperature,
      saturatedVaporPressure,
      true
    );
    let heatIndex = getHeatIndex(values?.relativeHumidity, values?.temperature);
    let actualVaporPressure = getActualVaporPressure(dewpoint);
    setCurrentValues({
      ...values,
      dewpoint,
      dewpointAlt,
      heatIndex,
      wetBulbTemperature,
      saturatedVaporPressure,
      actualVaporPressure,
    });
    setLastUpdated(lastUpdated);
  }, [logs]);
  if (isLoading) {
    return (
      <Container>
        <Skeleton width={180} height={24} />
      </Container>
    );
  }
  return (
    <Container>
      <div className="text-sm font-bold">
        Last updated:{" "}
        {lastUpdated ? format(lastUpdated, "Ppp", { locale: nz }) : "N/A"}
      </div>
      <div className="grid text-xl md:grid-flow-col">
        <div className="flex">
          <div className="mr-4 font-bold text-blue-400 text-right">
            <div>Aerosol Pump Output</div>
            <div>Temperature of IADS</div>
            <div>Temperature of LED</div>
            <div>Volume Flow</div>
            <div>Air Temperature</div>
            <div>Relative Humidity</div>
            <div>Dew Point</div>
            <div>Dew Point (alt)</div>
            <div>Wet Bulb Temperature</div>
            <div>Heat Index</div>
            <div>Air Pressure</div>
            <div>Saturated Vapor Pressure</div>
            <div>Actual Vapor Pressure</div>
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
              PM<sub>TOT</sub>
            </div>
          </div>
          <div className="font-light text-gray-600">
            <div>{currentValues?.aerosolPumpOutput?.toFixed(2)}%</div>
            <div>{currentValues?.temperatureOfIADS?.toFixed(2)}C°</div>
            <div>{currentValues?.temperatureOfLED?.toFixed(2)}C°</div>
            <div>{currentValues?.volumeFlow?.toFixed(2)}L/min</div>
            <div>{currentValues?.temperature?.toFixed(2)}C°</div>
            <div>{currentValues?.relativeHumidity?.toFixed(2)}%</div>
            <div>{currentValues?.dewpoint?.toFixed(2)}C°</div>
            <div>{currentValues?.dewpointAlt?.toFixed(2)}C°</div>
            <div>{currentValues?.wetBulbTemperature?.toFixed(2)}C°</div>
            <div>{currentValues?.heatIndex?.toFixed(2)}C°</div>
            <div>{currentValues?.airPressure?.toFixed(2)}hPa</div>
            <div>{currentValues?.saturatedVaporPressure?.toFixed(2)}hPa</div>
            <div>{currentValues?.actualVaporPressure?.toFixed(2)}hPa</div>
            <div>{currentValues?.co2?.toFixed(2)}ppm</div>
            <div>
              {currentValues?.voc?.toFixed(2)}mg/m<sup>3</sup>
            </div>
            <div>
              {currentValues?.cn?.toFixed(2)}p/cm<sup>3</sup>
            </div>
            <div>
              {currentValues?.pm1?.toFixed(2)}μg/m<sup>3</sup>
            </div>
            <div>
              {currentValues?.pm25?.toFixed(2)}μg/m<sup>3</sup>
            </div>
            <div>
              {currentValues?.pm4?.toFixed(2)}μg/m<sup>3</sup>
            </div>
            <div>
              {currentValues?.pm10?.toFixed(2)}μg/m<sup>3</sup>
            </div>
            <div>
              {currentValues?.pmTot?.toFixed(2)}μg/m<sup>3</sup>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="mx-4 font-bold text-red-400">
            {Object.keys([...Array(21).keys()]).map((k) => (
              <div>
                PM<sub>{pmChannels[+k + 110]}</sub>
              </div>
            ))}
          </div>
          <div className="font-light text-gray-600">
            {currentValues
              ? Object.keys([...Array(21).keys()]).map((k) => (
                  <div>{currentValues[`x${+k + 110}`]?.toFixed(4)}</div>
                ))
              : ""}
          </div>
        </div>

        <div className="flex">
          <div className="mx-4 font-bold text-red-400">
            {Object.keys([...Array(21).keys()]).map((k) => (
              <div>
                PM<sub>{pmChannels[+k + 131]}</sub>
              </div>
            ))}
          </div>
          <div className="font-light text-gray-600">
            {currentValues
              ? Object.keys([...Array(21).keys()]).map((k) => (
                  <div>{currentValues[`x${+k + 131}`]?.toFixed(4)}</div>
                ))
              : ""}
          </div>
        </div>

        <div className="flex">
          <div className="mx-4 font-bold text-red-400">
            {Object.keys([...Array(21).keys()]).map((k) => (
              <div>
                PM<sub>{pmChannels[+k + 152]}</sub>
              </div>
            ))}
          </div>
          <div className="font-light text-gray-600">
            {currentValues
              ? Object.keys([...Array(21).keys()]).map((k) => (
                  <div>{currentValues[`x${+k + 152}`]?.toFixed(4)}</div>
                ))
              : ""}
          </div>
        </div>
      </div>
      <div className="flex mt-8">
        <Gauge
          value={currentValues?.temperature || 0}
          min={-15}
          max={60}
          label="Temperature"
          units="C°"
        />
        <Gauge
          value={currentValues?.relativeHumidity || 0}
          min={0}
          max={100}
          label="Humidity"
          units="%"
        />
        <Gauge
          value={currentValues?.aerosolPumpOutput || 0}
          min={0}
          max={100}
          label="Aerosol Pump Output"
          units="%"
        />
      </div>
    </Container>
  );
}
