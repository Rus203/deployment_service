import { ChangeEvent, FC, MouseEvent, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { Alert, FormHelperText } from "@mui/material";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Link from "../../Components/Link/LInk";
import { useLoginUserMutation } from "../../services";
import { setCredentials } from "../../store/features";
import { useAppDispatch } from "../../store/hooks";
import FooterIllustrationsV1 from "../../views/pages/auth/FooterIllustrationsV1";
import { BoxStyled, StyledAlert } from "./login.styles";

interface State {
  password: string;
  showPassword: boolean;
}


type Inputs = {
  email: string;
  password: string;
};

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const Login: FC = () => {
  const dispatch = useAppDispatch();
  const [isShowAlert, setShowAlert] = useState<boolean>(false);
  const [login] = useLoginUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [values, setValues] = useState<State>({
    password: "",
    showPassword: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    try {
      const answer = await login(data).unwrap()
      dispatch(setCredentials(answer));
      navigate("/");
    } catch (error: any) {
      setShowAlert(true);
      console.log(error)
      setErrorMessage(error.data.message);
    }
  };

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isShowAlert) {
      console.log('show alert');
      const timerId = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timerId);
    }
  }, [isShowAlert])

  return (
    <>
    <BoxStyled>
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ padding: "36px" }}
        >
          <Box
            sx={{
              mb: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.5rem !important",
              }}
            >
              Innowise
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              Welcome to Innowise! 👋🏻
            </Typography>
            <Typography variant="body2">
              Please sign-in to your account and start the adventure
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ marginTop: 4 }}>
              <TextField
                error={!!errors.email?.message}
                fullWidth
                type="email"
                label="Email"
                { ...register("email", {
                  required: 'Email is required',
                  validate: value => value.length <= 49 || 'Too many characters',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: "Please enter a valid Email!"
                }
                })}
              />
              {errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={!!errors.password?.message} fullWidth sx={{ marginTop: 4 }}>
              <InputLabel htmlFor="auth-login-password">Password</InputLabel>
              <OutlinedInput
                label="Password"
                value={values.password}
                id="auth-login-password"
                {...register("password", {
                  required: 'Password is required',
                  validate: value => value.length <= 49 || 'Too many characters'
                })}
                onChange={handleChange("password")}
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label="toggle password visibility"
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>{errors.password?.message}</FormHelperText>
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
            </Box>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ marginBottom: 7 }}
              type="submit"
            >
              Login
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant="body2">
                <Link href="/register">Create an account</Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </BoxStyled>
      {(errorMessage !== null && isShowAlert)
      ? <StyledAlert>
          <Alert severity="error">{errorMessage}</Alert>
        </StyledAlert>
      : null
      }
    </>
  );
};

export default Login;
