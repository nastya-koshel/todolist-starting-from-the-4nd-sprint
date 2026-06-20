import { Navigate, Outlet } from "react-router"
import { ReactNode } from "react"

type ProtectedRouteProps = {
  children?: ReactNode,
  isAllowed: boolean,
  redirectPath: string
}

export const ProtectedRoute = ({ isAllowed, children, redirectPath }: ProtectedRouteProps) => {
  if (isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return children || <Outlet />
}

//  if (isLoggedIn === true) {
//     return <Navigate to={PATH.Main} />
//   }