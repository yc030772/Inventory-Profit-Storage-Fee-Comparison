
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Package, DollarSign, Activity, AlertCircle, 
  Info, Calendar, Settings2, BarChart3, PieChart
} from 'lucide-react';
import { GlobalInputs, PlanConfig } from './types';
import { runSimulation, formatCurrency } from './utils/calculator';
import { NumberInput } from './components/NumberInput';

const App: React.FC = () => {
  const [global, setGlobal] = useState<GlobalInputs>({
    salesPerMonth: 500,
    baseMarginPerUnit: 15,
    baseStorageFee: 0.21,
  });

  const [planA, setPlanA] = useState<PlanConfig>({
    inventoryMonths: 4,
    extraCostPerUnit: 0,
  });

  const [planB, setPlanB] = useState<PlanConfig>({
    inventoryMonths: 1,
    extraCostPerUnit: 1.2,
  });

  const results = useMemo(() => {
    const resA = runSimulation(global, planA);
    const resB = runSimulation(global, planB);
    return { resA, resB };
  }, [global, planA, planB]);

  const profitGap = results.resA.netProfit - results.resB.netProfit;

  const chartData = useMemo(() => {
    return results.resA.monthlyData.map((m, idx) => ({
      name: `Month ${m.month}`,
      profitA: m.cumulativeProfit,
      profitB: results.resB.monthlyData[idx]?.cumulativeProfit || 0,
      stockA: m.openingStock,
      stockB: results.resB.monthlyData[idx]?.openingStock || 0,
    }));
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Inventory Profit Simulator
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              12-Month Comparison Engine
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* INPUT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Parameters */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Settings2 className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">Global Variables</h2>
            </div>
            <div className="space-y-4">
              <NumberInput 
                label="Sales Forecast (Units/Month)" 
                value={global.salesPerMonth} 
                onChange={(val) => setGlobal(prev => ({ ...prev, salesPerMonth: val }))} 
              />
              <NumberInput 
                label="Basic Margin per Unit" 
                prefix="$" 
                value={global.baseMarginPerUnit} 
                onChange={(val) => setGlobal(prev => ({ ...prev, baseMarginPerUnit: val }))} 
                step="0.1"
              />
              <NumberInput 
                label="Base Storage Fee (per Unit)" 
                prefix="$" 
                value={global.baseStorageFee} 
                onChange={(val) => setGlobal(prev => ({ ...prev, baseStorageFee: val }))} 
                step="0.01"
              />
            </div>
          </section>

          {/* Strategy Plan A */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 lg:col-span-1 border-t-8 border-t-blue-500">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800">Strategy Plan A</h2>
            </div>
            <div className="space-y-4">
              <NumberInput 
                label="Inventory Months (Refill Volume)" 
                value={planA.inventoryMonths} 
                onChange={(val) => setPlanA(prev => ({ ...prev, inventoryMonths: val }))} 
              />
              <NumberInput 
                label="Extra Cost per Unit" 
                prefix="$" 
                value={planA.extraCostPerUnit} 
                onChange={(val) => setPlanA(prev => ({ ...prev, extraCostPerUnit: val }))} 
                step="0.1"
              />
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Impact Check</p>
                <p className="text-xs text-blue-700 font-medium">
                  Refills {Math.round(global.salesPerMonth * planA.inventoryMonths)} units per cycle.
                </p>
              </div>
            </div>
          </section>

          {/* Strategy Plan B */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 lg:col-span-1 border-t-8 border-t-emerald-500">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">Strategy Plan B</h2>
            </div>
            <div className="space-y-4">
              <NumberInput 
                label="Inventory Months (Refill Volume)" 
                value={planB.inventoryMonths} 
                onChange={(val) => setPlanB(prev => ({ ...prev, inventoryMonths: val }))} 
              />
              <NumberInput 
                label="Extra Cost per Unit" 
                prefix="$" 
                value={planB.extraCostPerUnit} 
                onChange={(val) => setPlanB(prev => ({ ...prev, extraCostPerUnit: val }))} 
                step="0.1"
              />
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Impact Check</p>
                <p className="text-xs text-emerald-700 font-medium">
                  Refills {Math.round(global.salesPerMonth * planB.inventoryMonths)} units per cycle.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Plan A Net Profit</p>
            <h3 className="text-2xl font-black text-blue-600">{formatCurrency(results.resA.netProfit)}</h3>
            <div className="mt-2 text-[10px] font-medium text-slate-500">
              Storage: {formatCurrency(results.resA.totalStorageCost)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Plan B Net Profit</p>
            <h3 className="text-2xl font-black text-emerald-600">{formatCurrency(results.resB.netProfit)}</h3>
            <div className="mt-2 text-[10px] font-medium text-slate-500">
              Storage: {formatCurrency(results.resB.totalStorageCost)}
            </div>
          </div>
          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 md:col-span-2 text-white flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold opacity-75 uppercase tracking-[0.2em] mb-1">Annual Profit Gap</p>
                <h3 className="text-3xl font-black">{formatCurrency(Math.abs(profitGap))}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold opacity-90">
                  {profitGap > 0 ? 'Plan A Wins' : 'Plan B Wins'}
                </p>
                <p className="text-[10px] opacity-60">Variance over 12 months</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cumulative Profit Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-slate-800">
              <DollarSign className="w-5 h-5 text-indigo-500" />
              Cumulative Profit Curve
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Area type="monotone" dataKey="profitA" name="Plan A Profit" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorA)" />
                  <Area type="monotone" dataKey="profitB" name="Plan B Profit" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorB)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Level Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-slate-800">
              <Package className="w-5 h-5 text-indigo-500" />
              Inventory Level Fluctuations
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Line type="stepAfter" dataKey="stockA" name="Plan A Stock" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  <Line type="stepAfter" dataKey="stockB" name="Plan B Stock" stroke="#10b981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* DETAILED TABLES */}
        <div className="grid grid-cols-1 gap-8">
          {/* Plan A Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                <Calendar className="w-4 h-4 text-blue-500" />
                Plan A: Detailed Simulation Log
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-widest border-b border-slate-200">
                    <th className="px-8 py-4">M#</th>
                    <th className="px-4 py-4 text-slate-800">Opening Stock</th>
                    <th className="px-4 py-4 text-slate-800">Restock</th>
                    <th className="px-4 py-4 text-slate-800">Util (Weeks)</th>
                    <th className="px-4 py-4 text-slate-800">Rate</th>
                    <th className="px-4 py-4 text-slate-800">Storage Cost</th>
                    <th className="px-8 py-4 text-slate-800">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.resA.monthlyData.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-black text-slate-500">{m.month}</td>
                      <td className="px-4 py-4 font-bold text-slate-900">{m.openingStock}</td>
                      <td className="px-4 py-4">
                        {m.restockAmount > 0 ? (
                          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                            +{m.restockAmount}
                          </span>
                        ) : '--'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${m.utilizationWeeks >= 22 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                          {m.utilizationWeeks}w
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">${m.rate.toFixed(3)}</td>
                      <td className="px-4 py-4 font-bold text-red-600">-{formatCurrency(m.monthlyExpense)}</td>
                      <td className={`px-8 py-4 font-black ${m.monthlyProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(m.monthlyProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plan B Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Plan B: Detailed Simulation Log
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-widest border-b border-slate-200">
                    <th className="px-8 py-4">M#</th>
                    <th className="px-4 py-4 text-slate-800">Opening Stock</th>
                    <th className="px-4 py-4 text-slate-800">Restock</th>
                    <th className="px-4 py-4 text-slate-800">Util (Weeks)</th>
                    <th className="px-4 py-4 text-slate-800">Rate</th>
                    <th className="px-4 py-4 text-slate-800">Storage Cost</th>
                    <th className="px-8 py-4 text-slate-800">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.resB.monthlyData.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-black text-slate-500">{m.month}</td>
                      <td className="px-4 py-4 font-bold text-slate-900">{m.openingStock}</td>
                      <td className="px-4 py-4">
                        {m.restockAmount > 0 ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            +{m.restockAmount}
                          </span>
                        ) : '--'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${m.utilizationWeeks >= 22 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                          {m.utilizationWeeks}w
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">${m.rate.toFixed(3)}</td>
                      <td className="px-4 py-4 font-bold text-red-600">-{formatCurrency(m.monthlyExpense)}</td>
                      <td className={`px-8 py-4 font-black ${m.monthlyProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(m.monthlyProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-slate-500">
        <div className="h-[1px] bg-slate-200 mb-8"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
          Inventory Profit Comparison Tool • Ver 3.0
        </p>
        <p className="text-[9px] max-w-2xl mx-auto leading-relaxed italic opacity-75">
          Calculations are simulated based on monthly opening stock levels. Dynamic rates scale proportionally from the 0.78 base tier as specified in the logic.
        </p>
      </footer>
    </div>
  );
};

export default App;
