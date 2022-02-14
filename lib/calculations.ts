export function getDewPoint(
  rh: number,
  temp: number,
  es: number,
  type: Boolean
) {
  if (type) {
    // https://iridl.ldeo.columbia.edu/dochelp/QA/Basic/dewpoint.html
    // Other dew point calculations might be more appropriate
    // return f2c(c2f(temp) - (100 - rh) / 5);

    // https://calculator.academy/dew-point-calculator/#f1p1
    // Ts = (b * α) / (a – α)

    // T is the current temperature
    // RH is the relative humidity
    // a = 17.62
    // b = 243.12
    // α = ln(RH/100) +a*T/(b+T)
    let ft = c2f(temp);
    let alpha = Math.log(rh / 100) + (17.62 * ft) / (243.12 + ft);
    return f2c((243.12 * alpha) / (17.62 - alpha));
  } else {
    // https://www.weather.gov/media/epz/wxcalc/wetBulbTdFromRh.pdf
    // Td = (237.3 * ln((es * rh)/611))/(7.5 * ln10 - ln((es * rh)/611))
    return (
      (237.3 * Math.log((es * rh) / 611)) /
      (7.5 * Math.log(10) - Math.log((es * rh) / 611))
    );
  }
}

export function getWetBulbTemperature(rh: number, temp: number) {
  // NEEDS WORK
  // https://calculator.academy/wet-bulb-calculator/
  // Tw = T *
  // arctan[0.152 * (rh + 8.3136)^(1/2)] +
  // arctan(T + rh%) -
  // arctan(rh - 1.6763) +
  // 0.00391838 *(rh)^(3/2) *
  // arctan(0.0231 * rh) - 4.686

  // https://www.omnicalculator.com/physics/wet-bulb#what-is-the-wet-bulb-temperature
  // everything in Celsius
  // Tw = T * arctan[0.151977 * (rh% + 8.313659)^(1/2)] +
  // arctan(T + rh%) -
  // arctan(rh% - 1.676331) +
  // 0.00391838 *(rh%)^(3/2) *
  // arctan(0.023101 * rh%) - 4.686035
  return (
    temp * Math.atan((0.151977 * (rh + 8.313659)) ^ (1 / 2)) +
    Math.atan(temp + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * (rh ^ (3 / 2)) * Math.atan(0.023101 * rh) -
    4.686035
  );
}

// Vapor pressure
// https://www.weather.gov/media/epz/wxcalc/vaporPressure.pdf
// T = temperature C
// Td = dewpoint temperature C
// e = 6.11 * 10^((7.5 * Td)/(237.3 + Td)) actual vapor pressure (hPa)
// es = 6.11 * 10^((7.5 * T)/(237.3 + T)) saturated vapor pressure (hPa)
// rh = e/es * 100 // relative humidity
export function getSaturatedVaporPressure(temp: number) {
  return (6.11 * 10) ^ ((7.5 * temp) / (237.3 + temp));
}

export function getActualVaporPressure(dp: number) {
  return (6.11 * 10) ^ ((7.5 * dp) / (237.3 + dp));
}

// Wet bulb globe temperature
// Tw is the wet bulb temperature
// Tg is temperature measured inside a black globe
// WBGT = 0.7 * Tw + 0.2 * Tg + 0.1 * T

// Wet bulb globe temperature (indoors)
// WBGT = 0.7 * Tw + 0.3 * Tg

export function getHeatIndex(rh: number, temp: number) {
  //A heat index is defined as the temperature that a person
  // feels due to the temperature and relative humidity of the air around them.
  // https://calculator.academy/heat-index-calculator/
  // HI = .5 * [ T + 61.0 + [(T-68)*.12] + (RH*.094)]
  let ft = c2f(temp);
  return f2c(0.5 * (ft + 61.0 + (ft - 68) * 0.12 + rh * 0.094));
}

export function getMolecularVolume(temp: number, pressure: number) {
  // console.log(`Temp: ${temp}, Pressure: ${pressure}`);
  return 22.41 * (c2k(temp) / 273) * (1013 / pressure);
}

export function ppbToMgm3(
  ppb: number,
  molarMass: number,
  molecularVolume: number
) {
  return (ppb / 1000) * (molarMass / molecularVolume);
}

export function mgm3ToPPB(
  mass: number,
  molarMass: number,
  molecularVolume: number
) {
  // console.log(
  //   `Mass: ${mass}, molarMass: ${molarMass}, getMolecularVolume: ${molecularVolume}`
  // );
  return mass * (molecularVolume / molarMass) * 1000;
}

export function vocMassToPPB(mass: number, temp: number, pressure: number) {
  // AQGuard calculates ppb to mg/m3 before sending data
  // Conversion is done by the following principle which is described in:
  // Mølhave L, Clausen G, Berglund B, et al. (1997) Total Volatile Organic Compounds (TVOC) in Indoor Air Quality Investigations. Indoor Air 7:225–240.
  // An average molecular mass of 110 g/mol is used for conversion of ppb to µg/m3, representing a mixture of typically found VOCs.
  // This is a typical conversion-method from ppb/ppm to µg or mg/m³ at standard conditions 1013mbar and 0°C.
  const molarMass = 110;
  const molecularVolume = getMolecularVolume(temp, pressure);
  // console.log(molecularVolume);
  return mgm3ToPPB(mass, molarMass, molecularVolume);
}

// Celsius to Fahrenheit
export function c2f(t: number) {
  //(0°C × 9/5) + 32 = 32°F
  return (t * 9) / 5 + 32;
}

// Fahrenheit to Celsius
export function f2c(t: number) {
  // (0°F − 32) × 5/9 = -17.78°C
  return ((t - 32) * 5) / 9;
}

// Celsius to Kelvin
export function c2k(t: number) {
  return t + 273;
}

// Kelvin to Celsius
export function k2c(t: number) {
  return t - 273;
}
