import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text, Box } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  button: {
    height: 'auto',
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    textAlign: 'left',
    transition: 'all 0.1s ease',
    border: 'none',
    backgroundColor: params.disabled ? 'rgba(15, 15, 15, 0.68)' : 'rgba(20, 20, 20, 0.98)',

    '&:disabled': {
      backgroundColor: 'rgba(15, 15, 15, 0.68) !important',
      color: 'inherit',
      cursor: 'not-allowed',
      opacity: 0.8,
    },

    '&:hover': {
      backgroundColor: params.disabled || params.readOnly 
        ? 'rgba(15, 15, 15, 0.68)' 
        : 'rgba(36, 36, 36, 0.9)', 
    },
  },
  inner: { justifyContent: 'flex-start' },
  label: {
    width: '100%',
    color: 'rgba(255,255,255,0.9)', 
    whiteSpace: 'pre-wrap',
  },
  description: {
    color: 'rgba(238, 238, 238, 0.4)',
    fontSize: 11,
    marginTop: 4,
  },
  iconContainer: {
    color: '#339af0', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  
  dropdown: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)', 
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    minWidth: 220,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  
  metadataGroup: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
    width: '100%',
  },
  
  metadataLabel: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 600,
  },
  
  metadataValueBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '3px 10px',
    borderRadius: 6,
    border: '1px solid rgba(255, 255, 255, 0.05)',
    minWidth: 50,
    textAlign: 'center',
  },
  
  metadataValue: {
    fontSize: 11,
    fontWeight: 800,
    color: '#ffffff',
  },
  
  progressRoot: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 7,
    borderRadius: 10,
    marginTop: 10,
  },
  progressBar: {
    backgroundColor: '#339af0', 
  }
}));

const ContextButton: React.FC<{ option: [string, Option] }> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <HoverCard position="left-start" withinPortal openDelay={100} shadow="md">
      <HoverCard.Target>
        <Button
          className={classes.button}
          classNames={{ inner: classes.inner, label: classes.label }}
          onClick={() => !button.disabled && !button.readOnly && (button.menu ? openMenu(button.menu) : clickContext(buttonKey))}
          variant="default"
          disabled={button.disabled}
        >
          <Group position="apart" w="100%" noWrap align="center">
            <Stack spacing={0} sx={{ flex: 1 }}>
              <Group spacing={14} noWrap>
                {button.icon && (
                  <div className={classes.iconContainer}>
                    {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                      <img src={button.icon} width={20} alt="" />
                    ) : (
                      <LibIcon icon={button.icon as IconProp} fontSize={18} fixedWidth />
                    )}
                  </div>
                )}
                <Text size={13} weight={600} c="white">
                  <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                </Text>
              </Group>
              
              {button.description && (
                <Text className={classes.description}>
                  <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                </Text>
              )}
            </Stack>
            {(button.menu || button.arrow) && <LibIcon icon="chevron-right" fontSize={11} opacity={0.2} />}
          </Group>
        </Button>
      </HoverCard.Target>

      {(button.metadata || button.image || button.progress !== undefined) && (
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} radius="sm" mb="sm" />}
          
          <Stack spacing={4}>
            {button.metadata && (Array.isArray(button.metadata) ? button.metadata : Object.entries(button.metadata)).map((m: any, i) => (
              <Group key={i} className={classes.metadataGroup} noWrap>
                <Text className={classes.metadataLabel}>{m.label || m[0] || m}</Text>
                
                <Box className={classes.metadataValueBox}>
                  <Text className={classes.metadataValue}>
                    {m.value || m[1] || ''}
                  </Text>
                </Box>
              </Group>
            ))}
          </Stack>

          {button.progress !== undefined && (
            <Progress 
              value={button.progress} 
              classNames={{ root: classes.progressRoot, bar: classes.progressBar }}
            />
          )}
        </HoverCard.Dropdown>
      )}
    </HoverCard>
  );
};

export default ContextButton;