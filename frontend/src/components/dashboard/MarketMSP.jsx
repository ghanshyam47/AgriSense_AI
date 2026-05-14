import React, { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  Search,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  getMarketMSP,
  getMarketPrices,
  getMarketTrend,
} from "../../services/apiClient";
import { MOCK_MARKET_DATA, CROPS_LIST } from "../../services/mockData";

const COMMODITY_MAP = {
  Wheat: "wheat",
  Corn: "maize",
  Rice: "rice",
  Potatoes: "potato",
  Tomatoes: "tomato",
  Onions: "onion",
  Soybeans: "soybean",
  Apples: "apple",
};

const supportsBackend = (crop) =>
  [
    "Wheat",
    "Corn",
    "Rice",
    "Potatoes",
    "Tomatoes",
    "Onions",
    "Soybeans",
  ].includes(crop.name);

const toChartData = (trend, msp) =>
  trend.map((row) => ({
    name: row.date?.slice(5) || row.date || row.name || "Day",
    price: row.price,
    msp,
  }));

export default function MarketMSP() {
  const [selectedCrop, setSelectedCrop] = useState(CROPS_LIST[0]);
  const [viewMode, setViewMode] = useState("chart");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketPrice, setMarketPrice] = useState(null);
  const [mspPrice, setMspPrice] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [sourceLabel, setSourceLabel] = useState("backend");

  const filteredCrops = CROPS_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const loadMarketData = async () => {
    const commodity = COMMODITY_MAP[selectedCrop.name];
    setLoading(true);
    try {
      if (supportsBackend(selectedCrop) && commodity) {
        const [pricesRes, mspRes, trendRes] = await Promise.all([
          getMarketPrices(commodity),
          getMarketMSP(commodity),
          getMarketTrend(commodity, null, 7),
        ]);

        const prices = Array.isArray(pricesRes?.data?.prices)
          ? pricesRes.data.prices
          : Array.isArray(pricesRes?.prices)
            ? pricesRes.prices
            : [];
        const current = prices[0]?.price ?? null;
        const msp = mspRes?.data?.msp ?? mspRes?.msp ?? null;
        const trend = Array.isArray(trendRes?.data?.data)
          ? trendRes.data.data
          : Array.isArray(trendRes?.data)
            ? trendRes.data
            : Array.isArray(trendRes?.data?.prices)
              ? trendRes.data.prices
              : [];

        setMarketPrice(current ?? trend[trend.length - 1]?.price ?? null);
        setMspPrice(msp);
        setTrendData(trend.length ? trend : []);
        setSourceLabel(
          pricesRes?.data?.source || trendRes?.data?.source || "backend",
        );
      } else {
        const last = MOCK_MARKET_DATA[MOCK_MARKET_DATA.length - 1];
        setMarketPrice(last[selectedCrop.id]);
        setMspPrice(last[selectedCrop.mspKey]);
        setTrendData(
          MOCK_MARKET_DATA.map((row) => ({
            date: row.name,
            price: row[selectedCrop.id],
          })),
        );
        setSourceLabel("mock");
      }
    } catch {
      const last = MOCK_MARKET_DATA[MOCK_MARKET_DATA.length - 1];
      setMarketPrice(last[selectedCrop.id]);
      setMspPrice(last[selectedCrop.mspKey]);
      setTrendData(
        MOCK_MARKET_DATA.map((row) => ({
          date: row.name,
          price: row[selectedCrop.id],
        })),
      );
      setSourceLabel("mock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrop]);

  const chartData = useMemo(() => {
    if (trendData.length > 0 && mspPrice != null)
      return toChartData(trendData, mspPrice);
    return MOCK_MARKET_DATA.map((row) => ({
      name: row.name,
      price: row[selectedCrop.id],
      msp: row[selectedCrop.mspKey],
    }));
  }, [trendData, mspPrice, selectedCrop]);

  const diff =
    marketPrice && mspPrice
      ? (((marketPrice - mspPrice) / mspPrice) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200 shadow-xl relative z-[50]">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Market Intelligence
          </h2>
          <p className="text-sm text-slate-500">
            Compare real-time market prices against Government MSP. Source:{" "}
            {sourceLabel}.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl hover:border-green-600 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{selectedCrop.icon}</span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-none mb-0.5">
                  {selectedCrop.category}
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {selectedCrop.name}
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 top-full mt-2 w-full bg-white backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-fadeIn">
                <div className="p-3 border-b border-slate-100">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="Search crops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-green-600 transition-all"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredCrops.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => {
                        setSelectedCrop(crop);
                        setDropdownOpen(false);
                        setSearchTerm("");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-all ${selectedCrop.id === crop.id ? "bg-green-600/5" : ""}`}
                    >
                      <span className="text-xl">{crop.icon}</span>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                          {crop.category}
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          {crop.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Market Price
            </p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{marketPrice ?? "--"}/q
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Info size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Govt. MSP
            </p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{mspPrice ?? "--"}/q
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-4">
          <div
            className={`w-12 h-12 ${Number(diff) > 0 ? "bg-emerald-50" : "bg-red-50"} rounded-xl flex items-center justify-center`}
          >
            {Number(diff) > 0 ? (
              <ArrowUpRight className="text-emerald-600" />
            ) : (
              <ArrowDownRight className="text-red-600" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Profit Gap
            </p>
            <p
              className={`text-2xl font-bold ${Number(diff) > 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {diff}% Above MSP
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">
            Price Trend Analysis:{" "}
            <span className="text-green-600">{selectedCrop.name}</span>
          </h3>
          <div className="flex gap-2 items-center">
            <button
              onClick={loadMarketData}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-green-600 hover:border-green-600 transition-all"
              title="Refresh market data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("chart")}
                className={`p-2 rounded-md transition-all ${viewMode === "chart" ? "bg-white shadow-sm text-green-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-all ${viewMode === "table" ? "bg-white shadow-sm text-green-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <TableIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === "chart" ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={selectedCrop.color}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={selectedCrop.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    dx={-8}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                      fontSize: "12px",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      color: "#0f172a",
                    }}
                    itemStyle={{ color: "#0f172a" }}
                    cursor={{
                      stroke: "#e2e8f0",
                      strokeWidth: 1.5,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "12px",
                      paddingTop: "16px",
                      fontWeight: 500,
                      color: "#64748b",
                    }}
                  />
                  <Area
                    type="monotone"
                    name={`${selectedCrop.name} Market Price`}
                    dataKey="price"
                    stroke={selectedCrop.color}
                    strokeWidth={3}
                    fill="url(#colorPrice)"
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, fill: selectedCrop.color }}
                  />
                  <Line
                    type="monotone"
                    name={`Govt. MSP (${selectedCrop.name})`}
                    dataKey="msp"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Day
                    </th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Market Price
                    </th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      MSP
                    </th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Difference
                    </th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {chartData.map((data, i) => {
                    const diffValue = data.msp
                      ? (((data.price - data.msp) / data.msp) * 100).toFixed(1)
                      : "0.0";
                    return (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 text-sm font-bold text-slate-900">
                          {data.name}
                        </td>
                        <td className="py-4 text-sm font-medium text-slate-700">
                          ?{Math.round(data.price)}
                        </td>
                        <td className="py-4 text-sm font-medium text-slate-400">
                          ?{Math.round(data.msp ?? 0)}
                        </td>
                        <td
                          className={`py-4 text-sm font-bold ${Number(diffValue) > 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {Number(diffValue) > 0 ? "+" : ""}
                          {diffValue}%
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${Number(diffValue) > 10 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {Number(diffValue) > 10 ? "Ideal Sell" : "Hold"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
