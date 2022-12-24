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
    top: 240
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

const NftDataArray = [
  {
    name: 'Tree God',
    imageUrl: 'https://ipfs.io/ipfs/QmdXgNrYqPMAKHAzAgDLYcEGwdW86b78RfnpKWfFnBERNZ'
  },
  {
    name: 'Golden Tree',
    imageUrl: 'https://ipfs.io/ipfs/QmcWuSNUysTMaXjMnd3tikF9AFEH7rLL7fRBtTwrwTqpSB'
  },
  {
    name: 'Witch Tree',
    imageUrl: 'https://chargedparticles.infura-ipfs.io/ipfs/QmTowmErFfXvur4Zhd2MrK7p4AA4SWMToGXe7i6ZWQrPd7'
  },
] 

const NftGrid = () => {

  const CardGidItem = ({ nftName, nftImageUrl }) => {
    return (
      <Box sx={style.nftGridItem}>
        <NftCard name={nftName} imageUrl={nftImageUrl}/>
      </Box>
    );
  };

  return (
    <Box sx={style.nftsGrid}>
      <ReactCardCarousel autoplay={true} autoplay_speed={4000}>
        {NftDataArray.map((tree) => <CardGidItem nftName={tree.name} nftImageUrl={tree.imageUrl} />)}
      </ReactCardCarousel>
    </Box>
  );

};

export { NftGrid };