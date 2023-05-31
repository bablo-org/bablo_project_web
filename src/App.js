import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './store/hooks/hooks';
import {
  initializeFirebase,
  auth,
  onAuthStateChanged,
} from './services/firebase';
import './App.css';
import router from './routes';
import { defaultQueryFn } from './queries';
import { setUser, clearUser } from './store/slices/auth';
import SnackbarMessage from './components/SnackbarMessage/SnackbarMessage';

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
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setLoaded(true);
      if (currentUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
          }),
        );
        // ...
      } else {
        // User is signed out
        // ...
        dispatch(clearUser());
      }
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <SnackbarMessage />
      </QueryClientProvider>
    </div>
  );
}

export default App;
