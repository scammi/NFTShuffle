// Framework
import React from "react";

// MUI
import { Paper } from "@mui/material";

const PaperFloat = ({ children  }) => {
  return (
    <Paper elevation={3} >
      {children}
    </Paper>
  );
};

export default PaperFloat;
