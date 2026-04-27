import { Box, createStyles, keyframes } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const slideInGelatine = keyframes({
  '0%': { transform: 'translate(calc(-50% - 250px), -50%) scale(1.2, 0.8)', opacity: 0 },
  '50%': { transform: 'translate(calc(-50% + 25px), -50%) scale(0.85, 1.15)', opacity: 1 },
  '75%': { transform: 'translate(calc(-50% - 10px), -50%) scale(1.05, 0.95)' },
  '100%': { transform: 'translate(-50%, -50%) scale(1, 1)', opacity: 1 },
});

const useStyles = createStyles((theme) => ({
  fullScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
  },
  sideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0) 100%)',
    pointerEvents: 'none',
  },
  menuContainer: {
    position: 'absolute',
    top: '50%',
    left: '20%',
  },
  animatedContainer: {
    animation: `${slideInGelatine} 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
    transformOrigin: 'center center',
  },
  staticContainer: {
    transform: 'translate(-50%, -50%)',
  },
  sector: {
    '&:hover circle': {
      fill: theme.fn.primaryColor(),
      cursor: 'pointer',
    },
    '&:hover > g > svg > path': {
      fill: '#fff',
    },
  },
  itemCircle: {
    fill: 'rgba(30, 30, 30, 0.95)',
    stroke: 'rgba(255, 255, 255, 0)',
    strokeWidth: 1,
    transition: 'fill 0.2s ease',
  },
  backgroundCircle: {
    display: 'none',
  },
  centerCircle: {
    fill: 'rgba(30, 30, 30, 0.98)', 
    stroke: 'rgba(255, 255, 255, 0)',
    strokeWidth: 2,
    transition: 'fill 0.2s ease',
    '&:hover': {
      cursor: 'pointer',
      fill: 'rgba(40, 40, 40, 0.98)',
    },
  },
  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120, 
    height: 120,
  },
  centerLogo: {
    width: '100%',
    height: 'auto',
    maxWidth: '90px', 
    filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.5))',
  }
}));

const calculateFontSize = (text: string): number => {
  if (text.length > 20) return 10;
  if (text.length > 15) return 12;
  return 13;
};

const splitTextIntoLines = (text: string, maxCharPerLine: number = 15): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const PAGE_ITEMS = 8;
const degToRad = (deg: number) => deg * (Math.PI / 180);

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const newDimension = 500; 
  const [visible, setVisible] = useState(false);
  const [isInitialOpen, setIsInitialOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);

  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setIsInitialOpen(false); 
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) {
      return setVisible(false);
    }
    
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    
    if (!data.sub) {
      setMenuKey(prev => prev + 1);
      setIsInitialOpen(true);
    } else {
      setIsInitialOpen(false);
    }

    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  const itemRadius = 175 * 0.88;

  return (
    <>
      <Box
        className={classes.fullScreenWrapper}
        style={{ 
          opacity: visible ? 1 : 0, 
          pointerEvents: visible ? 'all' : 'none',
          transition: 'opacity 0.2s ease' 
        }}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) {
             setIsInitialOpen(false); 
             fetchNui('radialBack');
          }
        }}
      >
        <div className={classes.sideOverlay} />

        <div 
          key={menuKey} 
          className={`${classes.menuContainer} ${isInitialOpen ? classes.animatedContainer : classes.staticContainer}`}
        >
          <svg
            style={{ overflow: 'visible' }}
            width={`${newDimension}px`}
            height={`${newDimension}px`}
            viewBox="0 0 350 350"
            transform="rotate(90)"
          >
            <g transform="translate(175, 175)">
              <circle r={175} className={classes.backgroundCircle} />
            </g>

            {menuItems.map((item, index) => {
              const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
              const angle = degToRad(pieAngle / 2 + 90);
              
              const sinAngle = Math.sin(angle);
              const cosAngle = Math.cos(angle);
              const iconX = 175 + sinAngle * itemRadius;
              const iconY = 175 + cosAngle * itemRadius; 
              const iconWidth = Math.min(Math.max(item.iconWidth || 50, 0), 100);
              const iconHeight = Math.min(Math.max(item.iconHeight || 50, 0), 100);

              return (
                <g
                  key={index}
                  transform={`rotate(-${index * pieAngle} 175 175)`}
                  className={classes.sector}
                  onClick={async () => {
                    const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                    if (!item.isMore) fetchNui('radialClick', clickIndex);
                    else {
                      await changePage(true);
                    }
                  }}
                >
                  <circle cx={iconX} cy={iconY} r={28} className={classes.itemCircle} />

                  <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                    {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                      <image
                        href={item.icon}
                        width={iconWidth}
                        height={iconHeight}
                        x={iconX - iconWidth / 2}
                        y={iconY - iconHeight / 2}
                      />
                    ) : (
                      <LibIcon
                        x={iconX - 14.5}
                        y={iconY - 15.5}
                        icon={item.icon as IconProp}
                        width={30}
                        height={30}
                        fixedWidth
                        color="#fff"
                      />
                    )}
                    
                    <text
                      x={iconX}
                      y={iconY + 45} 
                      fill="#fff"
                      textAnchor="middle"
                      fontSize={calculateFontSize(item.label)}
                      pointerEvents="none"
                      lengthAdjust="spacingAndGlyphs"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {splitTextIntoLines(item.label, 15).map((line, idx) => (
                        <tspan x={iconX} dy={idx === 0 ? 0 : '1.2em'} key={idx}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                </g>
              );
            })}
            
            <g
              transform={`translate(175, 175)`}
              onClick={async () => {
                if (menu.page > 1) await changePage();
                else {
                  if (menu.sub) {
                    setIsInitialOpen(false);
                    fetchNui('radialBack');
                  } else {
                    setVisible(false);
                    fetchNui('radialClose');
                  }
                }
              }}
            >
              <circle r={60} className={classes.centerCircle} />
            </g>
          </svg>
          
          <div className={classes.centerIconContainer}>
            <img 
              src="nui://ox_lib/web/images/logo.png" 
              alt="Krs Logo" 
              className={classes.centerLogo}
            />
          </div>
        </div>
      </Box>
    </>
  );
};

export default RadialMenu;