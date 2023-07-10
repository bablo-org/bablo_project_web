import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BorderBox from '../UI/BorderBox';

function HomePage() {
  const { t } = useTranslation();

  return (
    <BorderBox marginProp={2}>
      <>
        <Typography>{t('homePage.welcome')}</Typography>
        <Box
          component='img'
          src='https://wow.zamimg.com/modelviewer/live/webthumbs/npc/166/83622.webp'
        />
      </>
    </BorderBox>
  );
}

export default HomePage;
