import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ScaleFade from '../../../transitions/ScaleFade';
import { BiSolidDashboard } from "react-icons/bi";
import { BsStack, BsFillMouse3Fill } from "react-icons/bs";

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
  mainHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
    marginRight: 0, 
  },
  titleStack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 0,
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    lineHeight: 1,
    letterSpacing: '1px',
  },
  menuLabel: {
    fontSize: 34,
    fontWeight: 900,
    color: 'white',
    textTransform: 'uppercase',
    lineHeight: 0.9,
  },
  optionsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginRight: 0, 
  },
  optionsText: {
    fontSize: 16,
    fontWeight: 800,
    textTransform: 'uppercase',
    color: 'white',
  },
  headerTitleText: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999', 
    textTransform: 'uppercase',
    lineHeight: 1,
    letterSpacing: '1px',
    marginBottom: 1,
    marginRight: 0, 
    textAlign: 'right',
  },
 
  divider: {
    width: '100%',
    height: 1,
    background: 'linear-gradient(to left, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
    marginBottom: 15,
    alignSelf: 'flex-end',
  },
  buttonsContainer: {
    width: '100%',
    overflowY: 'auto',
    maxHeight: '70vh',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  mouseGuide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 15,
  }
}));

const HexIcon = ({ icon }: { icon: React.ReactNode }) => {
  const brandBlue = "#339af0";
  
  const roundedHexPath = `
    M 50,5 
    Q 57,5 61,8 
    L 89,24 
    Q 93,27 93,32 
    L 93,68 
    Q 93,73 89,76 
    L 61,92 
    Q 57,95 50,95 
    Q 43,95 39,92 
    L 11,76 
    Q 7,73 7,68 
    L 7,32 
    Q 7,27 11,24 
    L 39,8 
    Q 43,5 50,5 
    Z
  `;

  return (
    <Box style={{ position: 'relative', width: '70px', height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <path 
          d={roundedHexPath} 
          fill="rgba(250, 250, 250, 0.08)" 
        />
      </svg>

      <Box style={{ position: 'relative', width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <path 
            d={roundedHexPath} 
            fill={brandBlue}
            stroke={brandBlue}
            strokeWidth="1" 
            strokeLinejoin="round"
          />
        </svg>
        
        <Box style={{ zIndex: 10, display: 'flex', color: '#f3f3f3', position: 'relative' }}>
     
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: {},
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeContext();
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible, contextMenu.canClose]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  const brandBlue = "#339af0";

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <div className={classes.sideOverlay} />

        <Box className={classes.menuContent}>
          
          <div className={classes.mainHeader}>
            <div className={classes.titleStack}>
              <Text className={classes.contextLabel}>CONTEXT</Text>
              <Text className={classes.menuLabel}>MENU</Text>
            </div>
            <HexIcon icon={<BiSolidDashboard size={30} />} />
          </div>

          {contextMenu.title && (
            <Text className={classes.headerTitleText}>
              {contextMenu.title}
            </Text>
          )}

          <div className={classes.optionsHeader}>
             <BsStack size={20} color={brandBlue} />
             <Text className={classes.optionsText}>
               AVAILABLE OPTIONS
             </Text>
          </div>

          <div className={classes.divider} />

          <Box className={classes.buttonsContainer}>
            <Stack spacing={8}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`ctx-${index}`} />
              ))}
            </Stack>

            <div className={classes.mouseGuide}>
               <BsFillMouse3Fill size={14} color={brandBlue} />
               <Text fz={10} fw={700}>ON MOUSE ENTER</Text>
            </div>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;