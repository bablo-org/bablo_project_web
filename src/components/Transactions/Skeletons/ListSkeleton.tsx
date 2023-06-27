import { Box, Grid, Divider, Avatar } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { nanoid } from '@reduxjs/toolkit';
import BorderBox from '../../UI/BorderBox';

function ListSkeleton() {
  return (
    <BorderBox
      borderRadius={2}
      marginProp={4}
      style={{
        padding: 4,
      }}
    >
      <>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Skeleton animation='wave' height={41} width='30%' />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                container
                spacing={2}
                flexDirection='row'
                sx={{ justifyContent: { xs: 'left', md: 'right' } }}
              >
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Skeleton animation='wave' height='41px' />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Skeleton animation='wave' height='41px' />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Skeleton animation='wave' height='41px' />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ marginTop: 1, marginBottom: 2 }} />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {Array.from(Array(18)).map(() => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={nanoid()}>
                  <BorderBox
                    marginProp={0}
                    borderRadius={2}
                    style={{
                      height: '100%',
                      padding: 1,
                    }}
                  >
                    <>
                      <Box display='flex' justifyContent='right'>
                        <Skeleton animation='wave' width='20%' />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='left'
                      >
                        <Skeleton variant='circular'>
                          <Avatar />
                        </Skeleton>
                        <Skeleton
                          animation='wave'
                          width='30%'
                          height='30%'
                          sx={{ marginLeft: 1 }}
                        />
                      </Box>
                      <Skeleton animation='wave' />
                      <Skeleton
                        sx={{ height: 100 }}
                        animation='wave'
                        variant='rectangular'
                      />
                      <Skeleton animation='wave' width='50%' />
                      <Skeleton animation='wave' width='50%' />
                    </>
                  </BorderBox>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </>
    </BorderBox>
  );
}

export default ListSkeleton;
