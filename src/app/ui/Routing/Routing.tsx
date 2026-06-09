import { Route, Routes } from "react-router"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { Main } from "@/app/ui/Main/Main.tsx"
import { PageNotFound } from "@/common/components"

export const PATH = {
  Main: "/",
  Login: "/login",
  NotFound: "/*",
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route path={PATH.Main} element={<Main />} />
      <Route path={PATH.Login} element={<Login />} />
      <Route path={PATH.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
