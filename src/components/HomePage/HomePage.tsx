import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import i18n from '../../i18n';
import BorderBox from '../UI/BorderBox';

function HomePage() {
  const { t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(true);
  const lng = useMemo(() => {
    return i18n.language;
  }, [i18n.language]);

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
          <Typography>{t('homePage.sexyMushroom')}</Typography>
          <Box
            component='img'
            src='https://wow.zamimg.com/modelviewer/live/webthumbs/npc/166/83622.webp'
          />
        </>
      </BorderBox>
      <Button onClick={handleClick} variant='contained'>
        <Box display='flex' flexDirection='column'>
          {t('homePage.languageChangeButton')}
          <Typography align='center'>{lng}</Typography>
        </Box>
      </Button>
    </>
  );
}

export default HomePage;
