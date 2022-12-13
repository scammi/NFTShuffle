import React from "react";
import Grid from "@mui/material/Grid";

// Components 
import NftCard from "./NftCard";

const style = {
  nftsGrid: { 
    justifyContent: 'center',
  },
  nftGridItem: {
    paddingTop: 6,
    paddingRight: 1,
    paddingLeft: 1
  }
};

const NftDataArray = [1,2,3,4, 7, 8 ,9 ,10, 11];

const NftGrid = () => {

  const CardGidItem = () => {
    return (
      <Grid 
        item 
        sm={6}
        lg={3}
        sx={ style.nftGridItem }
      > 
        <NftCard /> 
      </Grid>
    );
  };

  return (
    <Grid container sx={style.nftsGrid}>
      { NftDataArray.map(() => <CardGidItem />  )}
    </Grid>
  );

};

export { NftGrid };