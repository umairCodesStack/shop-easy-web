import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VendorAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

  // Mock analytics data
  const [analyticsData] = useState({
    revenue: {
      current: 12340.0,
      previous: 10250.0,
      growth: 20.4,
      chartData: [
        { day: "Mon", amount: 1500 },
        { day: "Tue", amount: 1800 },
        { day: "Wed", amount: 1600 },
        { day: "Thu", amount: 2200 },
        { day: "Fri", amount: 2400 },
        { day: "Sat", amount: 1900 },
        { day: "Sun", amount: 940 },
      ],
    },
    orders: {
      current: 156,
      previous: 142,
      growth: 9.9,
    },
    customers: {
      new: 34,
      returning: 122,
      total: 156,
    },
    topProducts: [
      {
        name: "Wireless Headphones Pro",
        sales: 234,
        revenue: 20970.66,
        percentage: 28,
      },
      {
        name: "Gaming Mouse RGB",
        sales: 189,
        revenue: 8595.5,
        percentage: 21,
      },
      {
        name: "Mechanical Keyboard",
        sales: 156,
        revenue: 20264.44,
        percentage: 18,
      },
      {
        name: "USB-C Hub",
        sales: 89,
        revenue: 3115.0,
        percentage: 15,
      },
      {
        name: "Laptop Stand",
        sales: 67,
        revenue: 3349.33,
        percentage: 12,
      },
    ],
    traffic: {
      totalViews: 12450,
      uniqueVisitors: 8930,
      conversionRate: 4.2,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const maxRevenue = Math.max(
    ...analyticsData.revenue.chartData.map((d) => d.amount),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>📊</span>
                Analytics & Insights
              </h1>
              <p className="text-gray-600">
                Track your store's performance and growth
              </p>
            </div>
            <div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors font-semibold"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💰</span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                +{analyticsData.revenue.growth}%
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold mb-2">
              ${analyticsData.revenue.current.toLocaleString()}
            </p>
            <p className="text-white/80 text-xs">
              vs ${analyticsData.revenue.previous.toLocaleString()} last period
            </p>
          </div>

          {/* Orders */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">📦</span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                +{analyticsData.orders.growth}%
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">
              Total Orders
            </h3>
            <p className="text-3xl font-bold mb-2">
              {analyticsData.orders.current}
            </p>
            <p className="text-white/80 text-xs">
              vs {analyticsData.orders.previous} last period
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">📈</span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                Excellent
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">
              Conversion Rate
            </h3>
            <p className="text-3xl font-bold mb-2">
              {analyticsData.traffic.conversionRate}%
            </p>
            <p className="text-white/80 text-xs">
              {analyticsData.traffic.uniqueVisitors.toLocaleString()} unique
              visitors
            </p>
          </div>

          {/* Customers */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">👥</span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {analyticsData.customers.new} New
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">
              Total Customers
            </h3>
            <p className="text-3xl font-bold mb-2">
              {analyticsData.customers.total}
            </p>
            <p className="text-white/80 text-xs">
              {analyticsData.customers.returning} returning customers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📈</span>
              Revenue Overview
            </h2>
            <div className="space-y-4">
              {analyticsData.revenue.chartData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-semibold text-gray-600">
                    {data.day}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-full flex items-center justify-end pr-3 text-white text-xs font-semibold transition-all duration-500"
                          style={{
                            width: `${(data.amount / maxRevenue) * 100}%`,
                          }}
                        >
                          {(data.amount / maxRevenue) * 100 > 20 &&
                            `$${data.amount}`}
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm font-bold text-gray-900">
                        ${data.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products - Takes 1 column */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🔥</span>
              Top Products
            </h2>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} sales · $
                        {product.revenue.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-orange-600">
                      {product.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500"
                      style={{ width: `${product.percentage * 3}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Total Views</h3>
              <span className="text-3xl">👁️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analyticsData.traffic.totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Page views this period</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Unique Visitors</h3>
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analyticsData.traffic.uniqueVisitors.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Individual visitors</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Avg. Order Value</h3>
              <span className="text-3xl">💵</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              $
              {(
                analyticsData.revenue.current / analyticsData.orders.current
              ).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Per transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
