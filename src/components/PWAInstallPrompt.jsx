import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Install the app for a better experience.');

  useEffect(() => {
    const beforeInstallHandler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setOpen(true);
    };

    const installedHandler = () => {
      setOpen(false);
      setDeferredPrompt(null);
      setMessage('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setMessage('Thanks for installing!');
    } else {
      setMessage('Install declined. You can try again anytime.');
    }

    setOpen(false);
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
      autoHideDuration={10000}
    >
      <Alert
        severity="info"
        action={
          <Button color="inherit" size="small" onClick={handleInstall}>
            Install
          </Button>
        }
        onClose={handleClose}
        sx={{ alignItems: 'center', backgroundColor: 'rgba(20, 20, 20, 0.95)', color: '#FFFFFF' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;
