import React from 'react';
import { createStyles, keyframes, RingProgress, Stack, Text } from '@mantine/core'; 
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

// ORIGINALE INTOCCATO: 33.5 is the r of the circle
const progressCircle = keyframes({
  '0%': { strokeDasharray: `0, ${33.5 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${33.5 * 2 * Math.PI}, 0` },
});

const useStyles = createStyles((_theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
   
    '> svg > circle': {
      strokeWidth: '8px !important', 
    },
 
    '> svg > circle:nth-child(1)': {
      stroke: 'rgba(0, 0, 0, 0.48) !important', 
    },
    
    '> svg > circle:nth-child(2)': {
      transition: 'none',
      stroke: '#0084e6 !important',
      strokeLinecap: 'round', 
      filter: 'drop-shadow(0 0 4px rgba(0, 132, 230, 0.6))',
      animation: `${progressCircle} linear forwards`,
      animationDuration: `${params.duration}ms`,
    },
  },
  value: {
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 900,
    textShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
    color: '#ffffff',
  },
  label: {
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 900,
    textTransform: 'uppercase',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
    color: '#ffffff',
    height: 25,
    marginTop: 5,
    fontSize: 9, 
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    transform: 'scale(1.8)', 
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <Stack spacing={0} className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Stack spacing={0} align="center" className={classes.wrapper}>
            <RingProgress
              size={90}      
              thickness={7}  
              sections={[{ value: 0, color: '#0084e6' }]} 
              onAnimationEnd={() => setVisible(false)}
              className={classes.progress}
              label={<Text className={classes.value}>{value}%</Text>}
            />
            {label && <Text className={classes.label}>{label}</Text>}
          </Stack>
        </ScaleFade>
      </Stack>
    </>
  );
};

export default CircleProgressbar;