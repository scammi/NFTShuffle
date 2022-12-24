import React from 'react';

import Card from  '@mui/material/Card'
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PaperFloat from './PaperFloat';

const NftCard = () => {
  return (
    <PaperFloat>
      <Card>
        <CardMedia
          component="img"
          image="https://ipfs.io/ipfs/QmdXgNrYqPMAKHAzAgDLYcEGwdW86b78RfnpKWfFnBERNZ"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
        </CardContent>
      </Card>
    </PaperFloat>
  );
};

export default NftCard;