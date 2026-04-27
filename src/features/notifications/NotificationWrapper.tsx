import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster, ToastPosition } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, Group, keyframes, Stack, Text, ThemeIcon } from '@mantine/core';
import React from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10, 
    width: 300,
  },
  container: {
    width: '100%',
    height: 'fit-content',
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    color: theme.colors.dark[0],
    padding: '14px 16px',
    borderRadius: 15,
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.2,
    color: '#fff',
  },
  description: {
    fontSize: 13,
    color: '#cacaca',
    lineHeight: 'normal',
    marginTop: 2,
  },
  progressWrapper: {
    width: '65%', 
    height: 8,    
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 100,
  },
}));

const shrink = keyframes({
  from: { width: '100%' },
  to: { width: '0%' },
});

const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: { opacity: visible ? 0 : 1, transform: `translate${from}` },
  to: { opacity: visible ? 1 : 0, transform: `translate${to}` },
});

const getAnimation = (visible: boolean, position: string) => {
  const options = visible ? '0.25s ease-out forwards' : '0.3s ease-in forwards';
  const animation = visible 
    ? { from: 'Y(-20px)', to: 'Y(0px)' } 
    : { from: 'X(0px)', to: 'X(120%)' };
  return `${createAnimation(animation.from, animation.to, visible)} ${options}`;
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const duration = data.duration || 3000;
    let iconColor: string;
    let iconName = data.icon;
    
    let position: ToastPosition = 'top-right'; 
    if (data.position) {
      if (data.position === 'top') position = 'top-center';
      else if (data.position === 'bottom') position = 'bottom-center';
      else position = data.position as ToastPosition;
    }

    const colors = {
      success: '#91eb00',
      error: '#fa5252',
      warning: '#fab005',
      info: '#0084e6'
    };

    if (!iconName) {
      switch (data.type) {
        case 'success': iconName = 'circle-check'; iconColor = colors.success; break;
        case 'error': iconName = 'circle-xmark'; iconColor = colors.error; break;
        case 'warning': iconName = 'triangle-exclamation'; iconColor = colors.warning; break;
        default: iconName = 'circle-info'; iconColor = colors.info; break;
      }
    } else {
      iconColor = colors[data.type as keyof typeof colors] || colors.info;
    }

    if (data.iconColor) iconColor = tinycolor(data.iconColor).toRgbString();

    toast.custom(
      (t) => (
        <Box
          className={classes.wrapper}
          style={{ animation: getAnimation(t.visible, position) }}
        >
          <Box className={classes.container} sx={{ ...data.style }}>
            <Group noWrap spacing={14} align="flex-start">
              {iconName && (
                <ThemeIcon
                  size={28}
                  radius="xl"
                  variant="filled"
                  sx={{ 
                    backgroundColor: iconColor, 
                    color: '#111', 
                    boxShadow: `0 0 12px ${tinycolor(iconColor).setAlpha(0.35).toRgbString()}`
                  }}
                >
                  <LibIcon icon={iconName} size="sm" />
                </ThemeIcon>
              )}
              <Stack spacing={0}>
                {data.title && <Text className={classes.title}>{data.title}</Text>}
                {data.description && (
                  <ReactMarkdown
                    components={MarkdownComponents}
                    className={classes.description}
                  >
                    {data.description}
                  </ReactMarkdown>
                )}
              </Stack>
            </Group>
          </Box>

          {data.showDuration !== false && (
            <Box className={classes.progressWrapper}>
              <Box
                className={classes.progressBar}
                sx={{
                  backgroundColor: iconColor,
                  animation: `${shrink} ${duration}ms linear forwards`,
                  boxShadow: `0 0 8px ${tinycolor(iconColor).setAlpha(0.4).toRgbString()}`, 
                }}
              />
            </Box>
          )}
        </Box>
      ),
      { id: data.id?.toString(), duration: duration, position: position }
    );
  });

  return <Toaster />;
};

export default Notifications;