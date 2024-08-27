import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState(getCurrentUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(getCurrentUser());
      setAuthenticated(isAuthenticated());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, authenticated };
}