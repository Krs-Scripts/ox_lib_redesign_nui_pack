import React, { useMemo } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const bubbleFont = "'Fredoka', sans-serif";

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 
      params.position === 'top-center' ? 'baseline' :
      params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent: 
      params.position === 'right-center' ? 'flex-end' :
      params.position === 'left-center' ? 'flex-start' : 'center',
    padding: '20px', 
  },
  mainContainer: {
    display: 'flex',
    gap: '8px', 
    alignItems: 'stretch',
  },
  keyBox: {
    fontSize: 20,
    padding: '8px 14px',
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    color: '#f8f9fa', 
    fontFamily: bubbleFont, 
    fontWeight: 900,   
    borderRadius: 15,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '45px', 
  },
  textBox: {
    fontSize: 16,
    padding: '8px 16px',
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    color: '#f8f9fa',
    fontFamily: bubbleFont, 
    fontWeight: 800,      
    borderRadius: 15,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; 
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

const parsedContent = useMemo(() => {
    const rawText = data.text || '';
    const cleanText = rawText.replace(/[\[\]]/g, '');
    const parts = cleanText.split(/[\s-]\s*/);
    const key = parts[0]; 
    const content = parts.slice(1).join(' ');
    return { 
      keybind: key || '?', 
      content: content || 'Interagisci' 
    };
  }, [data.text]);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.mainContainer}>
            
            {parsedContent.keybind && (
              <Box className={classes.keyBox}>
                {parsedContent.keybind}
              </Box>
            )}

            <Box className={classes.textBox}>
              <Group spacing={12}>
                {data.icon && (
                  <LibIcon
                    icon={data.icon}
                    fixedWidth
                    size="lg"
                    animation={data.iconAnimation}
                    style={{
                      color: data.iconColor,
                      alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                    }}
                  />
                )}
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {parsedContent.content}
                </ReactMarkdown>
              </Group>
            </Box>

          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;