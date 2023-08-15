import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';

function App() {
  const matches = [
    { teams: "Team A vs Team B", date: "15/08/2023", time: "17:00", venue: "Stadium A", color: "#FF6B6B" },
    { teams: "Team C vs Team D", date: "16/08/2023", time: "19:00", venue: "Stadium B", color: "#1DD3BD" },
    // Add more match data as required.
  ];

  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1">Sudanese Tournament 2023 Schedule</Typography>
      </Box>

      <Grid container spacing={4}>
        {matches.map((match, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: match.color }}>
              <CardContent>
                <Typography variant="h6">{match.teams}</Typography>
                <Typography>Date: {match.date}</Typography>
                <Typography>Time: {match.time}</Typography>
                <Typography>Venue: {match.venue}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography>&copy; 2023 Sudanese Tournament. All Rights Reserved.</Typography>
      </Box>
    </Container>
  );
}

export default App;
