import React, { useEffect, Suspense } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/layout/AuthForm';
import { startTransition } from 'react';

function Auth() {
  const { signIn, signUp, user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (email: string, password?: string, name?: string) => {
    try {
      startTransition(async () => {
        if (name) {
          await signUp(email, password, name);
        } else {
          await signIn(email, password);
        }
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full h-full">
      {loading ? (
        <div> </div>
      ) : (
        <Suspense fallback={<div> </div>}>
          <AuthForm onSubmit={handleSubmit} />
        </Suspense>
      )}
    </div>
  );
}

export default Auth;
