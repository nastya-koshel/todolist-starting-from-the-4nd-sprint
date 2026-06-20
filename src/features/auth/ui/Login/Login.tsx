import { selectThemeMode } from "@/app/model/app-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInputs } from "src/features/auth/lib/types.ts"
import { loginSchema } from "@/features/auth/lib/schemas.ts"
import { loginTC } from "../../model/auth-slice"

// type LoginInputs = {
//   email: string
//   password: string
//   rememberMe: boolean
// }

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  const dispatch = useAppDispatch()
  // const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<LoginInputs>({
    defaultValues:
      { email: "free@samuraijs.com", password: "free", rememberMe: false },
    resolver: zodResolver(loginSchema)
  })
  const onSubmit = (data: LoginInputs) => {
    dispatch(loginTC(data))
    // ----- 3 -----
    //   .unwrap().then(() => {
    //   navigate(PATH.Main)
    // })
    reset()
  }

  // ----- 1 -----
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (isLoggedIn === true) {
  //     navigate(PATH.Main)
  //   }
  // }, [isLoggedIn])

  // -----⭐ 2 ⭐-----
  // if (isLoggedIn === true) {
  //   return <Navigate to={PATH.Main} />
  // }

  return (
    <Grid container justifyContent={"center"}>
      <FormControl>
        <FormLabel>
          <p>
            To login get registered
            <a
              style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <TextField error={!!errors.email} label="Email" margin="normal"
                       helperText={errors.email?.message} {...register("email"
              // {
              //   required: { value: true, message: "Email не должен быть пустым!" },
              //   minLength: { value: 5, message: "Слишком короткий email" },
              //   pattern: {
              //     value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,6}$/,
              //     message: "Введите правильный email"
              //   }
              // }
            )} />
            <TextField error={!!errors.password} helperText={errors.password?.message} type="password"
                       label="Password" margin="normal" {...register("password")} />

            {/*Controller*/}
            {/*<Controller name="email" control={control} render={({ field }) => (*/}
            {/*  <TextField error={!!errors.email} label="Email" margin="normal"*/}
            {/*             helperText={errors.email?.message} {...field} />*/}
            {/*)} />*/}

            {/*<Controller name="password" control={control} render={({ field }) => (*/}
            {/*  <TextField error={!!errors.password} helperText={errors.password?.message} type="password"*/}
            {/*             label="Password"*/}
            {/*             margin="normal"*/}
            {/*             {...field} />*/}
            {/*)} />*/}
            <FormControlLabel label="Remember me"
                              control={
                                <Controller name="rememberMe" control={control} render={({ field }) => (
                                  // <Checkbox onChange={(e) => field.onChange(e.target.checked)} checked={field.value} />
                                  <Checkbox {...field} checked={field.value} />
                                )} />} />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}


