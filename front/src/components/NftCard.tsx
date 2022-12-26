import React from 'react';

import Card from  '@mui/material/Card'
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PaperFloat from './PaperFloat';

const NftCard = ({
  imageUrl,
  name,
}) => {
  return (
    <PaperFloat>
      <Card>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {name} 
          </Typography>
        </CardContent>
      </Card>
    </PaperFloat>
  );
};

export default NftCard;