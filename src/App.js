// routes
import { useEffect, useState } from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import LoginRouter from './LoginRouter';

// ----------------------------------------------------------------------

export default function App() {
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok !== null || tok !== '') {
      setLoggedIn(true);
      setToken(tok);
    }
  }, [loggedIn, token]);
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router loggedIn={loggedIn} token={token} />
    </ThemeProvider>
  );
}
