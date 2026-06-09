import styles from "./PageNotFound.module.css"
import { PATH } from "@/app/ui/Routing/Routing.tsx"
import Button from "@mui/material/Button"
import { Link } from "react-router"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button component={Link} to={PATH.Main} sx={buttonStyles}>
      Вернуться на главную
    </Button>
    {/*<a className={styles.link} href={PATH.Main}>На главную</a>*/}
  </>
)

const buttonStyles = {
  fontSize: "20px",
  fontWeight: "bold",
  textDecoration: "none",
  margin: "30px auto 0 auto",
  padding: "10px 20px",
  background: "#087EA4",
  border: "2px solid #087EA4",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",


  "&:hover": {
    background: "#fff",
    border: "2px solid #087EA4",
    color: "#087EA4",
    fontWeight: "bold",
  },
};