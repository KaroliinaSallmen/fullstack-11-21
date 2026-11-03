import { useState } from "react";
import Error from "./Error";
import { TextField, Button, Stack } from "@mui/material";

const Login = ({ handleLogin, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Stack sx={{ p: 3 }}>
      <div>
        <Error error={error} />
        <h2>Log in to application</h2>
        <form onSubmit={(event) => handleLogin(event, username, password)}>
          <div>
            <TextField
              variant="standard"
              label="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              sx={{ mb: 2 }}
            />
          </div>
          <div>
            <TextField
              variant="standard"
              label="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              sx={{ mb: 2 }}
            />
          </div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </form>
      </div>
    </Stack>
  );
};

export default Login;
