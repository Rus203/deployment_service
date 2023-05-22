import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import FooterIllustrationsV1 from "../../views/pages/auth/FooterIllustrationsV1";

import { FormHelperText } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Link from "../../Components/Link/LInk";
import { useRegisterUserMutation } from "../../services";
import { BoxStyled, StyledAlertContainer } from "./register.styles";
import Alert from "../../Components/Alert";

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

interface State {
  password: string;
  showPassword: boolean;
}

type Inputs = {
  email: string;
  password: string;
  name: string
};

const Register: FC = () => {
  const [isShowAlert, setShowAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();


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
    try {
      await registerUser(data).unwrap();
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setShowAlert(true);
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
                Nice to meet you 🚀
              </Typography>
              <Typography variant="body2">
                Make your app management easy and fun!
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth>
                <TextField
                  error={!!errors.name?.message}
                  fullWidth
                  type="text"
                  label="Name"
                  focused
                  {...register("name", {
                    required: 'Name is required',
                    maxLength: 49
                  })}
                />
                {errors.name && (
                  <FormHelperText>{errors.name.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 4 }}>
                <TextField
                  error={!!errors.email?.message}
                  fullWidth
                  type="email"
                  label="Email"
                  {...register("email", {
                    required: 'Email is required',
                    maxLength: 63,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please Enter a valid Email!"
                    }
                  })}
                />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl error={!!errors.password?.message} fullWidth sx={{ marginTop: 4 }}>
                <TextField
                  label="Password"
                  id="auth-login-password"
                  type={values.showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    validate: (value) => value.length <= 49 || 'Too many characters'
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ marginBottom: 7, marginTop: 7 }}
              >
                Sign up
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
                  Already have an account?
                </Typography>
                <Typography variant="body2">
                  <Link href="/login">Sign in instead</Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
      </BoxStyled>
      {(errorMessage !== null && isShowAlert)
        ? <Alert error={errorMessage} />
        : null
      }
    </>
  );
};

export default Register;
