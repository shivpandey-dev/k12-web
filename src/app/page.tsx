import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Typography variant="h3" component="h1">
          KidzDiary
        </Typography>
        <Typography color="text.secondary">Frontend base is running.</Typography>
      </Box>
    </Container>
  );
}
