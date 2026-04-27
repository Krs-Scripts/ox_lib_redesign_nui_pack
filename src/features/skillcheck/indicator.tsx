import React, { useEffect, useState } from 'react';
import type { SkillCheckProps } from '../../typings';

interface Props {
  angle: number;
  offset: number;
  multiplier: number;
  handleComplete: (success: boolean) => Promise<any> | undefined;
  className: string;
  skillCheck: SkillCheckProps;
  centerPoint: number;
}

const Indicator: React.FC<Props> = ({
  angle,
  offset,
  multiplier,
  handleComplete,
  className,
  skillCheck,
  centerPoint,
}) => {
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentAngle((prev) => {
          if (prev >= 360) {
            clearInterval(interval);
            handleComplete(false);
            return 0;
          }
          return prev + 1 * multiplier;
        });
      }, 10);

      return () => clearInterval(interval);
    }, 500);

    return () => {
      clearTimeout(timeout);
      setCurrentAngle(0);
    };
  }, [skillCheck, multiplier]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (skillCheck.key === e.key.toLowerCase()) {
        const minAngle = angle + 90;
        const maxAngle = angle + 90 + offset;

        if (currentAngle >= minAngle && currentAngle <= maxAngle) handleComplete(true);
        else handleComplete(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentAngle, skillCheck]);

  return (
    <circle
      className={className}
      cx={centerPoint}
      cy={centerPoint}
      transform={`rotate(${currentAngle - 90}, ${centerPoint}, ${centerPoint})`}
    />
  );
};

export default Indicator;