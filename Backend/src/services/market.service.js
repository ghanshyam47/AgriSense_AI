import { cacheService } from './cache.service.js';
import MarketPrice from '../models/MarketPrice.js';
import { logger } from '../utils/logger.js';

// ── MSP Data 2025-26 (₹ per quintal) ────────────────
const MSP_TABLE = {
  rice:       2275, wheat:      2275, maize:      2090, jowar:     3371,
  bajra:      2625, ragi:       4290, cotton:     7121, jute:      5050,
  sugarcane:  340,  groundnut:  6377, soybean:    4892, sunflower: 7280,
  mustard:    5650, chickpea:   5440, lentil:     6425, moong:     8558,
  urad:       6950, tur:        7000, barley:     1850, safflower: 5800,
  sesamum:    8635, nigerseed:  7734, copra:      11160,
};

// ── Mock market data (realistic Indian mandi prices) ──
const MOCK_MARKETS = {
  rice:    [{market:'Azadpur, Delhi',state:'Delhi',price:2400},{market:'Kurnool, AP',state:'Andhra Pradesh',price:2350},{market:'Burdwan, WB',state:'West Bengal',price:2280}],
  wheat:   [{market:'Karnal, Haryana',state:'Haryana',price:2350},{market:'Indore, MP',state:'Madhya Pradesh',price:2300},{market:'Hapur, UP',state:'Uttar Pradesh',price:2250}],
  maize:   [{market:'Davangere, Karnataka',state:'Karnataka',price:2150},{market:'Nizamabad, TS',state:'Telangana',price:2100},{market:'Gulbarga, Karnataka',state:'Karnataka',price:2050}],
  cotton:  [{market:'Rajkot, Gujarat',state:'Gujarat',price:7300},{market:'Adilabad, TS',state:'Telangana',price:7150},{market:'Guntur, AP',state:'Andhra Pradesh',price:7050}],
  soybean: [{market:'Indore, MP',state:'Madhya Pradesh',price:5100},{market:'Latur, MH',state:'Maharashtra',price:4950},{market:'Kota, RJ',state:'Rajasthan',price:4850}],
  chickpea:[{market:'Bikaner, RJ',state:'Rajasthan',price:5600},{market:'Indore, MP',state:'Madhya Pradesh',price:5500},{market:'Gulbarga, Karnataka',state:'Karnataka',price:5450}],
  mustard: [{market:'Alwar, RJ',state:'Rajasthan',price:5800},{market:'Kota, RJ',state:'Rajasthan',price:5750},{market:'Morena, MP',state:'Madhya Pradesh',price:5700}],
  tomato:  [{market:'Azadpur, Delhi',state:'Delhi',price:1500},{market:'Koyambedu, TN',state:'Tamil Nadu',price:1800},{market:'Madanapalle, AP',state:'Andhra Pradesh',price:1200}],
  onion:   [{market:'Nashik, MH',state:'Maharashtra',price:2000},{market:'Azadpur, Delhi',state:'Delhi',price:2200},{market:'Bangalore, KA',state:'Karnataka',price:2100}],
  potato:  [{market:'Agra, UP',state:'Uttar Pradesh',price:800},{market:'Hooghly, WB',state:'West Bengal',price:900},{market:'Indore, MP',state:'Madhya Pradesh',price:850}],
};

/** Get current market prices for a commodity */
export const getPrices = async (commodity, state = null) => {
  commodity = commodity.toLowerCase().trim();
  const cacheKey = `market:${commodity}:${state || 'all'}`;

  return cacheService.getOrSet(cacheKey, async () => {
    // Try MongoDB first
    const query = { commodity };
    if (state) query.state = new RegExp(state, 'i');
    const dbPrices = await MarketPrice.find(query).sort({ date: -1 }).limit(10).lean();
    
    if (dbPrices.length > 0) {
      return { commodity, prices: dbPrices, source: 'database' };
    }

    // Fallback to mock data with random variance
    const mockData = MOCK_MARKETS[commodity];
    if (!mockData) {
      return { commodity, prices: [], message: `No price data for '${commodity}'` };
    }

    const prices = mockData
      .filter(m => !state || m.state.toLowerCase().includes(state.toLowerCase()))
      .map(m => ({
        ...m,
        price: m.price + Math.round((Math.random() - 0.5) * 200),
        unit: 'quintal',
        date: new Date().toISOString().split('T')[0],
      }));

    return { commodity, prices, source: 'mock' };
  }, cacheService.TTL.MARKET);
};

/** Get MSP for a commodity */
export const getMSP = async (commodity) => {
  commodity = commodity.toLowerCase().trim();
  const cacheKey = `msp:${commodity}`;
  
  return cacheService.getOrSet(cacheKey, async () => {
    const msp = MSP_TABLE[commodity];
    if (!msp) {
      return { commodity, msp: null, message: `MSP not available for '${commodity}'` };
    }
    return { commodity, msp, unit: 'quintal', year: '2025-26' };
  }, cacheService.TTL.MSP);
};

/** Compare current market price with MSP */
export const comparePriceToMSP = async (commodity, state = null) => {
  const [priceData, mspData] = await Promise.all([
    getPrices(commodity, state),
    getMSP(commodity),
  ]);

  if (!mspData.msp || priceData.prices.length === 0) {
    return { commodity, comparison: null, message: 'Insufficient data for comparison' };
  }

  const avgPrice = priceData.prices.reduce((sum, p) => sum + p.price, 0) / priceData.prices.length;
  const diff = avgPrice - mspData.msp;
  const diffPercent = ((diff / mspData.msp) * 100).toFixed(1);

  return {
    commodity,
    avg_market_price: Math.round(avgPrice),
    msp: mspData.msp,
    difference: Math.round(diff),
    difference_percent: parseFloat(diffPercent),
    recommendation: diff > 0
      ? `Market price is ₹${Math.round(diff)} above MSP (${diffPercent}% higher). Consider selling now.`
      : `Market price is ₹${Math.abs(Math.round(diff))} below MSP (${Math.abs(diffPercent)}% lower). Hold if possible or sell to government at MSP.`,
    unit: 'quintal',
  };
};

/** Get price trend over last N days */
export const getTrend = async (commodity, state = null, days = 7) => {
  commodity = commodity.toLowerCase().trim();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const query = { commodity, date: { $gte: startDate } };
  if (state) query.state = new RegExp(state, 'i');

  const dbPrices = await MarketPrice.find(query).sort({ date: 1 }).lean();

  if (dbPrices.length > 1) {
    const first = dbPrices[0].price;
    const last = dbPrices[dbPrices.length - 1].price;
    const change = ((last - first) / first * 100).toFixed(1);
    return {
      commodity, period: `${days} days`,
      data: dbPrices,
      trend: last > first ? 'rising' : last < first ? 'falling' : 'stable',
      change_percent: parseFloat(change),
    };
  }

  // Mock trend
  const msp = MSP_TABLE[commodity] || 2000;
  const mockTrend = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    return {
      date: date.toISOString().split('T')[0],
      price: msp + Math.round((Math.random() - 0.3) * msp * 0.1),
    };
  });
  const first = mockTrend[0].price;
  const last = mockTrend[mockTrend.length - 1].price;
  return {
    commodity, period: `${days} days`,
    data: mockTrend,
    trend: last > first ? 'rising' : 'falling',
    change_percent: parseFloat(((last - first) / first * 100).toFixed(1)),
    source: 'mock',
  };
};

/** Fetch market prices from external API, with mock fallback for trend analysis */
export const syncMarketPrices = async () => {
  logger.info('📊 Syncing market prices...');
  let count = 0;

  try {
    const apiKey = process.env.DATA_GOV_API_KEY; // Environment variable for Real API integration

    if (apiKey) {
      logger.info('🌐 Fetching live data from data.gov.in API...');
      // Note: Endpoint may vary, using a common general mandi prices resource ID as an example
      const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=500`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.records && data.records.length > 0) {
          for (const record of data.records) {
            // Mapping fields as per data.gov.in structure (state, market, commodity, modal_price)
            if (!record.commodity || !record.modal_price) continue;
            
            await MarketPrice.create({
              commodity: record.commodity.toLowerCase(),
              market: record.market || 'Unknown',
              state: record.state || 'Unknown',
              price: parseFloat(record.modal_price),
              unit: 'quintal', 
              msp: MSP_TABLE[record.commodity.toLowerCase()] || null,
              date: new Date(),
            });
            count++;
          }
          logger.info(`✅ Synced ${count} live market prices from API`);
          await cacheService.invalidate('market:*');
          return; // Exit successful execution
        } else {
          logger.warn('⚠️ API returned empty records. Falling back to mock data.');
        }
      } else {
        logger.warn(`⚠️ API request failed (Status: ${response.status}). Falling back to mock data.`);
      }
    } else {
      logger.info('ℹ️ No DATA_GOV_API_KEY found in .env. Falling back to mock data generation.');
    }
  } catch (err) {
    logger.error(`❌ Live Market Sync Error: ${err.message}. Falling back to mock data.`);
  }

  // Fallback to Mock Data Simulation
  logger.info('🔄 Using Mock Data for Market sync simulation...');
  for (const [commodity, markets] of Object.entries(MOCK_MARKETS)) {
    for (const m of markets) {
      const price = m.price + Math.round((Math.random() - 0.5) * 200);
      await MarketPrice.create({
        commodity, market: m.market, state: m.state,
        price, unit: 'quintal', msp: MSP_TABLE[commodity] || null,
        date: new Date(),
      });
      count++;
    }
  }
  logger.info(`✅ Synced ${count} mock market prices`);
  await cacheService.invalidate('market:*');
};

export const marketService = { getPrices, getMSP, comparePriceToMSP, getTrend, syncMarketPrices, MSP_TABLE };
