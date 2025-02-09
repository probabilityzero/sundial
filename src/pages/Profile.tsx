import React from 'react';
import { User, Mail, Clock } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useAuthStore } from '../store/useAuthStore';
import { getDisplayName } from '../utils/user-helpers';

function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full max-w-2xl">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h3>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getDisplayName(user, 'N/A')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.email || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Session Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={Clock} label="Total Session Time" value="124h 30m" />
            <StatCard icon={Clock} label="This Week" value="12h 45m" />
            <StatCard icon={Clock} label="Daily Average" value="2h 15m" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
