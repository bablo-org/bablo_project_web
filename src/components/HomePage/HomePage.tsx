import { Box, Typography } from '@mui/material';
import BorderBox from '../UI/BorderBox';

function HomePage() {
  return (
    <BorderBox marginProp={2}>
      <>
        <Typography>Большегриб</Typography>
        <Box
          component='img'
          src='https://wow.zamimg.com/modelviewer/live/webthumbs/npc/166/83622.webp'
        />
      </>
    </BorderBox>
  );
}

export default HomePage;
