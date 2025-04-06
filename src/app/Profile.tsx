import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getDisplayName } from '../utils/user-helpers';
import ProfileHeader from '../components/ProfileHeader';

function Profile() {
  const { user } = useAuthStore();

  return (
    <ProfileHeader />

  );
}

export default Profile;
