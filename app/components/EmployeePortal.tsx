'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Check, X } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'veg' | 'non-veg';
}

interface MealSelection {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  mealId: string;
  attending: boolean;
}

interface EmployeePortalProps {
  onBack: () => void;
}

export default function EmployeePortal({ onBack }: EmployeePortalProps) {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selections, setSelections] = useState<MealSelection[]>([]);

  const meals: Meal[] = [
    { id: '1', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', category: 'veg' },
    { id: '2', name: 'Masala Dosa', description: 'Crispy crepe with potato filling', category: 'veg' },
    { id: '3', name: 'Poha', description: 'Flattened rice with vegetables', category: 'veg' },
    { id: '4', name: 'Upma', description: 'Semolina breakfast dish', category: 'veg' },
    { id: '5', name: 'Veg Biryani', description: 'Aromatic rice with mixed vegetables', category: 'veg' },
    { id: '6', name: 'Dal Tadka Combo', description: 'Lentils with rice and roti', category: 'veg' },
    { id: '7', name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato gravy', category: 'veg' },
    { id: '8', name: 'Chicken Biryani', description: 'Spiced rice with tender chicken', category: 'non-veg' },
    { id: '9', name: 'Fish Curry Meal', description: 'Fish curry with rice', category: 'non-veg' },
    { id: '10', name: 'Egg Curry Combo', description: 'Boiled eggs in spicy gravy', category: 'non-veg' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('mealSelections');
    if (stored) {
      setSelections(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeName && employeeId) {
      setIsLoggedIn(true);
      localStorage.setItem('employeeName', employeeName);
      localStorage.setItem('employeeId', employeeId);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const mealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];

  const toggleAttendance = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const key = `${date}-${mealType}`;
    const existing = selections.find(s => s.date === date && s.mealType === mealType);

    let newSelections: MealSelection[];
    if (existing) {
      newSelections = selections.map(s =>
        s.date === date && s.mealType === mealType
          ? { ...s, attending: !s.attending }
          : s
      );
    } else {
      newSelections = [...selections, {
        date,
        mealType,
        mealId: meals[0].id,
        attending: true
      }];
    }

    setSelections(newSelections);
    localStorage.setItem('mealSelections', JSON.stringify(newSelections));
  };

  const selectMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner', mealId: string) => {
    const existing = selections.find(s => s.date === date && s.mealType === mealType);

    let newSelections: MealSelection[];
    if (existing) {
      newSelections = selections.map(s =>
        s.date === date && s.mealType === mealType
          ? { ...s, mealId }
          : s
      );
    } else {
      newSelections = [...selections, {
        date,
        mealType,
        mealId,
        attending: true
      }];
    }

    setSelections(newSelections);
    localStorage.setItem('mealSelections', JSON.stringify(newSelections));
  };

  const getSelection = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    return selections.find(s => s.date === date && s.mealType === mealType);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Employee Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your ID"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
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
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{employeeName}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Selection</h2>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 text-left font-semibold text-gray-700">
                    Meal
                  </th>
                  {weekDays.map((day) => (
                    <th key={day.toISOString()} className="border-b-2 border-gray-200 p-4 text-center font-semibold text-gray-700 min-w-[150px]">
                      <div>{format(day, 'EEE')}</div>
                      <div className="text-sm font-normal text-gray-500">{format(day, 'MMM d')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mealTypes.map((mealType) => (
                  <tr key={mealType} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 p-4 font-medium text-gray-900 capitalize">
                      {mealType}
                    </td>
                    {weekDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const selection = getSelection(dateStr, mealType);
                      const isAttending = selection?.attending ?? false;

                      return (
                        <td key={`${day.toISOString()}-${mealType}`} className="border-b border-gray-200 p-4">
                          <div className="flex flex-col items-center space-y-2">
                            <button
                              onClick={() => toggleAttendance(dateStr, mealType)}
                              className={`w-full py-2 px-3 rounded-lg font-medium transition-colors ${
                                isAttending
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {isAttending ? (
                                <span className="flex items-center justify-center">
                                  <Check className="w-4 h-4 mr-1" />
                                  Yes
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  <X className="w-4 h-4 mr-1" />
                                  No
                                </span>
                              )}
                            </button>

                            {isAttending && (
                              <select
                                value={selection?.mealId || meals[0].id}
                                onChange={(e) => selectMeal(dateStr, mealType, e.target.value)}
                                className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {meals
                                  .filter(m =>
                                    mealType === 'breakfast'
                                      ? m.id <= '4'
                                      : m.id > '4'
                                  )
                                  .map((meal) => (
                                    <option key={meal.id} value={meal.id}>
                                      {meal.name}
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Please select your meals by 6 PM the day before to ensure accurate preparation and reduce food waste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
