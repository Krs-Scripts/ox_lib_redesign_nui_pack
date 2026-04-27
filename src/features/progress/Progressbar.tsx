import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text, keyframes } from '@mantine/core'; 
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const gelatine = keyframes({
  'from, to': { transform: 'scale(1, 1) perspective(1em) rotateZ(-4deg)' },
  '25%': { transform: 'scale(0.6, 1.3) perspective(1em) rotateZ(-4deg)' },
  '50%': { transform: 'scale(1.3, 0.6) perspective(1em) rotateZ(-4deg)' },
  '75%': { transform: 'scale(1.1, 1) perspective(1em) rotateZ(-4deg)' },
  '100%': { transform: 'scale(1, 1) perspective(1em) rotateZ(-4deg)' },
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '10%', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '3%', 
    position: 'absolute',
  },
  content: {
    width: '15%', 
    minWidth: 260, 
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    transform: 'perspective(1em) rotateZ(-4deg)',
    animation: `${gelatine} 0.6s ease-out`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    padding: '0 4px',
  },
  label: {
    fontSize: '1.7vh', 
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 'bold', 
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  },
  percentage: {
    fontSize: '1.7vh',
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
  track: {
    width: '100%',
    height: 18, 
    borderRadius: 8, 
    backgroundColor: 'rgba(0, 0, 0, 0.48)', 
    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#228be6', 
    borderRadius: 8, 
    boxShadow: '0 0 1em 0 #228be6', 
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setLabel(data.label);
    setDuration(data.duration);
    setPercentage(0);
    setVisible(true);
  });

  useEffect(() => {
    if (!visible || duration <= 0) return;

    const startTime = Date.now();
    let animationFrameId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentPercent = Math.min((elapsed / duration) * 100, 100);
      
      setPercentage(Math.floor(currentPercent));

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [visible, duration]);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          
          <Box className={classes.content}>
            
            <Box className={classes.header}>
              <Text className={classes.label}>{label}</Text>
              <Text className={classes.percentage}>{percentage}%</Text>
            </Box>

            <Box className={classes.track}>
              <Box
                className={classes.bar}
                onAnimationEnd={() => setVisible(false)}
                sx={{
                  animation: 'progress-bar linear',
                  animationDuration: `${duration}ms`,
                  width: '0%', 
                  animationFillMode: 'forwards'
                }}
              />
            </Box>

          </Box>

        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;