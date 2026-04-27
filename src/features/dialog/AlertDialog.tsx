import { Button, createStyles, Group, Modal, Stack, Box } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps as BaseAlertProps } from '../../typings';
import { TbAlertHexagonFilled } from "react-icons/tb";

interface AlertProps extends BaseAlertProps {
  progress?: number;
  progressLabel?: string;
}

const useStyles = createStyles((theme) => ({
  modalRoot: {
    '.mantine-Modal-modal': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      maxWidth: '450px !important',
      width: '100%',
    },
  },
  iconWrapper: {
    position: 'relative',
    width: '70px',
    height: '75px',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  textWhite: {
    color: '#ffffff',
    fontSize: '2.6rem',
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '-1px',
  },
  textBlue: {
    color: '#0496ff',
    fontSize: '2.6rem',
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '-1px',
  },
  contentWrapper: {
    width: '100%',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.05rem',
    marginBottom: 30,
    textAlign: 'center',
    '& p': { margin: 0 },
  },
  buttonGroup: {
    width: '100%',
    justifyContent: 'center',
  },
  styledButton: {
    minWidth: 140,
    height: 44,
    borderRadius: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    border: 'none',
    transition: 'all 0.1s ease',
    '&:active': { transform: 'scale(0.96)' }
  },
  confirmBtn: {
    backgroundColor: '#0496ff',
    color: '#ffffff',
    '&:hover': { backgroundColor: '#31a9ff' },
  },
  cancelBtn: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    color: '#ffffff',
    '&:hover': { backgroundColor: 'rgba(36, 36, 36, 0.9)' },
  }
}));

// Sotto-componente per l'esagono armonioso
const HarmoniousHexIcon = ({ icon }: { icon: React.ReactNode }) => {
  const brandBlue = "#0496ff";
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
        <path d={roundedHexPath} fill="rgba(250, 250, 250, 0.08)" />
      </svg>
      <Box style={{ position: 'relative', width: '78%', height: '78%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <path d={roundedHexPath} fill={brandBlue} />
        </svg>
        <Box style={{ zIndex: 10, display: 'flex', color: 'white', position: 'relative' }}>
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  } as AlertProps);

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  const headerParts = dialogData.header?.split(' ') || ['HELLO', 'THERE'];

  return (
    <Modal
      opened={opened}
      centered
      className={classes.modalRoot}
      onClose={() => closeAlert('cancel')}
      withCloseButton={false}
      overlayOpacity={0.8}
      overlayBlur={0}
    >
      <Stack align="center" spacing={0}>
        
        <Box className={classes.iconWrapper}>
          <HarmoniousHexIcon icon={<TbAlertHexagonFilled size={28} />} />
        </Box>

        <Box className={classes.titleContainer}>
          <span className={classes.textWhite}>{headerParts[0]}</span>
          <span className={classes.textBlue}>{headerParts.slice(1).join(' ')}</span>
        </Box>

        <Box className={classes.contentWrapper}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {dialogData.content}
          </ReactMarkdown>
        </Box>

        <Group className={classes.buttonGroup} spacing="md" noWrap>
          <Button 
            className={`${classes.styledButton} ${classes.confirmBtn}`} 
            onClick={() => closeAlert('confirm')}
          >
            {dialogData.labels?.confirm || locale.ui.confirm || 'Confirm'}
          </Button>
          
          {dialogData.cancel && (
            <Button 
              className={`${classes.styledButton} ${classes.cancelBtn}`} 
              onClick={() => closeAlert('cancel')}
            >
              {dialogData.labels?.cancel || locale.ui.cancel || 'Cancel'}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
};

export default AlertDialog;