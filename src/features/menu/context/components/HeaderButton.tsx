import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const ACCENT_BLUE = "#228be6";

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: 12, 
    height: 38,
    width: 38, 
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s ease",
    '&:hover': {
      backgroundColor: params.canClose === false ? "rgba(255, 255, 255, 0.04)" : ACCENT_BLUE,
      borderColor: params.canClose === false ? "rgba(255, 255, 255, 0.1)" : ACCENT_BLUE,
      transform: params.canClose === false ? "none" : "scale(1.05)", 
    }
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? "rgba(255, 255, 255, 0.2)" : "#ffffff",
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;