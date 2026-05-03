import React, { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import client, { setAuthToken } from '../services/apiClient';
import { Loader2 } from 'lucide-react';

/**
 * Wraps children with an Axios request-interceptor that fetches
 * a fresh Clerk JWT before every outgoing request.
 *
 * IMPORTANT: This component blocks rendering until the Clerk auth
 * session is fully loaded and a valid token is obtained. This prevents
 * all child components from firing unauthenticated API requests during
 * the Clerk initialization window.
 */
export default function ApiProvider({ children }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Attach Axios request interceptor to inject fresh JWT
  const attachInterceptor = useCallback(() => {
    const id = client.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // token unavailable — continue unauthenticated
      }
      return config;
    });
    return id;
  }, [getToken]);

  useEffect(() => {
    const interceptorId = attachInterceptor();
    return () => {
      client.interceptors.request.eject(interceptorId);
    };
  }, [attachInterceptor]);

  // Wait for Clerk to fully load and eagerly set the token before rendering children
  useEffect(() => {
    if (!isLoaded) return;            // Clerk still initializing
    if (!isSignedIn) {
      setIsReady(true);               // Signed out — let children handle it
      return;
    }
    // Signed in: get token first, then allow children to render
    getToken()
      .then((token) => {
        setAuthToken(token);
        setIsReady(true);
      })
      .catch(() => {
        setIsReady(true);             // Proceed even if token fetch fails
      });
  }, [isLoaded, isSignedIn, getToken]);

  // Show a loading spinner while Clerk is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={36} className="animate-spin text-green-600" />
          <p className="text-sm font-medium text-slate-400">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
