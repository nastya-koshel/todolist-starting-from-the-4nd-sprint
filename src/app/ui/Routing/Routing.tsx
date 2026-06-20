import { Route, Routes } from "react-router"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { Main } from "@/app/ui/Main/Main.tsx"
import { PageNotFound } from "@/common/components"
import Faq from "@/common/components/Faq.tsx"
import { ProtectedRoute } from "@/common/ProtectedRoute/ProtectedRoute.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoginIn } from "@/features/auth/model/auth-slice.ts"

export const PATH = {
  Main: "/",
  Login: "/login",
  Faq: "/faq",
  NotFound: "/*"
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoginIn)

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isLoggedIn === false} redirectPath={PATH.Login}/>}>
          <Route path={PATH.Faq} element={<Faq />} />
          <Route path={PATH.Main} element={<Main />} />
      </Route>

      <Route element={<ProtectedRoute isAllowed={isLoggedIn === true} redirectPath={PATH.Main} />}>
        <Route path={PATH.Login} element={<Login />} />
      </Route>

      <Route path={PATH.NotFound} element={<PageNotFound />} />

      {/*<Route path={PATH.Main} element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={PATH.Login}><Main /></ProtectedRoute>} />*/}
      {/*<Route path={PATH.Login} element={<ProtectedRoute isAllowed={isLoggedIn} redirectPath={PATH.Main}><Login /></ProtectedRoute>} />*/}
      {/*<Route path={PATH.Faq} element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={PATH.Login}><Faq /></ProtectedRoute>} />*/}
    </Routes>
  )
}
