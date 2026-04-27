import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';
import { BiSolidDashboard } from "react-icons/bi";
import { BsStack } from "react-icons/bs";

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end', 
    marginBottom: 10,
  },
  mainHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
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
  
  dynamicTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 2,
    marginRight: 0,
    textAlign: 'right',
    letterSpacing: '1px',
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
  divider: {
    width: '100%',
    height: 1,
    background: 'linear-gradient(to left, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
    marginBottom: 15,
  },
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

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();
  const brandBlue = "#339af0";

  return (
    <Box className={classes.container}>
      <div className={classes.mainHeader}>
        <div className={classes.titleStack}>
          <Text className={classes.contextLabel}>LIST</Text>
          <Text className={classes.menuLabel}>MENU</Text>
        </div>
        <HexIcon icon={<BiSolidDashboard size={30} />} />
      </div>

      {title && (
        <Text className={classes.dynamicTitle}>
          {title}
        </Text>
      )}

      <div className={classes.optionsHeader}>
        <BsStack size={20} color={brandBlue} />
        <Text className={classes.optionsText}>AVAILABLE OPTIONS</Text>
      </div>
      <div className={classes.divider} />
    </Box>
  );
};

export default React.memo(Header);