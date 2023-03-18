import {
  initializeFirebase,
  auth,
  onAuthStateChanged,
} from "./services/firebase";
import "./App.css";
import { useEffect, useState } from "react";
import { AuthContext } from "./context/Auth";
import router from "./routes";
import { RouterProvider } from "react-router-dom";

initializeFirebase();

function App() {
  const [user, setUser] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoaded(true);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        setUser(user);
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
    <div className="App">
      <AuthContext.Provider value={{user, setUser}}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
