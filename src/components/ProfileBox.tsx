import React from 'react';
import { User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getDisplayName } from '../utils/user-helpers';

function ProfileBox() {
  const { user } = useAuthStore();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          <Link to="/settings" className="text-blue-500 hover:text-blue-700">
            Edit Profile
          </Link>
        </div>
        <div className="mt-4 flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {getDisplayName(user, 'N/A')}
            </div>
            <div className="text-sm text-gray-500">
              {user?.email || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
