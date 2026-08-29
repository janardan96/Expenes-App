// assets/icons/AddTabIcon.tsx
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '@context/ThemeContext';

type Props = {
  size?: number;
};

const AddTabIcon: React.FC<Props> = ({ size = 56 }) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* soft halo behind the button */}
      <Circle cx="28" cy="28" r="28" fill="#549994" fillOpacity="0.15" />
      {/* solid button */}
      <Circle
        cx="28"
        cy="28"
        r="22"
        fill={theme === 'dark' ? '#377d7d' : '#4E938E'}
      />
      {/* plus sign */}
      <Path
        d="M28 18V38M18 28H38"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default AddTabIcon;
