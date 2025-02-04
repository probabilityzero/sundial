import React from 'react';
import { User, Mail, Clock } from 'lucide-react';
import { StatCard } from '../components/shared/StatCard';
import { ActivityItem } from '../components/shared/ActivityItem';

function Profile() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">John Doe</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>john@example.com</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Session Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={Clock} label="Total Session Time" value="124h 30m" />
            <StatCard icon={Clock} label="This Week" value="12h 45m" />
            <StatCard icon={Clock} label="Daily Average" value="2h 15m" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem
            title="Mathematics Session"
            time="2 hours ago"
            duration="1h 30m"
          />
          <ActivityItem
            title="Physics Session"
            time="5 hours ago"
            duration="2h 15m"
          />
          <ActivityItem
            title="Chemistry Session"
            time="Yesterday"
            duration="1h 45m"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
