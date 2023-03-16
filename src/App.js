import {
  initializeFirebase,
  auth,
  onAuthStateChanged,
} from "./services/firebase";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./context/Auth";
import router from "./routes";
import { RouterProvider } from "react-router-dom";

initializeFirebase();

function App() {
  const [user, setUser] = useState();
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const authContextValue = useMemo(
    () => ({
      isAuth: Boolean(isAuth),
      user,
    }),
    [user, isAuth]
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        setUser(user);
        setIsAuth(true);
        // ...
      } else {
        // User is signed out
        // ...
        setUser();
      }
    });
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{...authContextValue, setIsAuth, setUser}}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
