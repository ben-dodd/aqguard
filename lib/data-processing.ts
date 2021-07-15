import { format, sub, parseISO } from "date-fns";
import { zonedToUtcTime } from "date-fns-tz";
import nz from "date-fns/locale/en-NZ";

interface Log {
  DeviceReportedTime: string;
  FromHost: string;
  ID: number;
  Message: string;
  ReceivedAt: string;
  SysLogTag: string;
}

// interface mValue {
//   date: Date;
//   value: number;
// }

export const channels = {
  23: {
    label: "Aerosol Pump Output",
    units: "%",
    accessor: "aerosolPumpOutput",
  },
  24: {
    label: "Temperature of IADS",
    units: "C°",
    accessor: "temperatureOfIADS",
  },
  26: {
    label: "Temperature of LED",
    units: "C°",
    accessor: "temperatureOfLED",
  },
  27: { label: "Volume Flow", units: "L/min", accessor: "volumeFlow" },
  // 35: {label: "Air Quality Index", units: "%", labelaccessor: "airQualityIndex"},
  // 36: {label: "Infection Risk Index", units: "%", accessor: "infectionRiskIndex"},
  40: { label: "Air Temperature", units: "C°", accessor: "temperature" },
  41: { label: "Relative Humidity", units: "%", accessor: "relativeHumidity" },
  47: { label: "Air Pressure", units: "hPa", accessor: "airPressure" },
  50: { label: "CO₂ Concentration", units: "ppm", accessor: "co2" },
  51: { label: "Mass Concentration of VOC", units: "mg/m³", accessor: "voc" },
  60: { label: "Number Concentration of PM", units: "P/cm³", accessor: "cn" },
  61: { label: "Mass Concentration of PM₁", units: "µg/m³", accessor: "pm1" },
  62: {
    label: "Mass Concentration of PM₂.₅",
    units: "µg/m³",
    accessor: "pm25",
  },
  63: { label: "Mass Concentration of PM₄", units: "µg/m³", accessor: "pm4" },
  64: { label: "Mass Concentration of PM₁₀", units: "µg/m³", accessor: "pm10" },
  65: {
    label: "Mass Concentration of PMₜₒₜₐₗ",
    units: "µg/m³",
    accessor: "pmTot",
  },
};

export const pmChannelsLowerLimit = {
  110: 0.1778,
  111: 0.1911,
  112: 0.2054,
  113: 0.2207,
  114: 0.2371,
  115: 0.2548,
  116: 0.2738,
  117: 0.2943,
  118: 0.3162,
  119: 0.3398,
  120: 0.3652,
  121: 0.3924,
  122: 0.4217,
  123: 0.4532,
  124: 0.487,
  125: 0.5233,
  126: 0.5623,
  127: 0.6043,
  128: 0.6494,
  129: 0.6978,
  130: 0.7499,
  131: 0.8058,
  132: 0.866,
  133: 0.9306,
  134: 1.0,
  135: 1.0746,
  136: 1.1548,
  137: 1.2409,
  138: 1.3335,
  139: 1.433,
  140: 1.5399,
  141: 1.6548,
  142: 1.7783,
  143: 1.911,
  144: 2.0535,
  145: 2.2067,
  146: 2.3714,
  147: 2.5483,
  148: 2.7384,
  149: 2.9427,
  150: 3.1623,
  151: 3.3982,
  152: 3.6517,
  153: 3.9242,
  154: 4.217,
  155: 4.5316,
  156: 4.8697,
  157: 5.233,
  158: 5.6234,
  159: 6.043,
  160: 6.4938,
  161: 6.9783,
  162: 7.4989,
  163: 8.0584,
  164: 8.6596,
  165: 9.3057,
  166: 10.0,
  167: 10.7461,
  168: 11.5478,
  169: 12.4094,
  170: 13.3352,
  171: 14.3301,
  172: 15.3993,
  173: 16.5482,
};

export const pmChannelsUpperLimit = {
  110: 0.1911,
  111: 0.2054,
  112: 0.2207,
  113: 0.2371,
  114: 0.2548,
  115: 0.2738,
  116: 0.2943,
  117: 0.3162,
  118: 0.3398,
  119: 0.3652,
  120: 0.3924,
  121: 0.4217,
  122: 0.4532,
  123: 0.487,
  124: 0.5233,
  125: 0.5623,
  126: 0.6043,
  127: 0.6494,
  128: 0.6978,
  129: 0.7499,
  130: 0.8058,
  131: 0.866,
  132: 0.9306,
  133: 1.0,
  134: 1.0746,
  135: 1.1548,
  136: 1.2409,
  137: 1.3335,
  138: 1.433,
  139: 1.5399,
  140: 1.6548,
  141: 1.7783,
  142: 1.911,
  143: 2.0535,
  144: 2.2067,
  145: 2.3714,
  146: 2.5483,
  147: 2.7384,
  148: 2.9427,
  149: 3.1623,
  150: 3.3982,
  151: 3.6517,
  152: 3.9242,
  153: 4.217,
  154: 4.5316,
  155: 4.8697,
  156: 5.233,
  157: 5.6234,
  158: 6.043,
  159: 6.4938,
  160: 6.9783,
  161: 7.4989,
  162: 8.0584,
  163: 8.6596,
  164: 9.3057,
  165: 10.0,
  166: 10.7461,
  167: 11.5478,
  168: 12.4094,
  169: 13.3352,
  170: 14.3301,
  171: 15.3993,
  172: 16.5482,
  173: 17.7828,
};

export function mapLogs(logs: Log[]) {
  let measurements = {};
  logs.forEach((log) => {
    let dateTime = new Date(log.DeviceReportedTime);
    dateTime = sub(dateTime, { minutes: dateTime.getTimezoneOffset() });
    // const dateTime = zonedToUtcTime(log.DeviceReportedTime, "Pacific/Auckland");
    // Remove whitespace at front and the three CHECKSUM characters at the end. Then split measurements into array.
    let readingArray = log.Message.trim().slice(0, -3).split(";");
    // Convert to key value pairs.
    readingArray.forEach((reading) => {
      const k = reading.slice(0, reading.indexOf("=")); // get key
      const v = +reading.slice(reading.indexOf("=") + 1); // get value and convert to number
      // Check if key is a used channel
      if (channels[k] || +k >= 110)
        if (measurements[k])
          // Check if key is initialised in map
          measurements[k] = [...measurements[k], { dateTime, value: v }];
        else measurements[k] = [{ dateTime, value: v }];
    });
  });
  return measurements;
}

export function getCurrent(data: any, key?: string) {
  if (data)
    if (key)
      return { values: data[key][0].value, lastUpdated: data[key][0].dateTime };
    else {
      let values = {};
      let lastUpdated = null;
      Object.keys(data).forEach((k) => {
        values[k] = data[k][0].value;
        if (data[k][0].dateTime > lastUpdated)
          lastUpdated = data[k][0].dateTime;
      });
      return { values, lastUpdated };
    }
  else return { values: null, lastUpdated: null };
}

export function getAverages(data: any, time: number, period = "minutes") {
  if (data && time) {
    const compareDate = sub(new Date(), { [period]: time });
    let averageData = {};
    Object.entries(data).forEach(([k, v]) => {
      let timeData = v.filter((val) => val.dateTime > compareDate);
      averageData[k] =
        timeData.reduce((acc, val) => acc + val.value, 0) / timeData.length;
    });
    return averageData;
  } else return null;
}

export function getLineGraphData(data: any, keys: any) {
  const colors = [
    "hsl(176, 70%, 50%)",
    "hsl(321, 70%, 50%)",
    "hsl(222, 70%, 50%)",
    "hsl(215, 70%, 50%)",
    "hsl(198, 70%, 50%)",
  ];
  console.log(data);
  console.log(keys);
  if (data && keys) {
    // const mappedLogs = mapLogs(data);
    let counter = 0;
    let result = [];
    let lastUpdated = null;
    keys.forEach((key) => {
      const keyData = data[key];
      // console.log(keyData);
      console.log(keyData[0]?.dateTime);
      if (keyData[0]?.dateTime > lastUpdated)
        lastUpdated = keyData[0]?.dateTime;
      result.push({
        id: key,
        color: colors[counter],
        data: keyData.map((datum) => ({ x: datum?.dateTime, y: datum?.value })),
      });
      counter++;
    });
    console.log(result);
    console.log(lastUpdated);
    return { values: result, lastUpdated };
  } else return { values: null, lastUpdated: null };
}
