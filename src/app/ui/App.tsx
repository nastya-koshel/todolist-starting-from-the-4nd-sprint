import "./App.css"
import { Header } from "@/common/components/Header/Header.tsx"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { selectThemeMode } from "@/app/model/app-slice.ts"
import { ErrorSnackBar } from "@/common/components"
import { Routing } from "@/app/ui/Routing/Routing.tsx"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackBar />
      </div>
    </ThemeProvider>
  )
}
