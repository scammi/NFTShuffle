import React from "react";
import { Grid } from "@mui/material";

// Components 
import NftCard from "./NftCard";

const style = {
  nftsGrid: { justifyContent: 'center'},
};

const NftDataArray = [1,2,3,4];
const NftGrid = () => {

  const CardGidItem = () => {
    return (<Grid item> <NftCard /> </Grid>);
  }

  return (
    <Grid container sx={style.nftsGrid}>
      { NftDataArray.map(() => <CardGidItem />  )}
    </Grid>
  );

};

export { NftGrid };