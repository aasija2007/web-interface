import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'length',
    name: 'Length',
    iconName: 'Ruler',
    baseUnit: 'm',
    description: 'Distances, dimensions, and spatial spans',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', factor: 1, system: 'metric', trivia: 'The meter was originally defined in 1793 as one ten-millionth of the distance from the equator to the North Pole.' },
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000, system: 'metric', trivia: '1 kilometer is approximately equal to 0.621 miles.' },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01, system: 'metric' },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001, system: 'metric' },
      { id: 'micrometer', name: 'Micrometer (Micron)', symbol: 'μm', factor: 1e-6, system: 'metric', trivia: 'A single human hair is about 70 to 180 micrometers wide.' },
      { id: 'nanometer', name: 'Nanometer', symbol: 'nm', factor: 1e-9, system: 'metric', trivia: 'DNA strands are approximately 2.5 nanometers wide.' },
      { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254, system: 'imperial', trivia: 'An inch was historically defined as the width of an adult man\'s thumb.' },
      { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048, system: 'imperial', trivia: 'The foot was standardized based on King Edward I\'s foot size.' },
      { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144, system: 'imperial' },
      { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344, system: 'imperial', trivia: 'A Roman mile was 1,000 paces (mille passus), measured by 2 steps of a marching Roman legion.' },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852, system: 'universal', trivia: '1 nautical mile equals 1 minute of latitude along any meridian.' },
      { id: 'lightyear', name: 'Light Year', symbol: 'ly', factor: 9.4607e15, system: 'universal', trivia: 'Light travels about 9.46 trillion kilometers in a single year!' },
      { id: 'fathom', name: 'Fathom', symbol: 'fth', factor: 1.8288, system: 'imperial', trivia: 'Traditionally used in maritime depth measurement; equal to six feet.' }
    ]
  },
  {
    id: 'weight',
    name: 'Weight / Mass',
    iconName: 'Weight',
    baseUnit: 'kg',
    description: 'Mass, heft, and gravitational pull',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1, system: 'metric', trivia: 'Until 2019, the kilogram was defined by a physical platinum-iridium cylinder stored in France.' },
      { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001, system: 'metric' },
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 1e-6, system: 'metric' },
      { id: 'mcg', name: 'Microgram', symbol: 'μg', factor: 1e-9, system: 'metric' },
      { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.45359237, system: 'imperial', trivia: 'The abbreviation "lb" comes from the Latin word "libra", meaning scales or balance.' },
      { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.028349523125, system: 'imperial' },
      { id: 'stone', name: 'Stone', symbol: 'st', factor: 6.35029318, system: 'imperial', trivia: '1 stone equals 14 pounds; commonly used in the UK and Ireland for human body weight.' },
      { id: 'mton', name: 'Metric Ton', symbol: 't', factor: 1000, system: 'metric' },
      { id: 'uston', name: 'US Short Ton', symbol: 'ton (US)', factor: 907.18474, system: 'imperial' },
      { id: 'ukton', name: 'UK Long Ton', symbol: 'ton (UK)', factor: 1016.0469088, system: 'imperial' },
      { id: 'carat', name: 'Carat', symbol: 'ct', factor: 0.0002, system: 'universal', trivia: 'Carat gets its name from carob seeds, which were historically used as counterweights on precision scales.' }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    baseUnit: 'c',
    description: 'Thermal state, heat intensity, and thermodynamic scales',
    units: [
      {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        system: 'metric',
        toBase: (v) => v,
        fromBase: (v) => v,
        trivia: 'Anders Celsius originally proposed 0° as the boiling point of water and 100° as the freezing point in 1742!'
      },
      {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        system: 'imperial',
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
        trivia: '-40° Celsius is exactly equal to -40° Fahrenheit.'
      },
      {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        system: 'universal',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
        trivia: '0 Kelvin is Absolute Zero, where molecular motion virtually stops.'
      },
      {
        id: 'r',
        name: 'Rankine',
        symbol: '°R',
        system: 'imperial',
        toBase: (v) => (v - 491.67) * (5 / 9),
        fromBase: (v) => (v + 273.15) * (9 / 5),
        trivia: 'Rankine is the absolute thermodynamic temperature scale using Fahrenheit degrees.'
      }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    iconName: 'Droplet',
    baseUnit: 'l',
    description: 'Liquid capacity, 3D space, and volumetric measure',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', factor: 1, system: 'metric', trivia: '1 liter of water weighs almost exactly 1 kilogram at 4°C.' },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001, system: 'metric' },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', factor: 1000, system: 'metric' },
      { id: 'cm3', name: 'Cubic Centimeter (cc)', symbol: 'cm³', factor: 0.001, system: 'metric' },
      { id: 'usgal', name: 'US Gallon', symbol: 'gal (US)', factor: 3.785411784, system: 'imperial', trivia: '1 US gallon is smaller than 1 UK Imperial gallon (which is ~4.546 L).' },
      { id: 'usqt', name: 'US Quart', symbol: 'qt', factor: 0.946352946, system: 'imperial' },
      { id: 'uspt', name: 'US Pint', symbol: 'pt', factor: 0.473176473, system: 'imperial' },
      { id: 'uscup', name: 'US Cup', symbol: 'cup', factor: 0.2365882365, system: 'imperial' },
      { id: 'usfloz', name: 'US Fluid Ounce', symbol: 'fl oz', factor: 0.0295735295625, system: 'imperial' },
      { id: 'ustbsp', name: 'Tablespoon (US)', symbol: 'tbsp', factor: 0.01478676478125, system: 'imperial' },
      { id: 'ustsp', name: 'Teaspoon (US)', symbol: 'tsp', factor: 0.00492892159375, system: 'imperial' },
      { id: 'impgal', name: 'Imperial Gallon', symbol: 'gal (UK)', factor: 4.54609, system: 'imperial' },
      { id: 'bbl', name: 'Oil Barrel', symbol: 'bbl', factor: 158.987294928, system: 'universal', trivia: 'Standard oil barrels hold 42 US gallons.' }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    iconName: 'Maximize2',
    baseUnit: 'm2',
    description: 'Surface coverage, land extent, and 2D space',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', factor: 1, system: 'metric' },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', factor: 1e6, system: 'metric' },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001, system: 'metric' },
      { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', factor: 1e-6, system: 'metric' },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', factor: 10000, system: 'metric', trivia: '1 hectare is roughly the size of an international rugby pitch.' },
      { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.8564224, system: 'imperial', trivia: 'An acre was originally the amount of land workable by one ox in one day.' },
      { id: 'sqft', name: 'Square Foot', symbol: 'sq ft', factor: 0.09290304, system: 'imperial' },
      { id: 'sqin', name: 'Square Inch', symbol: 'sq in', factor: 0.00064516, system: 'imperial' },
      { id: 'sqmi', name: 'Square Mile', symbol: 'sq mi', factor: 2589988.110336, system: 'imperial' }
    ]
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    iconName: 'Zap',
    baseUnit: 'mps',
    description: 'Pace, travel velocity, and movement rates',
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', factor: 1, system: 'metric' },
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', factor: 1 / 3.6, system: 'metric', trivia: 'The fastest land animal, the cheetah, can reach speeds up to 120 km/h.' },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', factor: 0.44704, system: 'imperial', trivia: 'The speed of sound in air at 20°C is approximately 767 mph.' },
      { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444, system: 'universal', trivia: 'Knots were originally measured by throwing a knotted rope attached to a wood board into the water.' },
      { id: 'ftps', name: 'Feet per second', symbol: 'ft/s', factor: 0.3048, system: 'imperial' },
      { id: 'mach', name: 'Mach (Speed of Sound)', symbol: 'Mach', factor: 343, system: 'universal', trivia: 'Mach 1 represents the speed of sound in standard Earth atmosphere (~343 m/s).' }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    baseUnit: 's',
    description: 'Chronological duration, intervals, and epochs',
    units: [
      { id: 's', name: 'Second', symbol: 's', factor: 1, system: 'universal', trivia: 'A second is officially defined by 9,192,631,770 oscillations of a cesium-133 atom.' },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001, system: 'universal' },
      { id: 'us', name: 'Microsecond', symbol: 'μs', factor: 1e-6, system: 'universal' },
      { id: 'ns', name: 'Nanosecond', symbol: 'ns', factor: 1e-9, system: 'universal' },
      { id: 'min', name: 'Minute', symbol: 'min', factor: 60, system: 'universal' },
      { id: 'h', name: 'Hour', symbol: 'h', factor: 3600, system: 'universal' },
      { id: 'd', name: 'Day', symbol: 'd', factor: 86400, system: 'universal' },
      { id: 'wk', name: 'Week', symbol: 'wk', factor: 604800, system: 'universal' },
      { id: 'mo', name: 'Month (Avg 30.44d)', symbol: 'mo', factor: 2629746, system: 'universal' },
      { id: 'yr', name: 'Year (365.25d)', symbol: 'yr', factor: 31557600, system: 'universal' },
      { id: 'decade', name: 'Decade', symbol: 'dec', factor: 315576000, system: 'universal' },
      { id: 'century', name: 'Century', symbol: 'cent', factor: 3155760000, system: 'universal' }
    ]
  },
  {
    id: 'data',
    name: 'Digital Data',
    iconName: 'HardDrive',
    baseUnit: 'b',
    description: 'Computer storage, bits, bytes, and network traffic',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', factor: 0.125, system: 'universal', trivia: 'A bit is the most fundamental binary unit of data in computing.' },
      { id: 'b', name: 'Byte', symbol: 'B', factor: 1, system: 'universal', trivia: '1 byte consists of 8 bits and can represent numbers from 0 to 255.' },
      { id: 'kb', name: 'Kilobyte (Decimal)', symbol: 'KB', factor: 1000, system: 'universal' },
      { id: 'kib', name: 'Kibibyte (Binary)', symbol: 'KiB', factor: 1024, system: 'universal' },
      { id: 'mb', name: 'Megabyte (Decimal)', symbol: 'MB', factor: 1e6, system: 'universal' },
      { id: 'mib', name: 'Mebibyte (Binary)', symbol: 'MiB', factor: 1048576, system: 'universal' },
      { id: 'gb', name: 'Gigabyte (Decimal)', symbol: 'GB', factor: 1e9, system: 'universal', trivia: 'In 1980, a 1 GB hard drive weighed over 500 pounds and cost $40,000!' },
      { id: 'gib', name: 'Gibibyte (Binary)', symbol: 'GiB', factor: 1073741824, system: 'universal' },
      { id: 'tb', name: 'Terabyte (Decimal)', symbol: 'TB', factor: 1e12, system: 'universal' },
      { id: 'tib', name: 'Tebibyte (Binary)', symbol: 'TiB', factor: 1099511627776, system: 'universal' },
      { id: 'pb', name: 'Petabyte (Decimal)', symbol: 'PB', factor: 1e15, system: 'universal', trivia: '1 Petabyte can store about 500 billion pages of standard printed text.' }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Gauge',
    baseUnit: 'pa',
    description: 'Atmospheric pressure, mechanical stress, and force per area',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', factor: 1, system: 'metric' },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', factor: 1000, system: 'metric' },
      { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000, system: 'metric', trivia: 'Standard atmospheric pressure at sea level is approximately 1.013 bar.' },
      { id: 'psi', name: 'Pounds per Sq Inch', symbol: 'psi', factor: 6894.757293168, system: 'imperial', trivia: 'Standard passenger car tires are typically inflated to ~32-35 psi.' },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', factor: 101325, system: 'universal' },
      { id: 'mmhg', name: 'Millimeter of Mercury', symbol: 'mmHg', factor: 133.3223684, system: 'universal', trivia: 'Commonly used in medicine for measuring blood pressure.' },
      { id: 'torr', name: 'Torr', symbol: 'Torr', factor: 133.322368421, system: 'universal' }
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Work',
    iconName: 'Activity',
    baseUnit: 'j',
    description: 'Work done, caloric output, thermal energy, and heat',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', factor: 1, system: 'metric', trivia: '1 Joule is roughly the energy required to lift a small apple vertically by 1 meter.' },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', factor: 1000, system: 'metric' },
      { id: 'cal', name: 'Calorie (gram)', symbol: 'cal', factor: 4.184, system: 'metric' },
      { id: 'kcal', name: 'Kilocalorie (Food Cal)', symbol: 'kcal (Cal)', factor: 4184, system: 'metric', trivia: 'Food "Calories" written on nutritional labels are actually kilocalories!' },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', factor: 3600, system: 'universal' },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3.6e6, system: 'universal', trivia: 'The average household electricity consumption is measured in kWh.' },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', factor: 1.602176634e-19, system: 'universal' },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.05585, system: 'imperial' }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    iconName: 'Sun',
    baseUnit: 'w',
    description: 'Rate of energy transfer, wattage, and engine output',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', factor: 1, system: 'metric' },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', factor: 1000, system: 'metric' },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', factor: 1e6, system: 'metric' },
      { id: 'hp', name: 'Horsepower (Mechanical)', symbol: 'hp', factor: 745.69987158227, system: 'imperial', trivia: 'James Watt coined the term "horsepower" to compare the output of steam engines with draft horses.' },
      { id: 'btuh', name: 'BTU per hour', symbol: 'BTU/h', factor: 0.29307107, system: 'imperial' }
    ]
  },
  {
    id: 'force',
    name: 'Force',
    iconName: 'Compass',
    baseUnit: 'n',
    description: 'Mechanical push, vector force, and tension',
    units: [
      { id: 'n', name: 'Newton', symbol: 'N', factor: 1, system: 'metric', trivia: 'Named after Sir Isaac Newton in recognition of his classical mechanics work.' },
      { id: 'kn', name: 'Kilonewton', symbol: 'kN', factor: 1000, system: 'metric' },
      { id: 'dyne', name: 'Dyne', symbol: 'dyn', factor: 1e-5, system: 'metric' },
      { id: 'lbf', name: 'Pound-force', symbol: 'lbf', factor: 4.44822161526, system: 'imperial' }
    ]
  },
  {
    id: 'angle',
    name: 'Angle',
    iconName: 'CircleDot',
    baseUnit: 'deg',
    description: 'Geometric rotation, arc measure, and angular spread',
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', factor: 1, system: 'universal', trivia: 'Dividing a circle into 360 degrees dates back to ancient Babylonian astronomy.' },
      { id: 'rad', name: 'Radian', symbol: 'rad', factor: 180 / Math.PI, system: 'universal', trivia: 'A full circle equals 2π radians (~6.28318 rad).' },
      { id: 'grad', name: 'Gradian', symbol: 'grad', factor: 0.9, system: 'universal', trivia: 'A right angle equals 100 gradians.' },
      { id: 'arcmin', name: 'Arcminute', symbol: 'arcmin', factor: 1 / 60, system: 'universal' },
      { id: 'arcsec', name: 'Arcsecond', symbol: 'arcsec', factor: 1 / 3600, system: 'universal' }
    ]
  },
  {
    id: 'frequency',
    name: 'Frequency',
    iconName: 'Radio',
    baseUnit: 'hz',
    description: 'Cycles per second, wave frequencies, and clock speeds',
    units: [
      { id: 'hz', name: 'Hertz', symbol: 'Hz', factor: 1, system: 'universal' },
      { id: 'khz', name: 'Kilohertz', symbol: 'kHz', factor: 1000, system: 'universal' },
      { id: 'mhz', name: 'Megahertz', symbol: 'MHz', factor: 1e6, system: 'universal', trivia: 'FM radio stations broadcast in the 88 to 108 MHz frequency range.' },
      { id: 'ghz', name: 'Gigahertz', symbol: 'GHz', factor: 1e9, system: 'universal', trivia: 'Modern CPU clock frequencies are measured in GHz (billions of cycles per second).' },
      { id: 'rpm', name: 'Revolutions per min', symbol: 'RPM', factor: 1 / 60, system: 'universal' }
    ]
  },
  {
    id: 'fuel',
    name: 'Fuel Economy',
    iconName: 'Fuel',
    baseUnit: 'l100km',
    description: 'Vehicle consumption rates and fuel efficiency',
    units: [
      {
        id: 'l100km',
        name: 'Liters per 100 km',
        symbol: 'L/100km',
        system: 'metric',
        toBase: (v) => v,
        fromBase: (v) => v,
        trivia: 'Lower L/100km values indicate better fuel economy.'
      },
      {
        id: 'mpgus',
        name: 'Miles per Gal (US)',
        symbol: 'mpg (US)',
        system: 'imperial',
        toBase: (v) => (v === 0 ? 0 : 235.214583 / v),
        fromBase: (v) => (v === 0 ? 0 : 235.214583 / v)
      },
      {
        id: 'mpguk',
        name: 'Miles per Gal (UK)',
        symbol: 'mpg (UK)',
        system: 'imperial',
        toBase: (v) => (v === 0 ? 0 : 282.4809363 / v),
        fromBase: (v) => (v === 0 ? 0 : 282.4809363 / v)
      },
      {
        id: 'kml',
        name: 'Kilometers per Liter',
        symbol: 'km/L',
        system: 'metric',
        toBase: (v) => (v === 0 ? 0 : 100 / v),
        fromBase: (v) => (v === 0 ? 0 : 100 / v)
      }
    ]
  },
  {
    id: 'currency',
    name: 'Currency (Live Exchange Rates)',
    iconName: 'Coins',
    baseUnit: 'usd',
    description: 'Global financial currencies with dynamic live exchange rate API',
    units: [
      { id: 'usd', name: 'US Dollar', symbol: '$', factor: 1, system: 'universal' },
      { id: 'eur', name: 'Euro', symbol: '€', factor: 1.08, system: 'universal' },
      { id: 'gbp', name: 'British Pound', symbol: '£', factor: 1.27, system: 'universal' },
      { id: 'jpy', name: 'Japanese Yen', symbol: '¥', factor: 0.0065, system: 'universal' },
      { id: 'cad', name: 'Canadian Dollar', symbol: 'CA$', factor: 0.74, system: 'universal' },
      { id: 'aud', name: 'Australian Dollar', symbol: 'A$', factor: 0.65, system: 'universal' },
      { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', factor: 1.13, system: 'universal' },
      { id: 'cny', name: 'Chinese Yuan', symbol: 'CN¥', factor: 0.14, system: 'universal' },
      { id: 'inr', name: 'Indian Rupee', symbol: '₹', factor: 0.012, system: 'universal' },
      { id: 'brl', name: 'Brazilian Real', symbol: 'R$', factor: 0.18, system: 'universal' },
      { id: 'zar', name: 'South African Rand', symbol: 'R', factor: 0.053, system: 'universal' }
    ]
  }
];
