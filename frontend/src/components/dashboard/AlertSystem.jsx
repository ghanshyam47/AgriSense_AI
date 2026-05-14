import React, { useEffect, useMemo, useState } from "react";
import {
  Zap,
  Bug,
  CloudRain,
  TrendingUp,
  Info,
  ChevronRight,
  Search,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { deleteAlert, getAlerts } from "../../services/apiClient";
import { SMART_ALERTS } from "../../services/mockData";

const normalizeAlert = (alert) => ({
  id: alert._id || alert.id,
  type: alert.type,
  severity:
    (alert.severity || "medium").charAt(0).toUpperCase() +
    (alert.severity || "medium").slice(1),
  title: alert.title,
  message: alert.message,
  action: alert.actionable || "Review",
});

const typeIcon = (type) => {
  if (type === "weather")
    return {
      className: "bg-blue-50 text-blue-600",
      icon: <CloudRain size={24} />,
    };
  if (type === "pest")
    return { className: "bg-red-50 text-red-600", icon: <Bug size={24} /> };
  return {
    className: "bg-green-50 text-green-600",
    icon: <TrendingUp size={24} />,
  };
};

export default function AlertSystem() {
  const { isSignedIn, getToken } = useAuth();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState(SMART_ALERTS);
  const [loading, setLoading] = useState(false);

  const loadAlerts = async () => {
    if (!isSignedIn) {
      setAlerts(SMART_ALERTS);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const response = await getAlerts(token, { limit: 50 });
      const rows = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      const normalized = rows.length ? rows.map(normalizeAlert) : SMART_ALERTS;
      setAlerts(normalized);
    } catch {
      setAlerts(SMART_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alert) => {
        const matchesFilter = filter === "All" || alert.severity === filter;
        const matchesSearch =
          alert.title.toLowerCase().includes(search.toLowerCase()) ||
          alert.message.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [alerts, filter, search],
  );

  const handleDelete = async (id) => {
    if (!isSignedIn) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      return;
    }
    try {
      const token = await getToken();
      await deleteAlert(id, token);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            AI Intelligence Alerts
          </h2>
          <p className="text-sm text-slate-500">
            Real-time predictive alerts based on weather, market, and soil
            sensors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAlerts}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-green-600 hover:border-green-600 transition-all"
            title="Refresh alerts"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            />
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-green-600 w-48 md:w-64 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {["All", "High", "Medium"].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  filter === level
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const icon = typeIcon(alert.type);
            return (
              <div
                key={alert.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-green-100 transition-all group relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    alert.severity === "High" ? "bg-red-500" : "bg-amber-500"
                  }`}
                ></div>

                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${icon.className}`}
                  >
                    {icon.icon}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      alert.severity === "High"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {alert.severity} Priority
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                  {alert.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                  {alert.message}
                </p>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Zap size={14} className="text-amber-500" />
                    AI Predicted
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-sm font-black text-green-600 hover:text-green-700 transition-colors group/btn">
                      {alert.action}{" "}
                      <ChevronRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Dismiss alert"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">
              No alerts found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Pest Detection AI</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              Backend alerts are now linked to real weather and market services.
              Use the scanner to validate pest warnings with image analysis.
            </p>
            <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
              <Bug size={18} /> Launch Scanner
            </button>
          </div>
        </div>
        <div className="bg-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] opacity-30 -ml-20 -mb-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Yield Optimizer</h3>
            <p className="text-green-100 text-sm leading-relaxed mb-8 max-w-sm">
              Powered by backend alerts and crop intelligence, the dashboard now
              reflects live farm signals when they are available.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-50">
                  Projected
                </p>
                <p className="text-xl font-black text-white">142.8t</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-50">
                  Confidence
                </p>
                <p className="text-xl font-black text-white">94%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
