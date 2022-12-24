// Frameworks
import React from 'react';
import ReactCardCarousel from 'react-card-carousel';

// MUI
import Grid from '@mui/material/Grid';

// Components 
import NftCard from './NftCard';

const style = {
  nftsGrid: {
    // justifyContent: 'center',
  },
  nftGridItem: {
    // height: "200px",
    // width: "200px",
    // paddingTop: "80px",
    // textAlign: "center",
    // background: "#52C0F5",
    // color: "#FFF",
    // fontFamily: "sans-serif",
    // fontSize: "12px",
    // textTransform: "uppercase",
    // borderRadius: "10px",
    // boxSizing: "border-box" 
    // paddingTop: 6,
    // paddingRight: 1,
    // paddingLeft: 1
  }
};

const NftDataArray = [1, 2, 3, 4, 5, 6, 7];

const NftGrid = () => {

  const CardGidItem = () => {
    return (
      <Grid
        item
        sx={style.nftGridItem}
      >
        <NftCard />
      </Grid>
    );
  };

  return (
    <Grid container sx={style.nftsGrid}>
      <ReactCardCarousel autoplay={true} autoplay_speed={2500} initial_index={5}>
        {NftDataArray.map(() => <CardGidItem />)}
      </ReactCardCarousel>
    </Grid>
  );

};

export { NftGrid };