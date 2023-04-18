import { ChangeEvent, FC, MouseEvent, useState } from "react";

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

import { yupResolver } from '@hookform/resolvers/yup';
import { FormHelperText } from "@mui/material";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Link from "../../Components/Link/LInk";
import { useLoginUserMutation } from "../../services";
import { setCredentials } from "../../store/features";
import { useAppDispatch } from "../../store/hooks";
import FooterIllustrationsV1 from "../../views/pages/auth/FooterIllustrationsV1";
import { BoxStyled } from "./login.styles";
import { authSchema } from "../../schemas/AuthSchema";

interface State {
  password: string;
  showPassword: boolean;
}


type Inputs = {
  login: string;
  password: string;
};

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));




const Login: FC = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginUserMutation();
  const [resErrors, setResErrors] = useState<any>();
  const navigate = useNavigate();
  const [values, setValues] = useState<State>({
    password: "",
    showPassword: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(authSchema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const tokens = await login(data).unwrap();
      console.log(tokens);
      dispatch(setCredentials(tokens));
      navigate("/");
    } catch (error: unknown) {
      setResErrors(error)
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

  return (
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
            <FormControl fullWidth>
              <TextField
                error={!!errors.login?.message || !!resErrors?.data.message}
                fullWidth
                type="text"
                label="Login"
                onKeyDown={() => setResErrors(null)}
                {...register("login")}
              />
              <FormHelperText error>{errors.login?.message || resErrors?.data.message}</FormHelperText>
            </FormControl>
            <FormControl error={!!errors.password?.message || !!resErrors?.data.message} fullWidth sx={{ marginTop: 4 }}>
              <InputLabel htmlFor="auth-login-password">Password</InputLabel>
              <OutlinedInput
                label="Password"
                value={values.password}
                onKeyDown={() => setResErrors(null)}
                id="auth-login-password"
                {...register("password")}
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
              <FormHelperText error>{errors.password?.message || resErrors?.data.message}</FormHelperText>
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
  );
};

export default Login;
