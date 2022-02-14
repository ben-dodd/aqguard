import { sub, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { LogObject, MappedLogObject, ProcessObject } from "@/lib/types";
import dayjs from "dayjs";
import "dayjs/locale/en-nz";
import {
  getActualVaporPressure,
  getDewPoint,
  getHeatIndex,
  getMolecularVolume,
  getSaturatedVaporPressure,
  getWetBulbTemperature,
  ppbToMgm3,
  vocMassToPPB,
} from "./calculations";

export const dateTimeFormat = "D MMMM YYYY, h:mma";

export function convertToMap(data: MappedLogObject) {
  let dataMap = { general: [], voc: [], pm: [], equipment: [], pmBand: [] };
  Object.entries(data).forEach(([key, v]) => {
    if (key !== "isoDate") {
      let vars = properties[key];
      console.log(vars);
      console.log(key);
      dataMap[vars?.group].push({
        label: vars?.label,
        unit: vars?.units,
        value: v,
      });
    }
  });
  console.log(dataMap);
  return dataMap;
}

export function mapLogs(logs: LogObject[]) {
  let measurementMap: Object = {};
  if (logs) {
    console.log(logs);
    logs.forEach((log) => {
      let dateTime = dayjs(log.DeviceReportedTime)
        // .add(13, "hour")
        .format(dateTimeFormat);
      // Remove whitespace at front and the three CHECKSUM characters at the end. Then split measurements into array.
      let readingArray = log.Message.trim().slice(0, -3).split(";");
      // Convert to key value pairs.
      readingArray.forEach((reading) => {
        const k = reading.slice(0, reading.indexOf("=")); // get key
        const v = +reading.slice(reading.indexOf("=") + 1); // get value and convert to number
        // Check if key is a used channel
        if (channels[k]) {
          if (measurementMap[dateTime])
            measurementMap[dateTime] = {
              ...measurementMap[dateTime],
              [channels[k]]: v,
            };
          else measurementMap[dateTime] = { [channels[k]]: v };
          // if (measurements[k])
          //   // Check if key is initialised in map
          //   measurements[k] = [...measurements[k], { dateTime, value: v }];
          // else measurements[k] = [{ dateTime, value: v }];
        }
      });
    });
  }
  let measurements = Object.entries(measurementMap)?.map(
    ([isoDate, values]) => {
      if (values) {
        console.log(values);
        // Add extra values
        let wetBulbTemperature = getWetBulbTemperature(
          values?.relativeHumidity,
          values?.temperature
        );
        let saturatedVapourPressure = getSaturatedVaporPressure(
          values?.temperature
        );
        let dewpoint = getDewPoint(
          values?.relativeHumidity,
          values?.temperature,
          saturatedVapourPressure,
          false
        );
        let dewpointAlt = getDewPoint(
          values?.relativeHumidity,
          values?.temperature,
          saturatedVapourPressure,
          true
        );
        let vocPPB = vocMassToPPB(
          values?.voc,
          values?.temperature,
          values?.airPressure
        );
        let molecularVolume = getMolecularVolume(
          values?.temperature,
          values?.airPressure
        );
        let tvocAsFormaldehyde = ppbToMgm3(vocPPB, 30.031, molecularVolume);
        let tvocAsAcetone = ppbToMgm3(vocPPB, 58.08, molecularVolume);
        let tvocAsBenzene = ppbToMgm3(vocPPB, 78.11, molecularVolume);
        let tvocAsButanal = ppbToMgm3(vocPPB, 72.11, molecularVolume);
        let tvocAsToluene = ppbToMgm3(vocPPB, 92.14, molecularVolume);
        let tvocAsMEK = ppbToMgm3(vocPPB, 72.11, molecularVolume);
        let heatIndex = getHeatIndex(
          values?.relativeHumidity,
          values?.temperature
        );
        let actualVapourPressure = getActualVaporPressure(dewpoint);
        return {
          ...values,
          isoDate,
          vocPPB,
          tvocAsFormaldehyde,
          tvocAsAcetone,
          tvocAsBenzene,
          tvocAsButanal,
          tvocAsToluene,
          tvocAsMEK,
          dewpoint,
          dewpointAlt,
          heatIndex,
          wetBulbTemperature,
          saturatedVapourPressure,
          actualVapourPressure,
        };
      } else return {};
    }
  );
  console.log(measurements);
  return measurements;
}

export function getLastUpdated(logs: MappedLogObject[]) {
  return logs ? logs[logs?.length - 1]?.isoDate : null;
}

export function mapProcesses(processes: ProcessObject[]) {
  let mappedProcesses = {};
  processes.forEach((process) => {
    if (!mappedProcesses[process.activity_id]) {
      mappedProcesses[process?.activity_id] = {
        processName: process?.activity_name,
        sds: {},
      };
    }
    if (!mappedProcesses[process?.activity_id]?.sds[process?.sds_id]) {
      mappedProcesses[process?.activity_id].sds[process?.sds_id] = {
        productName: process?.sds_name,
        normalAmount: process?.sds_normal_amount,
        upperAmount: process?.sds_upper_amount,
        substances: {},
      };
    }
    if (
      !mappedProcesses[process?.activity_id]?.sds[process?.sds_id]?.substances[
        process?.substance_id
      ]
    ) {
      mappedProcesses[process?.activity_id].sds[process?.sds_id].substances[
        process?.substance_id
      ] = {
        substanceName: process?.substance_name,
        upperLimit: process?.substance_upper_limit,
        lowerLimit: process?.substance_lower_limit,
        standards: {},
      };
    }
    if (
      !mappedProcesses[process?.activity_id]?.sds[process?.sds_id]?.substances[
        process?.substance_id
      ]?.standards[process?.standard_id]
    ) {
      mappedProcesses[process?.activity_id].sds[process?.sds_id].substances[
        process?.substance_id
      ].standards[process?.standard_id] = {
        limit: process?.standard_limit,
        unit: process?.standard_unit,
        type: process?.standard_type_name,
        organisation: process?.standard_organisation_name,
        year: new Date(process?.standard_year),
      };
    }
  });
  return mappedProcesses;
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

export function getDailyBreakdown(logs: LogObject[]) {
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

export function isDeviceConnected(lastUpdated: string) {
  return dayjs()
    .subtract(15, "minute")
    .isBefore(dayjs(lastUpdated, dateTimeFormat));
}

export const properties = {
  aerosolPumpOutput: {
    label: "Aerosol Pump Output",
    units: "%",
    accessor: "aerosolPumpOutput",
    channel: 23,
    group: "equipment",
  },
  temperatureOfIADS: {
    label: "Temperature of IADS",
    units: "C°",
    accessor: "temperatureOfIADS",
    channel: 24,
    group: "equipment",
  },
  temperatureOfLED: {
    label: "Temperature of LED",
    units: "C°",
    accessor: "temperatureOfLED",
    channel: 26,
    group: "equipment",
  },
  volumeFlow: {
    label: "Volume Flow",
    units: "L/min",
    accessor: "volumeFlow",
    channel: 27,
    group: "equipment",
  },
  // 35: {label: "Air Quality Index", units: "%", labelaccessor: "airQualityIndex"},
  // 36: {label: "Infection Risk Index", units: "%", accessor: "infectionRiskIndex"},
  temperature: {
    label: "Air Temperature",
    units: "C°",
    accessor: "temperature",
    channel: 40,
    group: "general",
  },
  relativeHumidity: {
    label: "Relative Humidity",
    units: "%",
    accessor: "relativeHumidity",
    channel: 41,
    group: "general",
  },
  airPressure: {
    label: "Air Pressure",
    units: "hPa",
    accessor: "airPressure",
    channel: 47,
    group: "general",
  },
  co2: {
    label: "CO₂ Concentration",
    units: "ppm",
    accessor: "co2",
    channel: 50,
    group: "general",
    toFixed: 0,
  },
  voc: {
    label: "Mass Concentration of VOC",
    units: "mg/m³",
    accessor: "voc",
    channel: 51,
    group: "voc",
  },
  vocPPB: {
    label: "Number Concentration of VOC",
    units: "ppb",
    accessor: "vocPPB",
    group: "voc",
  },
  tvocAsFormaldehyde: {
    label: "TVOC as Formaldehyde",
    units: "mg/m³",
    accessor: "tvocAsFormaldehyde",
    group: "voc",
  },
  tvocAsAcetone: {
    label: "TVOC as Acetone",
    units: "mg/m³",
    accessor: "tvocAsAcetone",
    group: "voc",
  },
  tvocAsBenzene: {
    label: "TVOC as Benzene",
    units: "mg/m³",
    accessor: "tvocAsBenzene",
    group: "voc",
  },
  tvocAsButanal: {
    label: "TVOC as Butanal",
    units: "mg/m³",
    accessor: "tvocAsButanal",
    group: "voc",
  },
  tvocAsToluene: {
    label: "TVOC as Toluene",
    units: "mg/m³",
    accessor: "tvocAsToluene",
    group: "voc",
  },
  tvocAsMEK: {
    label: "TVOC as Methyl Ethyl Ketone",
    units: "mg/m³",
    accessor: "tvocAsMEK",
    group: "voc",
  },
  cn: {
    label: "Number Concentration of PM",
    units: "P/cm³",
    accessor: "cn",
    channel: 60,
    group: "pm",
  },
  pm1: {
    label: "Mass Concentration of PM₁",
    units: "µg/m³",
    accessor: "pm1",
    channel: 61,
    group: "pm",
  },
  pm25: {
    label: "Mass Concentration of PM₂.₅",
    units: "µg/m³",
    accessor: "pm25",
    channel: 62,
    group: "pm",
  },
  pm4: {
    label: "Mass Concentration of PM₄",
    units: "µg/m³",
    accessor: "pm4",
    channel: 63,
    group: "pm",
  },
  pm10: {
    label: "Mass Concentration of PM₁₀",
    units: "µg/m³",
    accessor: "pm10",
    channel: 64,
    group: "pm",
  },
  pmTot: {
    label: "Mass Concentration of PMₜₒₜₐₗ",
    units: "µg/m³",
    accessor: "pmTot",
    channel: 65,
    group: "pm",
  },
  // Extrapolated values
  dewpointAlt: {
    label: "Dew Point (2)",
    units: "C°",
    accessor: "dewpointAlt",
    group: "general",
  },
  dewpoint: {
    label: "Dew Point",
    units: "C°",
    accessor: "dewpoint",
    group: "general",
  },
  heatIndex: {
    label: "Heat Index",
    units: "C°",
    accessor: "heatIndex",
    group: "general",
  },
  wetBulbTemperature: {
    label: "Wet Bulb Temperature",
    units: "C°",
    accessor: "wetBulbTemperature",
    group: "general",
  },
  saturatedVapourPressure: {
    label: "Saturated Vapour Pressure",
    units: "hPa",
    accessor: "saturatedVapourPressure",
    group: "general",
  },
  actualVapourPressure: {
    label: "Actual Vapour Pressure",
    units: "hPa",
    accessor: "actualVapourPressure",
    group: "general",
  },
  // PM Bands
  pmBand1: {
    label: "PM₀.₁₉",
    units: "P/cm³",
    accessor: "pmBand1",
    channel: 110,
    group: "pmBand",
    lowerLimit: 0.1778,
    upperLimit: 0.1911,
  },
  pmBand2: {
    label: "PM₀.₂₁",
    units: "P/cm³",
    accessor: "pmBand2",
    channel: 111,
    group: "pmBand",
    lowerLimit: 0.1911,
    upperLimit: 0.2054,
  },
  pmBand3: {
    label: "PM₀.₂₂",
    units: "P/cm³",
    accessor: "pmBand3",
    channel: 112,
    group: "pmBand",
    lowerLimit: 0.2054,
    upperLimit: 0.2207,
  },
  pmBand4: {
    label: "PM₀.₂₄",
    units: "P/cm³",
    accessor: "pmBand4",
    channel: 113,
    group: "pmBand",
    lowerLimit: 0.2207,
    upperLimit: 0.2371,
  },
  pmBand5: {
    label: "PM₀.₂₅",
    units: "P/cm³",
    accessor: "pmBand5",
    channel: 114,
    group: "pmBand",
    lowerLimit: 0.2371,
    upperLimit: 0.2548,
  },
  pmBand6: {
    label: "PM₀.₂₇",
    units: "P/cm³",
    accessor: "pmBand6",
    channel: 115,
    group: "pmBand",
    lowerLimit: 0.2548,
    upperLimit: 0.2738,
  },
  pmBand7: {
    label: "PM₀.₂₉",
    units: "P/cm³",
    accessor: "pmBand7",
    channel: 116,
    group: "pmBand",
    lowerLimit: 0.2738,
    upperLimit: 0.2943,
  },
  pmBand8: {
    label: "PM₀.₃₂",
    units: "P/cm³",
    accessor: "pmBand8",
    channel: 117,
    group: "pmBand",
    lowerLimit: 0.2943,
    upperLimit: 0.3162,
  },
  pmBand9: {
    label: "PM₀.₃₄",
    units: "P/cm³",
    accessor: "pmBand9",
    channel: 118,
    group: "pmBand",
    lowerLimit: 0.3162,
    upperLimit: 0.3398,
  },
  pmBand10: {
    label: "PM₀.₃₆",
    units: "P/cm³",
    accessor: "pmBand10",
    channel: 119,
    group: "pmBand",
    lowerLimit: 0.3398,
    upperLimit: 0.3652,
  },
  pmBand11: {
    label: "PM₀.₃₉",
    units: "P/cm³",
    accessor: "pmBand11",
    channel: 120,
    group: "pmBand",
    lowerLimit: 0.3652,
    upperLimit: 0.3924,
  },
  pmBand12: {
    label: "PM₀.₄₂",
    units: "P/cm³",
    accessor: "pmBand12",
    channel: 121,
    group: "pmBand",
    lowerLimit: 0.3924,
    upperLimit: 0.4217,
  },
  pmBand13: {
    label: "PM₀.₄₅",
    units: "P/cm³",
    accessor: "pmBand13",
    channel: 122,
    group: "pmBand",
    lowerLimit: 0.4217,
    upperLimit: 0.4532,
  },
  pmBand14: {
    label: "PM₀.₄₉",
    units: "P/cm³",
    accessor: "pmBand14",
    channel: 123,
    group: "pmBand",
    lowerLimit: 0.4532,
    upperLimit: 0.487,
  },
  pmBand15: {
    label: "PM₀.₅₂",
    units: "P/cm³",
    accessor: "pmBand15",
    channel: 124,
    group: "pmBand",
    lowerLimit: 0.487,
    upperLimit: 0.5233,
  },
  pmBand16: {
    label: "PM₀.₅₆",
    units: "P/cm³",
    accessor: "pmBand16",
    channel: 125,
    group: "pmBand",
    lowerLimit: 0.5233,
    upperLimit: 0.5623,
  },
  pmBand17: {
    label: "PM₀.₆₀",
    units: "P/cm³",
    accessor: "pmBand17",
    channel: 126,
    group: "pmBand",
    lowerLimit: 0.5623,
    upperLimit: 0.6043,
  },
  pmBand18: {
    label: "PM₀.₆₅",
    units: "P/cm³",
    accessor: "pmBand18",
    channel: 127,
    group: "pmBand",
    lowerLimit: 0.6043,
    upperLimit: 0.6494,
  },
  pmBand19: {
    label: "PM₀.₇₀",
    units: "P/cm³",
    accessor: "pmBand19",
    channel: 128,
    group: "pmBand",
    lowerLimit: 0.6494,
    upperLimit: 0.6978,
  },
  pmBand20: {
    label: "PM₀.₇₅",
    units: "P/cm³",
    accessor: "pmBand20",
    channel: 129,
    group: "pmBand",
    lowerLimit: 0.6978,
    upperLimit: 0.7499,
  },
  pmBand21: {
    label: "PM₀.₈₁",
    units: "P/cm³",
    accessor: "pmBand21",
    channel: 130,
    group: "pmBand",
    lowerLimit: 0.7499,
    upperLimit: 0.8058,
  },
  pmBand22: {
    label: "PM₀.₈₇",
    units: "P/cm³",
    accessor: "pmBand22",
    channel: 131,
    group: "pmBand",
    lowerLimit: 0.8058,
    upperLimit: 0.866,
  },
  pmBand23: {
    label: "PM₀.₉₃",
    units: "P/cm³",
    accessor: "pmBand23",
    channel: 132,
    group: "pmBand",
    lowerLimit: 0.866,
    upperLimit: 0.9306,
  },
  pmBand24: {
    label: "PM₁.₀₀",
    units: "P/cm³",
    accessor: "pmBand24",
    channel: 133,
    group: "pmBand",
    lowerLimit: 0.9306,
    upperLimit: 1,
  },
  pmBand25: {
    label: "PM₁.₀₇",
    units: "P/cm³",
    accessor: "pmBand25",
    channel: 134,
    group: "pmBand",
    lowerLimit: 1,
    upperLimit: 1.0746,
  },
  pmBand26: {
    label: "PM₁.₁₅",
    units: "P/cm³",
    accessor: "pmBand26",
    channel: 135,
    group: "pmBand",
    lowerLimit: 1.0746,
    upperLimit: 1.1548,
  },
  pmBand27: {
    label: "PM₁.₂₄",
    units: "P/cm³",
    accessor: "pmBand27",
    channel: 136,
    group: "pmBand",
    lowerLimit: 1.1548,
    upperLimit: 1.2409,
  },
  pmBand28: {
    label: "PM₁.₃₃",
    units: "P/cm³",
    accessor: "pmBand28",
    channel: 137,
    group: "pmBand",
    lowerLimit: 1.2409,
    upperLimit: 1.3335,
  },
  pmBand29: {
    label: "PM₁.₄₃",
    units: "P/cm³",
    accessor: "pmBand29",
    channel: 138,
    group: "pmBand",
    lowerLimit: 1.3335,
    upperLimit: 1.433,
  },
  pmBand30: {
    label: "PM₁.₅₄",
    units: "P/cm³",
    accessor: "pmBand30",
    channel: 139,
    group: "pmBand",
    lowerLimit: 1.433,
    upperLimit: 1.5399,
  },
  pmBand31: {
    label: "PM₁.₆₅",
    units: "P/cm³",
    accessor: "pmBand31",
    channel: 140,
    group: "pmBand",
    lowerLimit: 1.5399,
    upperLimit: 1.6548,
  },
  pmBand32: {
    label: "PM₁.₇₈",
    units: "P/cm³",
    accessor: "pmBand32",
    channel: 141,
    group: "pmBand",
    lowerLimit: 1.6548,
    upperLimit: 1.7783,
  },
  pmBand33: {
    label: "PM₁.₉₁",
    units: "P/cm³",
    accessor: "pmBand33",
    channel: 142,
    group: "pmBand",
    lowerLimit: 1.7783,
    upperLimit: 1.911,
  },
  pmBand34: {
    label: "PM₂.₀₅",
    units: "P/cm³",
    accessor: "pmBand34",
    channel: 143,
    group: "pmBand",
    lowerLimit: 1.911,
    upperLimit: 2.0535,
  },
  pmBand35: {
    label: "PM₂.₂₁",
    units: "P/cm³",
    accessor: "pmBand35",
    channel: 144,
    group: "pmBand",
    lowerLimit: 2.0535,
    upperLimit: 2.2067,
  },
  pmBand36: {
    label: "PM₂.₃₇",
    units: "P/cm³",
    accessor: "pmBand36",
    channel: 145,
    group: "pmBand",
    lowerLimit: 2.2067,
    upperLimit: 2.3714,
  },
  pmBand37: {
    label: "PM₂.₅₅",
    units: "P/cm³",
    accessor: "pmBand37",
    channel: 146,
    group: "pmBand",
    lowerLimit: 2.3714,
    upperLimit: 2.5483,
  },
  pmBand38: {
    label: "PM₂.₇₄",
    units: "P/cm³",
    accessor: "pmBand38",
    channel: 147,
    group: "pmBand",
    lowerLimit: 2.5483,
    upperLimit: 2.7384,
  },
  pmBand39: {
    label: "PM₂.₉₄",
    units: "P/cm³",
    accessor: "pmBand39",
    channel: 148,
    group: "pmBand",
    lowerLimit: 2.7384,
    upperLimit: 2.9427,
  },
  pmBand40: {
    label: "PM₃.₁₆",
    units: "P/cm³",
    accessor: "pmBand40",
    channel: 149,
    group: "pmBand",
    lowerLimit: 2.9427,
    upperLimit: 3.1623,
  },
  pmBand41: {
    label: "PM₃.₄₀",
    units: "P/cm³",
    accessor: "pmBand41",
    channel: 150,
    group: "pmBand",
    lowerLimit: 3.1623,
    upperLimit: 3.3982,
  },
  pmBand42: {
    label: "PM₃.₆₅",
    units: "P/cm³",
    accessor: "pmBand42",
    channel: 151,
    group: "pmBand",
    lowerLimit: 3.3982,
    upperLimit: 3.6517,
  },
  pmBand43: {
    label: "PM₃.₉₂",
    units: "P/cm³",
    accessor: "pmBand43",
    channel: 152,
    group: "pmBand",
    lowerLimit: 3.6517,
    upperLimit: 3.9242,
  },
  pmBand44: {
    label: "PM₄.₂₂",
    units: "P/cm³",
    accessor: "pmBand44",
    channel: 153,
    group: "pmBand",
    lowerLimit: 3.9242,
    upperLimit: 4.217,
  },
  pmBand45: {
    label: "PM₄.₅₃",
    units: "P/cm³",
    accessor: "pmBand45",
    channel: 154,
    group: "pmBand",
    lowerLimit: 4.217,
    upperLimit: 4.5316,
  },
  pmBand46: {
    label: "PM₄.₈₇",
    units: "P/cm³",
    accessor: "pmBand46",
    channel: 155,
    group: "pmBand",
    lowerLimit: 4.5316,
    upperLimit: 4.8697,
  },
  pmBand47: {
    label: "PM₅.₂₃",
    units: "P/cm³",
    accessor: "pmBand47",
    channel: 156,
    group: "pmBand",
    lowerLimit: 4.8697,
    upperLimit: 5.233,
  },
  pmBand48: {
    label: "PM₅.₆₂",
    units: "P/cm³",
    accessor: "pmBand48",
    channel: 157,
    group: "pmBand",
    lowerLimit: 5.233,
    upperLimit: 5.6234,
  },
  pmBand49: {
    label: "PM₆.₀₄",
    units: "P/cm³",
    accessor: "pmBand49",
    channel: 158,
    group: "pmBand",
    lowerLimit: 5.6234,
    upperLimit: 6.043,
  },
  pmBand50: {
    label: "PM₆.₄₉",
    units: "P/cm³",
    accessor: "pmBand50",
    channel: 159,
    group: "pmBand",
    lowerLimit: 6.043,
    upperLimit: 6.4938,
  },
  pmBand51: {
    label: "PM₆.₉₈",
    units: "P/cm³",
    accessor: "pmBand51",
    channel: 160,
    group: "pmBand",
    lowerLimit: 6.4938,
    upperLimit: 6.9783,
  },
  pmBand52: {
    label: "PM₇.₅₀",
    units: "P/cm³",
    accessor: "pmBand52",
    channel: 161,
    group: "pmBand",
    lowerLimit: 6.9783,
    upperLimit: 7.4989,
  },
  pmBand53: {
    label: "PM₈.₀₆",
    units: "P/cm³",
    accessor: "pmBand53",
    channel: 162,
    group: "pmBand",
    lowerLimit: 7.4989,
    upperLimit: 8.0584,
  },
  pmBand54: {
    label: "PM₈.₆₆",
    units: "P/cm³",
    accessor: "pmBand54",
    channel: 163,
    group: "pmBand",
    lowerLimit: 8.0584,
    upperLimit: 8.6596,
  },
  pmBand55: {
    label: "PM₉.₃₁",
    units: "P/cm³",
    accessor: "pmBand55",
    channel: 164,
    group: "pmBand",
    lowerLimit: 8.6596,
    upperLimit: 9.3057,
  },
  pmBand56: {
    label: "PM₁₀.₀₀",
    units: "P/cm³",
    accessor: "pmBand56",
    channel: 165,
    group: "pmBand",
    lowerLimit: 9.3057,
    upperLimit: 10,
  },
  pmBand57: {
    label: "PM₁₀.₇₅",
    units: "P/cm³",
    accessor: "pmBand57",
    channel: 166,
    group: "pmBand",
    lowerLimit: 10,
    upperLimit: 10.7461,
  },
  pmBand58: {
    label: "PM₁₁.₅₅",
    units: "P/cm³",
    accessor: "pmBand58",
    channel: 167,
    group: "pmBand",
    lowerLimit: 10.7461,
    upperLimit: 11.5478,
  },
  pmBand59: {
    label: "PM₁₂.₄₁",
    units: "P/cm³",
    accessor: "pmBand59",
    channel: 168,
    group: "pmBand",
    lowerLimit: 11.5478,
    upperLimit: 12.4094,
  },
  pmBand60: {
    label: "PM₁₃.₃₄",
    units: "P/cm³",
    accessor: "pmBand60",
    channel: 169,
    group: "pmBand",
    lowerLimit: 12.4094,
    upperLimit: 13.3352,
  },
  pmBand61: {
    label: "PM₁₄.₃₃",
    units: "P/cm³",
    accessor: "pmBand61",
    channel: 170,
    group: "pmBand",
    lowerLimit: 13.3352,
    upperLimit: 14.3301,
  },
  pmBand62: {
    label: "PM₁₅.₄₀",
    units: "P/cm³",
    accessor: "pmBand62",
    channel: 171,
    group: "pmBand",
    lowerLimit: 14.3301,
    upperLimit: 15.3993,
  },
  pmBand63: {
    label: "PM₁₆.₅₅",
    units: "P/cm³",
    accessor: "pmBand63",
    channel: 172,
    group: "pmBand",
    lowerLimit: 15.3993,
    upperLimit: 16.5482,
  },
  pmBand64: {
    label: "PM₁₇.₇₈",
    units: "P/cm³",
    accessor: "pmBand64",
    channel: 173,
    group: "pmBand",
    lowerLimit: 16.5482,
    upperLimit: 17.7828,
  },
};

// Directory of channels output by the AQGuard
export const channels = {
  23: "aerosolPumpOutput",
  24: "temperatureOfIADS",
  26: "temperatureOfLED",
  27: "volumeFlow",
  // 35: "airQualityIndex",
  // 36: "infectionRiskIndex",
  40: "temperature",
  41: "relativeHumidity",
  47: "airPressure",
  50: "co2",
  51: "voc",
  60: "cn",
  61: "pm1",
  62: "pm25",
  63: "pm4",
  64: "pm10",
  65: "pmTot",
  // PM Bands
  110: "pmBand1",
  111: "pmBand2",
  112: "pmBand3",
  113: "pmBand4",
  114: "pmBand5",
  115: "pmBand6",
  116: "pmBand7",
  117: "pmBand8",
  118: "pmBand9",
  119: "pmBand10",
  120: "pmBand11",
  121: "pmBand12",
  122: "pmBand13",
  123: "pmBand14",
  124: "pmBand15",
  125: "pmBand16",
  126: "pmBand17",
  127: "pmBand18",
  128: "pmBand19",
  129: "pmBand20",
  130: "pmBand21",
  131: "pmBand22",
  132: "pmBand23",
  133: "pmBand24",
  134: "pmBand25",
  135: "pmBand26",
  136: "pmBand27",
  137: "pmBand28",
  138: "pmBand29",
  139: "pmBand30",
  140: "pmBand31",
  141: "pmBand32",
  142: "pmBand33",
  143: "pmBand34",
  144: "pmBand35",
  145: "pmBand36",
  146: "pmBand37",
  147: "pmBand38",
  148: "pmBand39",
  149: "pmBand40",
  150: "pmBand41",
  151: "pmBand42",
  152: "pmBand43",
  153: "pmBand44",
  154: "pmBand45",
  155: "pmBand46",
  156: "pmBand47",
  157: "pmBand48",
  158: "pmBand49",
  159: "pmBand50",
  160: "pmBand51",
  161: "pmBand52",
  162: "pmBand53",
  163: "pmBand54",
  164: "pmBand55",
  165: "pmBand56",
  166: "pmBand57",
  167: "pmBand58",
  168: "pmBand59",
  169: "pmBand60",
  170: "pmBand61",
  171: "pmBand62",
  172: "pmBand63",
  173: "pmBand64",
};
