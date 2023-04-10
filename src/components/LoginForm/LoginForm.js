import { useContext, useEffect, useMemo, useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../services/firebase";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { PATHES } from "../../routes";
import { AuthContext } from "../../context/Auth";
import { Container, Grid, TextField, Button, FormControl, InputLabel } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

const InputForm = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const errorMessage = useMemo(() => {
    switch (error) {
      case "auth/invalid-email":
        return "Email address is not valid";
      case "auth/user-disabled":
        return "Email has been disabled";
      case "auth/user-not-found":
        return "User not found";
      case "auth/wrong-password":
        return "Password is invalid for the given email";
      default:
        return "Unknown error.";
    }
  }, [error]);

  const onLoginPress = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => setError(error.code))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authContext.user) {
      navigate(PATHES.ADD_TRANSACTION);
    }
  }, [authContext.user, navigate]);

  return (
    <Container sx={{
      backgroundColor: 'white',
      marginTop: '5%'
    }} maxWidth='sm'>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <form onSubmit={(e) => onLoginPress(e)}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <FormControl fullWidth>
                <TextField
                  label="Почта"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ><InputLabel id="email">Почта</InputLabel></TextField>
              
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Пароль"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {error ? (
                  <div className="error-text">{errorMessage}</div>
                ) : null}
                {loading ? (
                  <Spinner width="100" height="100"/>
                ) : (
                  <Button
                      variant="contained"
                      color="success"
                      type="submit"
                      endIcon={<LoginIcon />}
                      size="large"
                    >
                      Войти
                    </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InputForm;
