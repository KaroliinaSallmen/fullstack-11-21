import { Alert } from "@mui/material";

const Error = ({ error }) => {
  if (error === null) {
    return null;
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity="error">
      {error}
    </Alert>
  );
};

export default Error;
