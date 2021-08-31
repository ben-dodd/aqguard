import { sub, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

interface Log {
  DeviceReportedTime: string;
  FromHost: string;
  ID: number;
  Message: string;
  ReceivedAt: string;
  SysLogTag: string;
}

export const channels = {
  23: {
    label: "Aerosol Pump Output",
    units: "%",
    accessor: "aerosolPumpOutput",
    group: "equipment",
  },
  24: {
    label: "Temperature of IADS",
    units: "C°",
    accessor: "temperatureOfIADS",
    group: "equipment",
  },
  26: {
    label: "Temperature of LED",
    units: "C°",
    accessor: "temperatureOfLED",
    group: "equipment",
  },
  27: {
    label: "Volume Flow",
    units: "L/min",
    accessor: "volumeFlow",
    group: "equipment",
  },
  // 35: {label: "Air Quality Index", units: "%", labelaccessor: "airQualityIndex"},
  // 36: {label: "Infection Risk Index", units: "%", accessor: "infectionRiskIndex"},
  40: {
    label: "Air Temperature",
    units: "C°",
    accessor: "temperature",
    group: "general",
  },
  41: {
    label: "Relative Humidity",
    units: "%",
    accessor: "relativeHumidity",
    group: "general",
  },
  47: {
    label: "Air Pressure",
    units: "hPa",
    accessor: "airPressure",
    group: "general",
  },
  50: {
    label: "CO₂ Concentration",
    units: "ppm",
    accessor: "co2",
    group: "general",
    toFixed: 0,
  },
  51: {
    label: "Mass Concentration of VOC",
    units: "mg/m³",
    accessor: "voc",
    group: "voc",
  },
  60: {
    label: "Number Concentration of PM",
    units: "P/cm³",
    accessor: "cn",
    group: "pm",
  },
  61: {
    label: "Mass Concentration of PM₁",
    units: "µg/m³",
    accessor: "pm1",
    group: "pm",
  },
  62: {
    label: "Mass Concentration of PM₂.₅",
    units: "µg/m³",
    accessor: "pm25",
    group: "pm",
  },
  63: {
    label: "Mass Concentration of PM₄",
    units: "µg/m³",
    accessor: "pm4",
    group: "pm",
  },
  64: {
    label: "Mass Concentration of PM₁₀",
    units: "µg/m³",
    accessor: "pm10",
    group: "pm",
  },
  65: {
    label: "Mass Concentration of PMₜₒₜₐₗ",
    units: "µg/m³",
    accessor: "pmTot",
    group: "pm",
  },
  // Extrapolated values
  66: {
    label: "Dew Point",
    units: "C°",
    group: "general",
  },
  67: {
    label: "Dew Point (alt)",
    units: "C°",
    group: "general",
  },
  68: {
    label: "Heat Index",
    units: "C°",
    group: "general",
  },
  69: {
    label: "Wet Bulb Temperature",
    units: "C°",
    group: "general",
  },
  70: {
    label: "Saturated Vapour Pressure",
    units: "hPa",
    group: "general",
  },
  71: {
    label: "Actual Vapour Pressure",
    units: "hPa",
    group: "general",
  },
  // PM Bands
  110: {
    label: "PM₀.₁₉",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.1778,
    upperLimit: 0.1911,
  },
  111: {
    label: "PM₀.₂₁",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.1911,
    upperLimit: 0.2054,
  },
  112: {
    label: "PM₀.₂₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.2054,
    upperLimit: 0.2207,
  },
  113: {
    label: "PM₀.₂₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.2207,
    upperLimit: 0.2371,
  },
  114: {
    label: "PM₀.₂₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.2371,
    upperLimit: 0.2548,
  },
  115: {
    label: "PM₀.₂₇",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.2548,
    upperLimit: 0.2738,
  },
  116: {
    label: "PM₀.₂₉",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.2738,
    upperLimit: 0.2943,
  },
  117: {
    label: "PM₀.₃₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.2943,
    upperLimit: 0.3162,
  },
  118: {
    label: "PM₀.₃₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.3162,
    upperLimit: 0.3398,
  },
  119: {
    label: "PM₀.₃₆",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.3398,
    upperLimit: 0.3652,
  },
  120: {
    label: "PM₀.₃₉",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.3652,
    upperLimit: 0.3924,
  },
  121: {
    label: "PM₀.₄₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.3924,
    upperLimit: 0.4217,
  },
  122: {
    label: "PM₀.₄₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.4217,
    upperLimit: 0.4532,
  },
  123: {
    label: "PM₀.₄₉",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.4532,
    upperLimit: 0.487,
  },
  124: {
    label: "PM₀.₅₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.487,
    upperLimit: 0.5233,
  },
  125: {
    label: "PM₀.₅₆",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.5233,
    upperLimit: 0.5623,
  },
  126: {
    label: "PM₀.₆₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.5623,
    upperLimit: 0.6043,
  },
  127: {
    label: "PM₀.₆₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.6043,
    upperLimit: 0.6494,
  },
  128: {
    label: "PM₀.₇₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.6494,
    upperLimit: 0.6978,
  },
  129: {
    label: "PM₀.₇₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.6978,
    upperLimit: 0.7499,
  },
  130: {
    label: "PM₀.₈₁",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.7499,
    upperLimit: 0.8058,
  },
  131: {
    label: "PM₀.₈₇",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.8058,
    upperLimit: 0.866,
  },
  132: {
    label: "PM₀.₉₃",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.866,
    upperLimit: 0.9306,
  },
  133: {
    label: "PM₁.₀₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 0.9306,
    upperLimit: 1,
  },
  134: {
    label: "PM₁.₀₇",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1,
    upperLimit: 1.0746,
  },
  135: {
    label: "PM₁.₁₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.0746,
    upperLimit: 1.1548,
  },
  136: {
    label: "PM₁.₂₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.1548,
    upperLimit: 1.2409,
  },
  137: {
    label: "PM₁.₃₃",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.2409,
    upperLimit: 1.3335,
  },
  138: {
    label: "PM₁.₄₃",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.3335,
    upperLimit: 1.433,
  },
  139: {
    label: "PM₁.₅₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.433,
    upperLimit: 1.5399,
  },
  140: {
    label: "PM₁.₆₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.5399,
    upperLimit: 1.6548,
  },
  141: {
    label: "PM₁.₇₈",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.6548,
    upperLimit: 1.7783,
  },
  142: {
    label: "PM₁.₉₁",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.7783,
    upperLimit: 1.911,
  },
  143: {
    label: "PM₂.₀₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 1.911,
    upperLimit: 2.0535,
  },
  144: {
    label: "PM₂.₂₁",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 2.0535,
    upperLimit: 2.2067,
  },
  145: {
    label: "PM₂.₃₇",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 2.2067,
    upperLimit: 2.3714,
  },
  146: {
    label: "PM₂.₅₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 2.3714,
    upperLimit: 2.5483,
  },
  147: {
    label: "PM₂.₇₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 2.5483,
    upperLimit: 2.7384,
  },
  148: {
    label: "PM₂.₉₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 2.7384,
    upperLimit: 2.9427,
  },
  149: {
    label: "PM₃.₁₆",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 2.9427,
    upperLimit: 3.1623,
  },
  150: {
    label: "PM₃.₄₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 3.1623,
    upperLimit: 3.3982,
  },
  151: {
    label: "PM₃.₆₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 3.3982,
    upperLimit: 3.6517,
  },
  152: {
    label: "PM₃.₉₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 3.6517,
    upperLimit: 3.9242,
  },
  153: {
    label: "PM₄.₂₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 3.9242,
    upperLimit: 4.217,
  },
  154: {
    label: "PM₄.₅₃",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 4.217,
    upperLimit: 4.5316,
  },
  155: {
    label: "PM₄.₈₇",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 4.5316,
    upperLimit: 4.8697,
  },
  156: {
    label: "PM₅.₂₃",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 4.8697,
    upperLimit: 5.233,
  },
  157: {
    label: "PM₅.₆₂",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 5.233,
    upperLimit: 5.6234,
  },
  158: {
    label: "PM₆.₀₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 5.6234,
    upperLimit: 6.043,
  },
  159: {
    label: "PM₆.₄₉",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 6.043,
    upperLimit: 6.4938,
  },
  160: {
    label: "PM₆.₉₈",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 6.4938,
    upperLimit: 6.9783,
  },
  161: {
    label: "PM₇.₅₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 6.9783,
    upperLimit: 7.4989,
  },
  162: {
    label: "PM₈.₀₆",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 7.4989,
    upperLimit: 8.0584,
  },
  163: {
    label: "PM₈.₆₆",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 8.0584,
    upperLimit: 8.6596,
  },
  164: {
    label: "PM₉.₃₁",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 8.6596,
    upperLimit: 9.3057,
  },
  165: {
    label: "PM₁₀.₀₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 9.3057,
    upperLimit: 10,
  },
  166: {
    label: "PM₁₀.₇₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 10,
    upperLimit: 10.7461,
  },
  167: {
    label: "PM₁₁.₅₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 10.7461,
    upperLimit: 11.5478,
  },
  168: {
    label: "PM₁₂.₄₁",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 11.5478,
    upperLimit: 12.4094,
  },
  169: {
    label: "PM₁₃.₃₄",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 12.4094,
    upperLimit: 13.3352,
  },
  170: {
    label: "PM₁₄.₃₃",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 13.3352,
    upperLimit: 14.3301,
  },
  171: {
    label: "PM₁₅.₄₀",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 14.3301,
    upperLimit: 15.3993,
  },
  172: {
    label: "PM₁₆.₅₅",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 15.3993,
    upperLimit: 16.5482,
  },
  173: {
    label: "PM₁₇.₇₈",
    units: "P/cm³",
    group: "pmBand",
    lowerLimit: 16.5482,
    upperLimit: 17.7828,
  },
};

export function convertToMap(data: any) {
  let dataMap = { general: [], voc: [], pm: [], equipment: [], pmBand: [] };
  Object.entries(data).forEach(([key, v]) => {
    let vars = channels[key];
    dataMap[vars.group].push({
      label: vars.label,
      unit: vars.units,
      value: v,
    });
  });
  console.log(dataMap);
  return dataMap;
}

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
      if (channels[k] || +k >= 110) {
        if (measurements[k])
          // Check if key is initialised in map
          measurements[k] = [...measurements[k], { dateTime, value: v }];
        else measurements[k] = [{ dateTime, value: v }];
      }
    });
  });
  return measurements;
}

export function getCurrent(data: any, key?: string) {
  if (data)
    if (key)
      return {
        values: data[key][0].value,
        lastUpdated: utcToZonedTime(data[key][0].dateTime, "Pacific/Auckland"),
      };
    else {
      let values = {};
      let lastUpdated = null;
      Object.keys(data).forEach((k) => {
        values[k] = data[k][0].value;
        if (data[k][0].dateTime > lastUpdated)
          lastUpdated = data[k][0].dateTime;
      });
      return {
        values,
        lastUpdated: utcToZonedTime(lastUpdated, "Pacific/Auckland"),
      };
    }
  else return { values: null, lastUpdated: null };
}

export function getDailyBreakdown(logs: Log[]) {
  let days = {};
  logs?.forEach((log) => {
    // Map each log to day
    let day: string = format(new Date(log.DeviceReportedTime), "yyyy-MM-dd");
    days[day] = (days[day] || 0) + 1;
  });
  console.log(days);
  return days;
}

export function getAverages(data: any, time: number, period = "minutes") {
  if (data && time) {
    const compareDate = sub(new Date(), { [period]: time });
    let averageData = {};
    Object.entries(data).forEach(([k, v]: [string, any[]]) => {
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
    keys.forEach((key: string) => {
      const keyData = data[key];
      // console.log(keyData);
      console.log(keyData[0]?.dateTime);
      if (keyData[0]?.dateTime > lastUpdated)
        lastUpdated = keyData[0]?.dateTime;
      result.push({
        id: key,
        color: colors[counter],
        data: keyData.map((datum: any) => ({
          x: datum?.dateTime,
          y: datum?.value,
        })),
      });
      counter++;
    });
    console.log(result);
    console.log(lastUpdated);
    return { values: result, lastUpdated };
  } else return { values: null, lastUpdated: null };
}

export function isDeviceConnected(lastUpdated: Date) {
  console.log(lastUpdated);
  console.log(sub(new Date(), { minutes: 1 }));
  return lastUpdated > sub(new Date(), { minutes: 1 });
}
