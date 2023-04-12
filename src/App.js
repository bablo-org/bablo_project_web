import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  initializeFirebase,
  auth,
  onAuthStateChanged,
} from './services/firebase';
import './App.css';
import { AuthContext } from './context/Auth';
import router from './routes';
import { defaultQueryFn } from './queries';

initializeFirebase();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const [user, setUser] = useState();
  const [loaded, setLoaded] = useState(false);

  const authContext = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setLoaded(true);
      if (currentUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        setUser(currentUser);
        // ...
      } else {
        // User is signed out
        // ...
        setUser();
      }
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authContext}>
          <RouterProvider router={router} />
        </AuthContext.Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
