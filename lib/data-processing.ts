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

const channelNumbers = {
  23: "aerosolPumpOutput",
  24: "temperatureOfIADS",
  26: "temperatureOfLED",
  27: "volumeFlow",
  35: "airQualityIndex",
  36: "infectionRiskIndex",
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
};

export function mapLogs(logs: Log[]) {
  let measurements = {};
  logs.forEach((log) => {
    const dateTime = new Date(log.DeviceReportedTime);
    // Remove whitespace at front and the three CHECKSUM characters at the end. Then split measurements into array.
    let readingArray = log.Message.trim().slice(0, -3).split(";");
    // Convert to key value pairs.
    readingArray.forEach((reading) => {
      const k = reading.slice(0, reading.indexOf("=")); // get key
      const v = +reading.slice(reading.indexOf("=") + 1); // get value and convert to number
      // Check if key is a used channel
      let keyName = channelNumbers[k];
      if (+k >= 110) keyName = `x${k}`;
      if (keyName)
        if (measurements[keyName])
          // Check if key is initialised in map
          measurements[keyName] = [
            ...measurements[keyName],
            { dateTime, value: v },
          ];
        else measurements[keyName] = [{ dateTime, value: v }];
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
      console.log(values);
      return { values, lastUpdated };
    }
  else return { values: null, lastUpdated: null };
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
