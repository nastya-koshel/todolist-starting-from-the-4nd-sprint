import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm.tsx"
import {createTodolistTC} from "@/features/todolists/model/todolists-slice.ts"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { useAppDispatch } from "@/common/hooks"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists.tsx"

export const Main = () => {
  const dispatch = useAppDispatch()
  const createTodolist = (title: string) => {
    dispatch(createTodolistTC(title))
  }
  // const isLoggedIn = useAppSelector(selectIsLoginIn)
  //
  // if (isLoggedIn === false) {
  //   return <Navigate to={PATH.Login} />
  // }


  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolist} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
