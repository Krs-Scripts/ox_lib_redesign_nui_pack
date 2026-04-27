import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface ListItemProps {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  onItemClick: () => void;
  onMouseEnter: () => void;
  onScrollClick: (direction: 'left' | 'right') => void;
}

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    borderRadius: 12,
    minHeight: 56,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    transition: 'all 0.1s ease',
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      backgroundColor: 'rgba(36, 36, 36, 0.9)',
    },
    '&:focus': {
      outline: 'none',
    }
  },
  buttonWrapper: {
    padding: '0 16px',
    width: '100%',
  },
  label: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  scrollValue: {
    color: '#339af0',
    fontWeight: 800,
    fontSize: 12,
    textAlign: 'center',
    minWidth: 30,
  },
  progressRoot: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 7,
    borderRadius: 10,
    marginTop: 4,
  },
  progressBar: {
    backgroundColor: '#339af0',
  },
  chevronBox: {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.3,
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 1,
    }
  }
}));

const ListItem = forwardRef<HTMLDivElement, ListItemProps>(({ item, index, scrollIndex, checked, onItemClick, onMouseEnter, onScrollClick }, ref) => {
  const { classes } = useStyles();

  return (
    <Box 
      tabIndex={index} 
      className={classes.buttonContainer} 
      ref={ref} 
      onClick={onItemClick}
      onMouseEnter={onMouseEnter}
    >
      <Group position="apart" noWrap className={classes.buttonWrapper}>
        <Group spacing={14} noWrap sx={{ flex: 1 }}>
          {item.icon && (
            <Box sx={{ color: '#339af0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 24 }}>
              {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                <img src={item.icon} width={20} alt="" />
              ) : (
                <LibIcon icon={item.icon as IconProp} fontSize={18} fixedWidth />
              )}
            </Box>
          )}
          
          <Stack spacing={0}>
            <Text className={classes.label}>{item.label}</Text>
            {Array.isArray(item.values) && (
              <Text color="rgba(238, 238, 238, 0.4)" size={11} weight={700} sx={{ marginTop: 2 }}>
                {(item.values[scrollIndex] as any)?.label || item.values[scrollIndex]}
              </Text>
            )}
          </Stack>
        </Group>

        <Box>
          {Array.isArray(item.values) ? (
            <Group spacing={4} noWrap align="center">
              <Box className={classes.chevronBox} onClick={(e) => { e.stopPropagation(); onScrollClick('left'); }}>
                <LibIcon icon="chevron-left" fontSize={11} />
              </Box>
              <Text className={classes.scrollValue}>{scrollIndex + 1}/{item.values.length}</Text>
              <Box className={classes.chevronBox} onClick={(e) => { e.stopPropagation(); onScrollClick('right'); }}>
                <LibIcon icon="chevron-right" fontSize={11} />
              </Box>
            </Group>
          ) : item.checked !== undefined ? (
            <CustomCheckbox checked={checked} />
          ) : item.progress !== undefined ? (
            <Box sx={{ width: 100 }}>
              <Progress value={item.progress} classNames={{ root: classes.progressRoot, bar: classes.progressBar }} />
            </Box>
          ) : null}
        </Box>
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);