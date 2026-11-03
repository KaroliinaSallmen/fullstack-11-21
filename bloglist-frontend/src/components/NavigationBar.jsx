import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container } from "@mui/material";

const NavigationBar = ({ user, handleLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>Blog App</Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{ marginLeft: "auto" }}
        >
          blogs
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/create">
              new blog
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
