// Framework
import React from "react";

// MUI
import { Paper } from "@mui/material";

const PaperFloat = ({ children  }) => {
  return (
    <Paper 
      sx={{
        elevation: 2,
        borderRadius: 2,
        boxShadow: 1,
        ':hover' : {
          boxShadow: 3,
          elevation: 5,
        }
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperFloat;
