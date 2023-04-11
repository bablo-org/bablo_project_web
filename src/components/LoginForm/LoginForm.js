import { useContext, useEffect, useMemo, useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { PATHES } from "../../routes";
import { AuthContext } from "../../context/Auth";
import { Container, Grid, TextField, FormControl, FormHelperText } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Box } from "@mui/system";
import classes from "./LoginForm.module.css";
import Logo from "../../BabloLogo.png";
import { validationProps } from "../../utils/validationForm";
import LoadingButton from "@mui/lab/LoadingButton";

const InputForm = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
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
  const { email } = validationProps;
  const isEmailError = useMemo(
    () => !!(enteredEmail && email.testEmail(enteredEmail)),
    [enteredEmail]
  );
  const choseEmailTextHelper = useMemo(() => {
    if (!enteredEmail) {
      return email.title;
    } else if (isEmailError) {
      return email.errorTitle;
    }
  }, [enteredEmail]);
console.log(error);
  const onLoginPress = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      .catch((error) => setError(error.code))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authContext.user) {
      navigate(PATHES.ADD_TRANSACTION);
    }
  }, [authContext.user, navigate]);

  return (
    <Container
      sx={{
        backgroundColor: "white",
        marginTop: "5%",
      }}
      maxWidth="sm"
    >
      <Box
        sx={{
          backgroundImage: `url(${Logo})`,
          backgroundSize: "contain",
          width: { xs: 250, md: 250 },
          height: { xs: 250, md: 250 },
          margin: "auto",
        }}
      />
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
                    value={enteredEmail}
                    onChange={(e) => setEnteredEmail(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    className={enteredEmail && classes.valid}
                    inputProps={{
                      inputMode: "email",
                      pattern: email.inputPropsPattern,
                      title: email.errorTitle,
                    }}
                    helperText={choseEmailTextHelper}
                    error={isEmailError}
                  ></TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    label="Пароль"
                    type="password"
                    id="password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    className={enteredPassword && classes.valid}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <FormHelperText error={!!(error)}>{error && errorMessage}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="success"
                  type="submit"
                  endIcon={<LoginIcon />}
                  size="large"
                >
                  Войти
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InputForm;
