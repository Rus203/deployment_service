import * as yup from "yup";

export const authSchema = yup.object({
  login: yup.string().min(3).max(50).required(),
  password: yup.string().min(3).max(50).required("Login is required"),
}).required();
