import * as React from "react"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { changeErrorAC, selectError } from "@/app/model/app-slice.ts"

export const ErrorSnackBar = () => {
  const error = useAppSelector(selectError)
  const dispatch = useAppDispatch()

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(changeErrorAC({error: null}))
  }

  return (
    <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert
        onClose={handleClose}
        severity="error"
        variant="standard"
      >
        {error}
      </Alert>
    </Snackbar>
  )
}
