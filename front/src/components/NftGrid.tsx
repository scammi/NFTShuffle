// Frameworks
import React from 'react';
import ReactCardCarousel from 'react-card-carousel';

// MUI
import Box from '@mui/material/Box';

// Components 
import NftCard from './NftCard';

const style = {
  nftsGrid: {
    position: "relative",
    top: 290
    // position: "static",
    // position: "absolute",
    // top: 300,
    // left: 500,
    // top: '150px'
    // height: "100px",
    // width: "100%",
    // display: "flex",
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "middle"
  },
  nftGridItem: {
    // position: "relative",
    // height: "100px",
    // width: "200px",
    // paddingTop: "80px",
    // color: "#FFF",
    // borderRadius: "10px",
    // boxSizing: "border-box",
    // paddingRight: 1,
    // paddingLeft: 1
  }
};

const NftDataArray = [1, 2, 3, 4, 5, 6, 7];

const NftGrid = () => {

  const CardGidItem = () => {
    return (
      <Box sx={style.nftGridItem}>
        <NftCard />
      </Box>
    );
  };

  return (
    <Box sx={style.nftsGrid}>
      <ReactCardCarousel autoplay={true} autoplay_speed={4000}>
        {NftDataArray.map(() => <CardGidItem />)}
      </ReactCardCarousel>
    </Box>
  );

};

export { NftGrid };