import React from 'react';
import { Pencil, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getDisplayName } from '../utils/user-helpers';

function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center w-full py-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-end">
              <Link to="/settings" className="text-blue-500 hover:text-blue-700">
                <Pencil className="w-4 h-4 mr-1 inline-block" />
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
      </div>
    </div>
  );
}

export default Profile;
