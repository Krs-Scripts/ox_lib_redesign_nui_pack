import { Box, createStyles, Stack, Text, ScrollArea } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import ListItem from './ListItem';
import Header from './Header';
import FocusTrap from 'focus-trap-react';
import { fetchNui } from '../../../utils/fetchNui';
import type { MenuSettings } from '../../../typings';
import ScaleFade from '../../../transitions/ScaleFade';
import { BsFillMouse3Fill } from "react-icons/bs";

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 500,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    zIndex: 1000,
    paddingRight: 50,
    paddingTop: 50,
    pointerEvents: 'none',
  },
  sideOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150%',
    height: '100%',
    background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0.49) 60%, rgba(0, 0, 0, 0) 100%)',
    zIndex: -1,
  },
  menuContent: {
    pointerEvents: 'all',
    display: 'flex',
    flexDirection: 'column',
    width: 320,
    alignItems: 'flex-end',
  },
  buttonsWrapper: {
    width: '100%',
    '& .mantine-ScrollArea-viewport': {
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    },
    '& .mantine-ScrollArea-scrollbar': { display: 'none !important' },
    '& *:focus': { outline: 'none !important' },
  },
  mouseGuide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: '#ffffff',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 8,
  },
  descriptionBox: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    padding: '6px 12px',
    borderRadius: 8,
    width: 'fit-content',
    maxWidth: '90%',
    alignSelf: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: 600,
    textAlign: 'center',
    border: 'none',
  }
}));

const ListMenu: React.FC = () => {
  const { classes } = useStyles();
  const [menu, setMenu] = useState<MenuSettings>({ position: 'top-right', title: '', items: [] });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [indexStates, setIndexStates] = useState<Record<number, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);

  const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
    if (menu.canClose === false && !forceClose) return;
    setVisible(false);
    if (!ignoreFetch) fetchNui('closeMenu', keyPressed);
  };

  const handleItemClick = (index: number) => {
    const item = menu.items[index];
    if (!item) return;

    if (item.checked !== undefined && !item.values) {
      setCheckedStates(prev => ({ ...prev, [index]: !prev[index] }));

      return; 
    }

    fetchNui('confirmSelected', [index, indexStates[index]]).catch();

    if (item.close === true) {
        setVisible(false);
    }
  };

  const handleScrollClick = (index: number, direction: 'left' | 'right') => {
    const item = menu.items[index];
    if (!Array.isArray(item?.values)) return;
    const max = item.values.length;
    setIndexStates(prev => ({
      ...prev,
      [index]: direction === 'right' ? (prev[index] + 1) % max : (prev[index] - 1 < 0 ? max - 1 : prev[index] - 1)
    }));
  };

  useEffect(() => {
    if (firstRenderRef.current || !visible) return;
    const timer = setTimeout(() => {
      fetchNui('changeChecked', [selected, checkedStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  useEffect(() => {
    if (firstRenderRef.current || !visible) return;
    const timer = setTimeout(() => {
      fetchNui('changeIndex', [selected, indexStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [indexStates]);

  const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    firstRenderRef.current = false;
    switch (e.code) {
      case 'ArrowDown': setSelected(s => (s >= menu.items.length - 1 ? 0 : s + 1)); break;
      case 'ArrowUp': setSelected(s => (s <= 0 ? menu.items.length - 1 : s - 1)); break;
      case 'ArrowRight': handleScrollClick(selected, 'right'); break;
      case 'ArrowLeft': handleScrollClick(selected, 'left'); break;
      case 'Enter': handleItemClick(selected); break;
      case 'Escape': case 'Backspace': closeMenu(false, e.code); break;
    }
  };

  useEffect(() => {
    if (!visible || !listRefs.current[selected] || !viewportRef.current) return;
    const item = listRefs.current[selected]!;
    const viewport = viewportRef.current;
    item.focus({ preventScroll: true });
    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    if (itemTop < viewport.scrollTop) viewport.scrollTo({ top: itemTop - 8 });
    else if (itemBottom > viewport.scrollTop + viewport.offsetHeight) viewport.scrollTo({ top: itemBottom - viewport.offsetHeight + 8 });
  }, [selected, visible]);

  useNuiEvent('setMenu', (data: MenuSettings) => {
    firstRenderRef.current = true;
    const arrayIndexes: Record<number, number> = {};
    const checkedIndexes: Record<number, boolean> = {};
    data.items.forEach((item, i) => {
      if (Array.isArray(item.values)) arrayIndexes[i] = (item.defaultIndex || 1) - 1;
      else if (item.checked !== undefined) checkedIndexes[i] = item.checked || false;
    });
    setIndexStates(arrayIndexes);
    setCheckedStates(checkedIndexes);
    setSelected(data.startItemIndex || 0);
    setMenu(data);
    setVisible(true);
  });

  useNuiEvent('closeMenu', () => closeMenu(true, undefined, true));

  const getTooltipLabel = () => {
    const item = menu.items[selected];
    if (!item) return '';
    if (Array.isArray(item.values) && typeof item.values[indexStates[selected]] === 'object') {
        return (item.values[indexStates[selected]] as any).description || '';
    }
    return item.description || '';
  };

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <div className={classes.sideOverlay} />
        
        <Box className={classes.menuContent}>
          <Header title={menu.title} />
          
          <Box className={classes.buttonsWrapper} onKeyDown={moveMenu}>
            <FocusTrap active={visible} focusTrapOptions={{ allowOutsideClick: true }}>
              <ScrollArea 
                h={menu.items.length > 7 ? 450 : 'auto'} 
                viewportRef={viewportRef} 
                type="never"
              >
                <Stack spacing={8} p={0} sx={{ paddingBottom: 10 }}>
                  {menu.items.map((item, index) => (
                    <ListItem 
                      key={index} 
                      index={index} 
                      item={item} 
                      scrollIndex={indexStates[index] || 0} 
                      checked={checkedStates[index] || false} 
                      onItemClick={() => handleItemClick(index)}
                      onMouseEnter={() => { setSelected(index); firstRenderRef.current = false; }}
                      onScrollClick={(dir) => handleScrollClick(index, dir)}
                      ref={(el) => { listRefs.current[index] = el; }} 
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </FocusTrap>

            <Stack spacing={0} sx={{ width: '100%', alignItems: 'center' }}>
              <div className={classes.mouseGuide}>
                <BsFillMouse3Fill size={14} color="#339af0" />
                <Text fz={10} fw={700} sx={{ textTransform: 'uppercase' }}>ON MOUSE ENTER</Text>
              </div>

              {getTooltipLabel() && (
                <Box className={classes.descriptionBox}>
                  {getTooltipLabel()}
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ListMenu;