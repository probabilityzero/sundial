import React, { useState, useEffect } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

function Auth() {
  // ... (rest of your component code)

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to home after successful login
    }
  }, [user, navigate]);

  // ... (rest of your component code)
}

export default Auth;
