import { changeThemeModeAC, selectStatus, selectThemeMode } from "@/app/model/app-slice.ts"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
// import { getTheme } from "@/common/theme"
import { containerSx } from "@/common/styles"
import { NavButton } from "@/common/components"
import { LinearProgress } from "@mui/material"
import { logoutTC, selectIsLoginIn, selectLogin } from "@/features/auth/model/auth-slice.ts"
import { PATH } from "@/app/ui/Routing/Routing.tsx"
import { NavLink } from "react-router"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectStatus)
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoginIn)
  const login = useAppSelector(selectLogin)

  // const theme = getTheme(themeMode)
  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }
  const logoutHandler = () => {
    dispatch(logoutTC())
  }
//background={theme.palette.primary.dark}
  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit" href="/">
            <MenuIcon />
          </IconButton>
          <div>
            {login}
            {isLoggedIn
              ? <NavButton style={{ color: "#FFF", textDecoration: "none" }} onClick={logoutHandler}>Logout</NavButton>
              : <NavButton ><NavLink to={PATH.Login} style={{ color: "#FFF", textDecoration: "none" }}>Login</NavLink></NavButton>
            }
            <NavButton><NavLink to={PATH.Faq} style={{ color: "#FFF", textDecoration: "none" }}>Faq</NavLink></NavButton>
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && (<LinearProgress />)}
    </AppBar>
  )
}
