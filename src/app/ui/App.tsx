import { Header } from "@/common/components/Header/Header.tsx"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { selectThemeMode } from "@/app/model/app-slice.ts"
import { ErrorSnackBar } from "@/common/components"
import { Routing } from "@/app/ui/Routing/Routing.tsx"
import { useEffect, useState } from "react"
import { meTC } from "@/features/auth/model/auth-slice.ts"
import { CircularProgress } from "@mui/material"
import s from "./App.module.css"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  const dispatch = useAppDispatch()
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    dispatch(meTC())
      .finally(() => {
        setIsInit(true)
      })
  }, [])

  if (!isInit) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={s.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackBar />
      </div>
    </ThemeProvider>
  )
}
