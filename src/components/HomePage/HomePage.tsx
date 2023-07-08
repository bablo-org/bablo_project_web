import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import BorderBox from '../UI/BorderBox';
import i18n from '../../i18n';

function HomePage() {
  const { t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(true);
  const handleClick = () => {
    if (!isEnglish) {
      setIsEnglish(true);
      i18n.changeLanguage('en-US');
    }
    if (isEnglish) {
      setIsEnglish(false);
      i18n.changeLanguage('ru');
    }
  };

  return (
    <>
      <BorderBox marginProp={2}>
        <>
          <Typography>{t('title')}</Typography>
          <Box
            component='img'
            src='https://wow.zamimg.com/modelviewer/live/webthumbs/npc/166/83622.webp'
          />
        </>
      </BorderBox>
      <Button onClick={handleClick}>язык менять</Button>
    </>
  );
}

export default HomePage;
