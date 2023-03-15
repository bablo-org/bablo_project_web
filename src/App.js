import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { initializeFirebase, auth, onAuthStateChanged } from './services/firebase';
import "./App.css";
import { useEffect, useState } from 'react';

initializeFirebase();

function App() {
  const [user, setUser] = useState();
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        setUser(user)
        setIsAuth(true);
        // ...
      } else {
        // User is signed out
        // ...
        setUser();
      }
    })
  }, []);

  return (
    <div className="App">
      {isAuth ? <HomePage onLogout={() => setIsAuth(false)}/> : <LoginPage/>}
    </div>
  );
}

export default App;
