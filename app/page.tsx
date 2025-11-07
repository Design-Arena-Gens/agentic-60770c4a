'use client';

import { useState } from 'react';
import { UtensilsCrossed, Users, BarChart3 } from 'lucide-react';
import EmployeePortal from './components/EmployeePortal';
import AdminPortal from './components/AdminPortal';

export default function Home() {
  const [view, setView] = useState<'home' | 'employee' | 'admin'>('home');

  if (view === 'employee') {
    return <EmployeePortal onBack={() => setView('home')} />;
  }

  if (view === 'admin') {
    return <AdminPortal onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <UtensilsCrossed className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Karmic Canteen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart Meal Management System - Reducing Food Waste, One Meal at a Time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => setView('employee')}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Users className="w-16 h-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Employee Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Select your daily meal preferences and manage your orders
              </p>
              <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Enter as Employee
              </span>
            </div>
          </button>

          <button
            onClick={() => setView('admin')}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <BarChart3 className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Admin Portal
              </h2>
              <p className="text-gray-600 mb-6">
                View reports, manage meals, and track canteen operations
              </p>
              <span className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Enter as Admin
              </span>
            </div>
          </button>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Key Benefits
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Reduce Waste</h4>
              <p className="text-sm text-gray-600">
                Prepare meals based on confirmed demand
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
              <p className="text-sm text-gray-600">
                Automated tracking and reporting
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cut Costs</h4>
              <p className="text-sm text-gray-600">
                Optimize food preparation and inventory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
