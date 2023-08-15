import React from 'react';
import { CssBaseline, Paper } from '@mui/material';
import './App.css';

function App() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CssBaseline />
      <Paper elevation={5} style={{ height: '100%', overflow: 'auto' }}>
        <iframe 
          src="https://challonge.com/ap65jpda/module" 
          style={{ display: 'block', width: '100%', height: '100%', border: 'none' }} 
          scrolling="auto" 
          allowtransparency="true"
          title="Tournament Bracket"
        />
      </Paper>
    </div>
  );
}

export default App;
