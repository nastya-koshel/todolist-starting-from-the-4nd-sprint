import { changeThemeModeAC, selectStatus, selectThemeMode } from "@/app/model/app-slice.ts"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { containerSx } from "@/common/styles"
import { NavButton } from "@/common/components"
import { LinearProgress } from "@mui/material"
import { NavLink } from "react-router"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectStatus)
  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)
  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit" href="/">
              <MenuIcon />
          </IconButton>
          <div>
            <NavButton><NavLink to={"/login"} style={{color: "#FFF", textDecoration: "none"}}>Sign in</NavLink></NavButton>
            <NavButton>Sign up</NavButton>
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && (<LinearProgress />)}
    </AppBar>
  )
}
