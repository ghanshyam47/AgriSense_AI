export const MOCK_MARKET_DATA = [
  { name: 'Jan', Wheat: 2300, Corn: 1800, Soybeans: 2400, Rice: 2100, Potatoes: 1200, Tomatoes: 1500, Apples: 4500, Onions: 800, MSP_Wheat: 2125, MSP_Corn: 1962, MSP_Soybeans: 2200, MSP_Rice: 2040, MSP_Potatoes: 1000, MSP_Tomatoes: 1300, MSP_Apples: 4000, MSP_Onions: 700 },
  { name: 'Feb', Wheat: 2200, Corn: 1850, Soybeans: 2210, Rice: 2150, Potatoes: 1100, Tomatoes: 1800, Apples: 4600, Onions: 900, MSP_Wheat: 2125, MSP_Corn: 1962, MSP_Soybeans: 2200, MSP_Rice: 2040, MSP_Potatoes: 1000, MSP_Tomatoes: 1300, MSP_Apples: 4000, MSP_Onions: 700 },
  { name: 'Mar', Wheat: 2450, Corn: 1900, Soybeans: 2290, Rice: 2300, Potatoes: 1300, Tomatoes: 2000, Apples: 4400, Onions: 1100, MSP_Wheat: 2125, MSP_Corn: 1962, MSP_Soybeans: 2200, MSP_Rice: 2040, MSP_Potatoes: 1000, MSP_Tomatoes: 1300, MSP_Apples: 4000, MSP_Onions: 700 },
  { name: 'Apr', Wheat: 2780, Corn: 2150, Soybeans: 2000, Rice: 2400, Potatoes: 1500, Tomatoes: 1400, Apples: 4200, Onions: 1400, MSP_Wheat: 2125, MSP_Corn: 1962, MSP_Soybeans: 2200, MSP_Rice: 2040, MSP_Potatoes: 1000, MSP_Tomatoes: 1300, MSP_Apples: 4000, MSP_Onions: 700 },
  { name: 'May', Wheat: 3100, Corn: 2300, Soybeans: 2181, Rice: 2600, Potatoes: 1400, Tomatoes: 1200, Apples: 4100, Onions: 1200, MSP_Wheat: 2125, MSP_Corn: 1962, MSP_Soybeans: 2200, MSP_Rice: 2040, MSP_Potatoes: 1000, MSP_Tomatoes: 1300, MSP_Apples: 4000, MSP_Onions: 700 },
  { name: 'Jun', Wheat: 2900, Corn: 2200, Soybeans: 2500, Rice: 2550, Potatoes: 1600, Tomatoes: 1100, Apples: 4300, Onions: 1000, MSP_Wheat: 2125, MSP_Corn: 1962, MSP_Soybeans: 2200, MSP_Rice: 2040, MSP_Potatoes: 1000, MSP_Tomatoes: 1300, MSP_Apples: 4000, MSP_Onions: 700 },
  { name: 'Jul', Wheat: 3490, Corn: 2400, Soybeans: 2100, Rice: 2800, Potatoes: 1800, Tomatoes: 1300, Apples: 4800, Onions: 1300, MSP_Wheat: 2275, MSP_Corn: 2090, MSP_Soybeans: 2350, MSP_Rice: 2183, MSP_Potatoes: 1100, MSP_Tomatoes: 1450, MSP_Apples: 4200, MSP_Onions: 850 },
];

export const MOCK_WEATHER = {
  temp: 24,
  condition: 'Partly Cloudy',
  humidity: 62,
  windSpeed: 14,
  forecast: [
    { day: 'Mon', temp: 25, icon: 'sun' },
    { day: 'Tue', temp: 22, icon: 'cloud-rain' },
    { day: 'Wed', temp: 20, icon: 'cloud-rain' },
    { day: 'Thu', temp: 24, icon: 'cloud' },
    { day: 'Fri', temp: 26, icon: 'sun' },
  ],
};

export const WEATHER_HISTORY = {
  days: [
    { time: '26 Apr - 00:00', temp: 18, rainfall: 0 }, { time: '26 Apr - 04:00', temp: 16, rainfall: 0 },
    { time: '26 Apr - 08:00', temp: 22, rainfall: 2 }, { time: '26 Apr - 12:00', temp: 28, rainfall: 0 },
    { time: '26 Apr - 16:00', temp: 26, rainfall: 5 }, { time: '26 Apr - 20:00', temp: 21, rainfall: 1 }
  ],
  weeks: [
    { time: '20 Apr', temp: 24, rainfall: 12 }, { time: '21 Apr', temp: 22, rainfall: 45 },
    { time: '22 Apr', temp: 26, rainfall: 10 }, { time: '23 Apr', temp: 28, rainfall: 2 },
    { time: '24 Apr', temp: 25, rainfall: 0 }, { time: '25 Apr', temp: 24, rainfall: 0 },
    { time: '26 Apr', temp: 23, rainfall: 8 }
  ],
  months: [
    { time: 'Wk 1 (Apr)', temp: 22, rainfall: 120 }, { time: 'Wk 2 (Apr)', temp: 24, rainfall: 80 },
    { time: 'Wk 3 (Apr)', temp: 26, rainfall: 200 }, { time: 'Wk 4 (Apr)', temp: 25, rainfall: 150 }
  ],
  years: [
    { time: '2021', temp: 24.2, rainfall: 1200 }, { time: '2022', temp: 24.8, rainfall: 1100 },
    { time: '2023', temp: 25.1, rainfall: 1350 }, { time: '2024', temp: 25.4, rainfall: 1280 }
  ]
};

export const CROP_CALENDARS = {
  Wheat: [
    { stage: 'Preparation', label: 'Soil Tilling', date: 'Oct 1 - Oct 15', status: 'Completed', preMonsoon: true },
    { stage: 'Sowing', label: 'Seed Sowing', date: 'Oct 16 - Oct 30', status: 'Completed', preMonsoon: true },
    { stage: 'Vegetative', label: 'Tillering Stage', date: 'Nov 1 - Dec 15', status: 'In Progress', preMonsoon: false },
    { stage: 'Harvest', label: 'Maturity Collection', date: 'Mar 10 - Mar 25', status: 'Upcoming', preMonsoon: false }
  ],
  Corn: [
    { stage: 'Preparation', label: 'Land Clearing', date: 'May 1 - May 15', status: 'Completed', preMonsoon: true },
    { stage: 'Sowing', label: 'Corn Sowing', date: 'May 16 - May 30', status: 'In Progress', preMonsoon: true },
    { stage: 'Vegetative', label: 'V6 to V12 Stages', date: 'Jun 1 - Jul 15', status: 'Upcoming', preMonsoon: false },
    { stage: 'Harvest', label: 'Grain Collection', date: 'Sep 10 - Sep 25', status: 'Upcoming', preMonsoon: false }
  ],
  Soybeans: [
    { stage: 'Preparation', label: 'Bed Preparation', date: 'Jun 1 - Jun 15', status: 'Completed', preMonsoon: true },
    { stage: 'Sowing', label: 'Soy Sowing', date: 'Jun 16 - Jun 30', status: 'Upcoming', preMonsoon: true },
    { stage: 'Vegetative', label: 'Flowering Stage', date: 'Jul 15 - Aug 15', status: 'Upcoming', preMonsoon: false },
    { stage: 'Harvest', label: 'Pod Collection', date: 'Oct 10 - Oct 25', status: 'Upcoming', preMonsoon: false }
  ],
  Rice: [
    { stage: 'Preparation', label: 'Field Leveling', date: 'May 1 - May 20', status: 'Completed', preMonsoon: true },
    { stage: 'Sowing', label: 'Nursery Sowing', date: 'Jun 1 - Jun 15', status: 'In Progress', preMonsoon: true },
    { stage: 'Vegetative', label: 'Transplanting', date: 'Jul 1 - Aug 15', status: 'Upcoming', preMonsoon: false },
    { stage: 'Harvest', label: 'Rice Harvest', date: 'Nov 1 - Nov 20', status: 'Upcoming', preMonsoon: false }
  ],
  Potatoes: [
    { stage: 'Preparation', label: 'Tilling', date: 'Sep 1 - Sep 15', status: 'Completed', preMonsoon: true },
    { stage: 'Sowing', label: 'Tuber Planting', date: 'Sep 16 - Oct 10', status: 'Completed', preMonsoon: true },
    { stage: 'Vegetative', label: 'Bulking Phase', date: 'Oct 15 - Dec 15', status: 'In Progress', preMonsoon: false },
    { stage: 'Harvest', label: 'Main Harvest', date: 'Jan 20 - Feb 15', status: 'Upcoming', preMonsoon: false }
  ],
  Tomatoes: [
    { stage: 'Preparation', label: 'Greenhouse Prep', date: 'Year Round', status: 'Completed', preMonsoon: false },
    { stage: 'Sowing', label: 'Seedling Plant', date: 'Jan 1 - Jan 15', status: 'Completed', preMonsoon: false },
    { stage: 'Vegetative', label: 'Fruiting Stage', date: 'Feb 15 - Apr 15', status: 'In Progress', preMonsoon: false },
    { stage: 'Harvest', label: 'Continuous Pick', date: 'Apr 20 - Jun 30', status: 'Upcoming', preMonsoon: false }
  ],
  Onions: [
    { stage: 'Preparation', label: 'Bed Setup', date: 'Oct 1 - Oct 15', status: 'Completed', preMonsoon: true },
    { stage: 'Sowing', label: 'Seed Sowing', date: 'Oct 16 - Nov 15', status: 'Completed', preMonsoon: true },
    { stage: 'Vegetative', label: 'Bulbing Stage', date: 'Dec 1 - Feb 28', status: 'In Progress', preMonsoon: false },
    { stage: 'Harvest', label: 'Curing/Harvest', date: 'Mar 15 - Apr 15', status: 'Upcoming', preMonsoon: false }
  ],
  Apples: [
    { stage: 'Preparation', label: 'Pruning', date: 'Jan 1 - Feb 15', status: 'Completed', preMonsoon: false },
    { stage: 'Vegetative', label: 'Blooming', date: 'Mar 15 - Apr 15', status: 'Completed', preMonsoon: false },
    { stage: 'Development', label: 'Fruit Growth', date: 'May 1 - Aug 31', status: 'In Progress', preMonsoon: false },
    { stage: 'Harvest', label: 'Fruit Picking', date: 'Sep 1 - Oct 31', status: 'Upcoming', preMonsoon: false }
  ]
};

export const HARVEST_TARGETS = {
  Wheat: { targetDate: '2026-03-20', confidence: 94 },
  Corn: { targetDate: '2026-09-15', confidence: 88 },
  Soybeans: { targetDate: '2026-10-12', confidence: 91 },
  Rice: { targetDate: '2026-11-05', confidence: 85 },
  Potatoes: { targetDate: '2026-08-20', confidence: 92 },
  Tomatoes: { targetDate: '2026-07-25', confidence: 89 },
  Apples: { targetDate: '2026-10-30', confidence: 95 },
  Onions: { targetDate: '2026-06-15', confidence: 90 },
};

const generateDenseHistory = (cropName) => {
  const events = [];
  for (let i = 1; i < 26; i++) {
    const day = String(i).padStart(2, '0');
    events.push({
      id: `${cropName}-${i}`,
      date: `2026-04-${day}`,
      type: i % 3 === 0 ? 'Irrigation' : 'Note',
      note: i % 3 === 0 ? `Watered ${cropName} field` : `${cropName} growth monitoring check`,
      completed: true
    });
  }
  return events;
};

export const MANUAL_EVENTS_BY_CROP = {
  Wheat: generateDenseHistory('Wheat'),
  Corn: generateDenseHistory('Corn'),
  Soybeans: generateDenseHistory('Soybeans'),
  Rice: generateDenseHistory('Rice'),
  Potatoes: generateDenseHistory('Potatoes'),
  Tomatoes: generateDenseHistory('Tomatoes'),
  Apples: generateDenseHistory('Apples'),
  Onions: generateDenseHistory('Onions'),
};

export const IRRIGATION_DATA = {
  Wheat: [
    { id: 1, zone: 'North Field A', time: '05:00 AM', duration: '45 mins', status: 'Completed', waterAmount: '200 L' },
    { id: 2, zone: 'North Field B', time: '06:00 PM', duration: '30 mins', status: 'Scheduled', waterAmount: '150 L' }
  ],
  Corn: [
    { id: 3, zone: 'East Field', time: '07:00 AM', duration: '60 mins', status: 'In Progress', waterAmount: '300 L' },
    { id: 4, zone: 'Central Field', time: '05:00 PM', duration: '45 mins', status: 'Delayed (Rain)', waterAmount: '0 L' }
  ],
  Soybeans: [
    { id: 5, zone: 'South Field', time: '04:00 AM', duration: '50 mins', status: 'Completed', waterAmount: '250 L' },
    { id: 6, zone: 'West Field', time: '08:00 PM', duration: '40 mins', status: 'Scheduled', waterAmount: '180 L' }
  ],
  Rice: [
    { id: 7, zone: 'Paddy Zone A', time: '04:00 AM', duration: '120 mins', status: 'Completed', waterAmount: '1200 L' },
    { id: 8, zone: 'Paddy Zone B', time: '04:00 PM', duration: '90 mins', status: 'Scheduled', waterAmount: '900 L' }
  ],
  Potatoes: [
    { id: 9, zone: 'North Hill Side', time: '06:00 AM', duration: '30 mins', status: 'Completed', waterAmount: '100 L' },
    { id: 10, zone: 'South Hill Side', time: '07:00 PM', duration: '30 mins', status: 'Scheduled', waterAmount: '100 L' }
  ],
  Tomatoes: [
    { id: 11, zone: 'Drip Block 1', time: '08:00 AM', duration: '15 mins', status: 'Completed', waterAmount: '50 L' },
    { id: 12, zone: 'Drip Block 2', time: '10:00 AM', duration: '15 mins', status: 'In Progress', waterAmount: '50 L' }
  ],
  Onions: [
    { id: 13, zone: 'Section 4', time: '05:30 AM', duration: '40 mins', status: 'Completed', waterAmount: '180 L' }
  ],
  Apples: [
    { id: 14, zone: 'Orchard North', time: '04:00 AM', duration: '60 mins', status: 'Completed', waterAmount: '300 L' },
    { id: 15, zone: 'Orchard South', time: '06:00 AM', duration: '60 mins', status: 'Completed', waterAmount: '300 L' }
  ]
};

export const SMART_ALERTS = [
  { id: 1, type: 'weather-irrigation', title: 'Heavy Rain Forecasted', message: 'Heavy rain expected in 2 days → Delaying irrigation to prevent waterlogging and conserve water.', severity: 'High', action: 'View Auto-Adjust' },
  { id: 2, type: 'pest-weather', title: 'High Humidity Pest Risk', message: 'Current humidity levels (62%) increase risk of Leaf Rust. Preventative spray recommended.', severity: 'Medium', action: 'Scan Leaf' },
  { id: 3, type: 'market-trend', title: 'Wheat Price Surge', message: 'Wheat real-time prices are 53% above MSP. Ideal window to sell stored inventory.', severity: 'High', action: 'Market View' }
];

export const CROPS_LIST = [
  { id: 'Wheat', name: 'Wheat', color: '#f59e0b', icon: '🌾', category: 'Grain', mspKey: 'MSP_Wheat' },
  { id: 'Corn', name: 'Corn', color: '#10b981', icon: '🌽', category: 'Grain', mspKey: 'MSP_Corn' },
  { id: 'Rice', name: 'Rice', color: '#3b82f6', icon: '🍚', category: 'Grain', mspKey: 'MSP_Rice' },
  { id: 'Potatoes', name: 'Potatoes', color: '#8b4513', icon: '🥔', category: 'Vegetable', mspKey: 'MSP_Potatoes' },
  { id: 'Tomatoes', name: 'Tomatoes', color: '#ef4444', icon: '🍅', category: 'Vegetable', mspKey: 'MSP_Tomatoes' },
  { id: 'Onions', name: 'Onions', color: '#a855f7', icon: '🧅', category: 'Vegetable', mspKey: 'MSP_Onions' },
  { id: 'Apples', name: 'Apples', color: '#f43f5e', icon: '🍎', category: 'Fruit', mspKey: 'MSP_Apples' },
  { id: 'Soybeans', name: 'Soybeans', color: '#6366f1', icon: '🫛', category: 'Grain', mspKey: 'MSP_Soybeans' },
];
