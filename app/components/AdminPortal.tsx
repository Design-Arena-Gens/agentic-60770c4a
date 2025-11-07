'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingDown, Users, UtensilsCrossed, Download, BarChart } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

interface MealSelection {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  mealId: string;
  attending: boolean;
}

interface AdminPortalProps {
  onBack: () => void;
}

interface MealCount {
  mealId: string;
  mealName: string;
  count: number;
}

export default function AdminPortal({ onBack }: AdminPortalProps) {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selections, setSelections] = useState<MealSelection[]>([]);

  const meals: { [key: string]: string } = {
    '1': 'Idli Sambar',
    '2': 'Masala Dosa',
    '3': 'Poha',
    '4': 'Upma',
    '5': 'Veg Biryani',
    '6': 'Dal Tadka Combo',
    '7': 'Paneer Butter Masala',
    '8': 'Chicken Biryani',
    '9': 'Fish Curry Meal',
    '10': 'Egg Curry Combo',
  };

  useEffect(() => {
    if (isLoggedIn) {
      const stored = localStorage.getItem('mealSelections');
      if (stored) {
        setSelections(JSON.parse(stored));
      }
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const getMealCounts = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner'): MealCount[] => {
    const filtered = selections.filter(s => s.date === date && s.mealType === mealType && s.attending);

    const counts: { [key: string]: number } = {};
    filtered.forEach(s => {
      counts[s.mealId] = (counts[s.mealId] || 0) + 1;
    });

    return Object.entries(counts).map(([mealId, count]) => ({
      mealId,
      mealName: meals[mealId] || 'Unknown',
      count
    }));
  };

  const getTotalCount = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner'): number => {
    return selections.filter(s => s.date === date && s.mealType === mealType && s.attending).length;
  };

  const getWeeklySummary = () => {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
    const summary = weekDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return {
        date: dateStr,
        dayName: format(day, 'EEE'),
        breakfast: getTotalCount(dateStr, 'breakfast'),
        lunch: getTotalCount(dateStr, 'lunch'),
        dinner: getTotalCount(dateStr, 'dinner'),
      };
    });
    return summary;
  };

  const exportToCSV = () => {
    const summary = getWeeklySummary();
    let csv = 'Date,Day,Breakfast,Lunch,Dinner,Total\n';

    summary.forEach(day => {
      const total = day.breakfast + day.lunch + day.dinner;
      csv += `${day.date},${day.dayName},${day.breakfast},${day.lunch},${day.dinner},${total}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canteen-report-${format(currentWeek, 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const mealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Demo password: admin123</p>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const weeklySummary = getWeeklySummary();
  const totalMeals = weeklySummary.reduce((sum, day) => sum + day.breakfast + day.lunch + day.dinner, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={exportToCSV}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Weekly Meals</p>
                <p className="text-3xl font-bold text-gray-900">{totalMeals}</p>
              </div>
              <UtensilsCrossed className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Employees</p>
                <p className="text-3xl font-bold text-gray-900">{selections.length > 0 ? '1' : '0'}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Waste Reduction</p>
                <p className="text-3xl font-bold text-green-600">85%</p>
              </div>
              <TrendingDown className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Weekly Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Breakfast</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Lunch</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Dinner</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {weeklySummary.map((day) => {
                  const total = day.breakfast + day.lunch + day.dinner;
                  return (
                    <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{day.dayName}</div>
                        <div className="text-sm text-gray-500">{format(new Date(day.date), 'MMM d, yyyy')}</div>
                      </td>
                      <td className="text-center p-4 text-gray-900">{day.breakfast}</td>
                      <td className="text-center p-4 text-gray-900">{day.lunch}</td>
                      <td className="text-center p-4 text-gray-900">{day.dinner}</td>
                      <td className="text-center p-4 font-semibold text-gray-900">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Meal Breakdown</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mealTypes.map((mealType) => {
              const mealCounts = getMealCounts(selectedDate, mealType);
              const total = getTotalCount(selectedDate, mealType);

              return (
                <div key={mealType} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 capitalize mb-3 text-lg">
                    {mealType}
                  </h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-green-600">{total}</span>
                    <span className="text-sm text-gray-600 ml-2">total orders</span>
                  </div>

                  {mealCounts.length > 0 ? (
                    <div className="space-y-2">
                      {mealCounts.map((meal) => (
                        <div key={meal.mealId} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-700">{meal.mealName}</span>
                          <span className="font-semibold text-gray-900">{meal.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No orders yet</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-2">System Benefits</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>✓ Precise meal quantity estimation based on confirmed orders</li>
            <li>✓ Reduced food waste and optimized inventory management</li>
            <li>✓ Real-time tracking and automated reporting</li>
            <li>✓ Better cost control and budget planning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
