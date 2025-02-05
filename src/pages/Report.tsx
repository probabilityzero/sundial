import React from 'react';
import { BarChart, Clock, Calendar } from 'lucide-react';
import { StatCard } from '../components/shared/StatCard';

function Analytics() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Clock}
          label="Total Session Time"
          value="124h 30m"
        />
        <StatCard
          icon={Calendar}
          label="Session Days"
          value="45 days"
        />
        <StatCard
          icon={BarChart}
          label="Daily Average"
          value="2h 45m"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Session Time Distribution</h3>
        <div className="text-center p-12">
          <BarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Detailed Analytics Coming Soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            This section will show detailed charts and analytics of your session patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
