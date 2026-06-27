/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, UserPlus, ArrowUpDown, Clock, Coins, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import {
  getAdminMetrics,
  getAdminUsers,
  type AdminMetrics,
  type AdminUser,
} from "@/lib/api/admin";
import { getRequestErrorMessage, isOfflineError } from "@/lib/api-client";

// Mock currency pair revenue data
const CURRENCY_PAIR_REVENUE = [
  { pair: "NGN/USD", revenue: 24500000, transactions: 1520 },
  { pair: "USD/EUR", revenue: 18300000, transactions: 980 },
  { pair: "BTC/USD", revenue: 12700000, transactions: 340 },
  { pair: "GBP/NGN", revenue: 8900000, transactions: 670 },
  { pair: "EUR/NGN", revenue: 5600000, transactions: 430 },
  { pair: "BTC/NGN", revenue: 3200000, transactions: 120 },
];

const totalRevenue = CURRENCY_PAIR_REVENUE.reduce(
  (sum, item) => sum + item.revenue,
  0,
);

const barColors = [
  "#F97316",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

function formatCurrency(value: number) {
  return `₦${(value / 1000000).toFixed(1)}M`;
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const hasCachedAnalyticsRef = useRef(false);

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true);
        setError(null);
        const [fetchedMetrics, fetchedUsers] = await Promise.all([
          getAdminMetrics(),
          getAdminUsers(),
        ]);
        hasCachedAnalyticsRef.current = true;
        setOfflineNotice(null);
        setMetrics(fetchedMetrics);
        setRecentUsers(fetchedUsers.slice(0, 5));
      } catch (err: unknown) {
        console.error("Error fetching analytics data:", err);
        const hasCachedData = hasCachedAnalyticsRef.current;
        const message = getRequestErrorMessage(err, {
          fallback: "Failed to load analytics data.",
          hasCachedData,
        });

        if (isOfflineError(err) && hasCachedData) {
          setOfflineNotice(message);
        } else {
          setOfflineNotice(null);
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="text-sm text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-lg mx-auto mt-8">
        <p className="font-semibold">Error Loading Analytics</p>
        <p className="text-sm">{error || "Could not retrieve metrics"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs font-semibold underline hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {offlineNotice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {offlineNotice}
        </div>
      )}

      {/* Metric cards */}
      <div className="flex flex-wrap gap-4">
        <AdminMetricCard
          label="Registered Users"
          value={metrics.registeredUsers}
          icon={UserPlus}
        />
        <AdminMetricCard
          label="Total Transaction"
          value={metrics.totalTransactions}
          icon={ArrowUpDown}
        />
        <AdminMetricCard
          label="Pending KYC"
          value={metrics.pendingKyc}
          icon={Clock}
        />
        <AdminMetricCard
          label="Currency"
          value={metrics.currencies}
          icon={Coins}
        />
      </div>

      {/* Overview section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
        <button className="flex items-center gap-1.5 text-sm text-gray-600">
          <span className="text-gray-400">Show</span>
          <span className="font-semibold text-gray-900">This Year</span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Revenue chart + deposits/withdrawals */}
      <div className="flex gap-4 overflow-x-auto">
        <RevenueChart />

        {/* Deposit / Withdrawal summary */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 w-[43%] shrink-0">
          <div className="h-[126px] flex items-center pl-6 border-b border-gray-200">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium leading-none text-gray-500">
                Total Deposits
              </p>
              <p className="text-[32px] font-semibold leading-none text-gray-900">
                {metrics.totalDeposits.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="h-[126px] flex items-center pl-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium leading-none text-gray-500">
                Total Withdrawals
              </p>
              <p className="text-[32px] font-semibold leading-none text-gray-900">
                {metrics.totalWithdrawals.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Currency Pair */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Revenue by Currency Pair
          </h2>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            This Year
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CURRENCY_PAIR_REVENUE}
              layout="vertical"
              barSize={28}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
              />
              <YAxis
                type="category"
                dataKey="pair"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#374151", fontWeight: 600 }}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={(value: number) => [
                  `₦${value.toLocaleString()}`,
                  "Revenue",
                ]}
                labelFormatter={(label) => `Pair: ${label}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                {CURRENCY_PAIR_REVENUE.map((_, index) => (
                  <Cell
                    key={index}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Currency Pair Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Currency Pair
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {CURRENCY_PAIR_REVENUE.map((item, index) => (
                <tr
                  key={item.pair}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: barColors[index % barColors.length] }}
                      />
                      <span className="font-semibold text-gray-900">
                        {item.pair}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    ₦{item.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {item.transactions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                      <span
                        className="inline-block w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden"
                      >
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${(item.revenue / totalRevenue) * 100}%`,
                            backgroundColor:
                              barColors[index % barColors.length],
                          }}
                        />
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent users table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Users
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left">
                <span className="inline-block h-3 w-3 rounded-full bg-gray-800" />
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 tracking-wide uppercase">
                User Email
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 tracking-wide uppercase">
                Full Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 tracking-wide uppercase">
                Phone Number
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 tracking-wide uppercase">
                Added On
              </th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No recent users found.
                </td>
              </tr>
            ) : (
              recentUsers.map((user) => {
                const fullName =
                  user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : null;
                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-4 text-gray-900">{user.email}</td>
                    <td className="px-4 py-4 text-gray-400">
                      {fullName ?? "No name"}
                    </td>
                    <td className="px-4 py-4 text-gray-400">
                      {user.phone ?? "No Phone number"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {user.createdAt}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
