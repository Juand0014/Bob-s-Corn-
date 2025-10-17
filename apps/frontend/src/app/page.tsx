'use client';

import { useState } from 'react';
import CornPurchase from '../components/CornPurchase';
import { ConfigService } from '../config/config.service';

export default function Home() {
  const [userId, setUserId] = useState('');
  const config = ConfigService.getConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-yellow-600 mb-3">
            🌽 {config.appName}
          </h1>
          <p className="text-gray-600 text-lg">{config.appDescription}</p>
          <p className="text-sm text-gray-500 mt-1">
            {config.rateLimitMessage}
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="userId"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Enter Your User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-amber-500"
          />
        </div>

        {userId.trim() ? (
          <CornPurchase userId={userId.trim()} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">🌽</div>
            <p>Enter your User ID above to start buying corn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
