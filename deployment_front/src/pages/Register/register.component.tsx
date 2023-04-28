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

import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import FooterIllustrationsV1 from "../../views/pages/auth/FooterIllustrationsV1";

import { SubmitHandler, useForm } from "react-hook-form";
import { BoxStyled } from "./register.styles";
import { FormHelperText } from "@mui/material";
import Link from "../../Components/Link/LInk";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services";
import { authSchema } from "../../schemas/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

interface State {
  password: string;
  showPassword: boolean;
}

type Inputs = {
  login: string;
  password: string;
};

const Register: FC = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [resErrors, setResErrors] = useState<any>();

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
      await registerUser(data).unwrap();
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
              Nice to meet you 🚀
            </Typography>
            <Typography variant="body2">
              Make your app management easy and fun!
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
  );
};

export default Register;
