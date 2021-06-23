interface Log {
  DeviceReportedTime: string;
  FromHost: string;
  ID: number;
  Message: string;
  ReceivedAt: string;
  SysLogTag: string;
}

interface mValue {
  date: Date;
  value: number;
}

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
  // console.log(logs);
  let measurements = {};
  logs.forEach((log) => {
    // Check entry came from PALAS AQ GUARD 13808 and ignore tail-end logs
    if (log.SysLogTag === "13808<sendVal" && log.Message !== " >57") {
      const dateTime = new Date(log.DeviceReportedTime);
      // Remove whitespace at front and the three CHECKSUM characters at the end. Then split measurements into array.
      let readingArray = log.Message.trim().slice(0, -3).split(";");
      // Convert to key value pairs.
      let readings = {};
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
    }
  });
  return measurements;
}

export function getCurrent(data, key: string) {
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
