import { Box, IconButton, Tooltip, Collapse, Paper, Slider, Typography, Switch, FormControlLabel } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import RoundedCornerIcon from '@mui/icons-material/RoundedCorner';
import OpacityIcon from '@mui/icons-material/Opacity';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react';

const colorPalettes = [
  {
    name: 'Purple & Red',
    primary: 'rgba(88, 86, 214, 0.85)',
    secondary: 'rgba(82, 97, 255, 0.85)',
    background: 'rgba(255, 255, 255, 0.8)',
    text: 'rgba(0, 0, 0, 0.87)',
  },
  {
    name: 'Blue & Orange',
    primary: 'rgba(33, 150, 243, 0.85)',
    secondary: 'rgba(255, 152, 0, 0.85)',
    background: 'rgba(255, 255, 255, 0.8)',
    text: 'rgba(0, 0, 0, 0.87)',
  },
  {
    name: 'Green & Purple',
    primary: 'rgba(76, 175, 80, 0.85)',
    secondary: 'rgba(156, 39, 176, 0.85)',
    background: 'rgba(255, 255, 255, 0.8)',
    text: 'rgba(0, 0, 0, 0.87)',
  },
  {
    name: 'Teal & Pink',
    primary: 'rgba(0, 150, 136, 0.85)',
    secondary: 'rgba(233, 30, 99, 0.85)',
    background: 'rgba(255, 255, 255, 0.8)',
    text: 'rgba(0, 0, 0, 0.87)',
  },
  {
    name: 'Dark Mode',
    primary: 'rgba(144, 202, 249, 0.85)',
    secondary: 'rgba(255, 167, 38, 0.85)',
    background: 'rgba(18, 18, 18, 0.8)',
    text: 'rgba(255, 255, 255, 0.87)',
  },
  {
    name: 'Sunset',
    primary: 'rgba(255, 87, 34, 0.85)',
    secondary: 'rgba(255, 235, 59, 0.85)',
    background: 'rgba(255, 255, 255, 0.8)',
    text: 'rgba(0, 0, 0, 0.87)',
  },
];

function ColorPaletteSwitcher({ onPaletteChange, onStyleChange }) {
  const [expanded, setExpanded] = useState(false);
  const [blurAmount, setBlurAmount] = useState(10);
  const [borderRadius, setBorderRadius] = useState(8);
  const [opacity, setOpacity] = useState(0.85);
  const [glassEffect, setGlassEffect] = useState(true);
  const [currentPalette, setCurrentPalette] = useState(colorPalettes[0]);
  const [open, setOpen] = useState(false);
  const [netflixStyle, setNetflixStyle] = useState(false);

  const handlePaletteChange = (palette) => {
    setCurrentPalette(palette);
    onPaletteChange(palette);
  };

  const handleBlurChange = (event, newValue) => {
    setBlurAmount(newValue);
    onStyleChange({ blurAmount: newValue });
  };

  const handleBorderRadiusChange = (event, newValue) => {
    setBorderRadius(newValue);
    onStyleChange({ borderRadius: newValue });
  };

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue);
    onStyleChange({ opacity: newValue });
  };

  const handleGlassEffectChange = (event) => {
    setGlassEffect(event.target.checked);
    onStyleChange({ glassEffect: event.target.checked });
  };

  const handleNetflixStyleChange = (event) => {
    const newValue = event.target.checked;
    setNetflixStyle(newValue);
    onStyleChange({ netflixStyle: newValue });
  };

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Style Settings">
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Collapse in={open} timeout={500}>
        <Paper
          sx={{
            position: 'absolute',
            bottom: 48,
            right: 0,
            p: 1,
            width: 250,
            maxHeight: 300,
            overflow: 'auto',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/*<Typography variant="h6" gutterBottom>
            Color Palette
          </Typography>*/}

          <FormControlLabel
            control={
              <Switch
                checked={netflixStyle}
                onChange={handleNetflixStyleChange}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LiveTvIcon />
                <Typography>Netflix Style</Typography>
              </Box>
            }
          />

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', maxWidth: '250px' }}>
            {colorPalettes.map((palette, index) => (
              <Tooltip key={index} title={palette.name}>
                <IconButton
                  onClick={() => handlePaletteChange(palette)}
                  sx={{
                    width: 28,
                    height: 28,
                    p: 0,
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </IconButton>
              </Tooltip>
            ))}
          </Box>

          <IconButton onClick={handleExpandToggle} sx={{ mb: 1 }}>
            <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
          </IconButton>

          <Collapse in={expanded}>
            <Box sx={{ pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  Blur Amount
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BlurOnIcon sx={{ fontSize: 20 }} />
                  <Slider
                    value={blurAmount}
                    onChange={handleBlurChange}
                    min={0}
                    max={20}
                    step={1}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  Border Radius
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RoundedCornerIcon sx={{ fontSize: 20 }} />
                  <Slider
                    value={borderRadius}
                    onChange={handleBorderRadiusChange}
                    min={0}
                    max={16}
                    step={1}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  Opacity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <OpacityIcon sx={{ fontSize: 20 }} />
                  <Slider
                    value={opacity}
                    onChange={handleOpacityChange}
                    min={0.5}
                    max={1}
                    step={0.05}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={glassEffect}
                    onChange={handleGlassEffectChange}
                    size="small"
                  />
                }
                label="Glass Effect"
                sx={{ mt: 1 }}
              />
            </Box>
          </Collapse>
        </Paper>
      </Collapse>
    </Box>
  );
}

export default ColorPaletteSwitcher; 