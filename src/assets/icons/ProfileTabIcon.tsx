import React from 'react';
import Svg, {
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
} from 'react-native-svg';

type TabIconProps = {
  focused: boolean;
  size?: number;
};

const ProfileTabIcon = ({ focused, size = 36 }: TabIconProps) => {
  if (focused) {
    return (
      <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <G clipPath="url(#profileClip)">
          <Path
            d="M32.6109 29.8125C30.5117 26.1964 27.1517 23.4823 23.1749 22.1906C25.0811 21.0571 26.5624 19.3292 27.3912 17.2722C28.2201 15.2152 28.3506 12.943 27.7629 10.8046C27.1751 8.66618 25.9015 6.77991 24.1378 5.43553C22.374 4.09115 20.2176 3.36304 17.9999 3.36304C15.7823 3.36304 13.6259 4.09115 11.8621 5.43553C10.0984 6.77991 8.82479 8.66618 8.23703 10.8046C7.64926 12.943 7.77984 15.2152 8.60868 17.2722C9.43753 19.3292 10.9188 21.0571 12.8249 22.1906C8.84821 23.4823 5.48817 26.1964 3.38901 29.8125C3.28595 29.982 3.23145 30.1766 3.23145 30.375C3.23145 30.5734 3.28595 30.768 3.38901 30.9375C3.48517 31.1099 3.62606 31.2531 3.79684 31.3521C3.96762 31.4511 4.16194 31.5022 4.35933 31.5H31.6406C31.838 31.5022 32.0323 31.4511 32.2031 31.3521C32.3738 31.2531 32.5147 31.1099 32.6109 30.9375C32.7139 30.768 32.7685 30.5734 32.7685 30.375C32.7685 30.1766 32.7139 29.982 32.6109 29.8125Z"
            fill="url(#profileGradient)"
          />
        </G>
        <Defs>
          <LinearGradient
            id="profileGradient"
            x1="18"
            y1="3.36304"
            x2="18"
            y2="31.5001"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#549994" />
            <Stop offset="1" stopColor="#408782" />
          </LinearGradient>
          <ClipPath id="profileClip">
            <Rect width="36" height="36" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={(size * 36) / 35} viewBox="0 0 35 36" fill="none">
      <G clipPath="url(#profileOutlineClip)">
        <Path
          d="M17.375 22.5C22.173 22.5 26.0625 18.4706 26.0625 13.5C26.0625 8.52944 22.173 4.5 17.375 4.5C12.577 4.5 8.6875 8.52944 8.6875 13.5C8.6875 18.4706 12.577 22.5 17.375 22.5Z"
          stroke={'#AAAAAA'}
          strokeWidth={2.25}
          strokeMiterlimit={10}
        />
        <Path
          d="M4.20801 30.375C5.54227 27.9804 7.46152 25.9918 9.77283 24.6092C12.0841 23.2266 14.7061 22.4987 17.375 22.4987C20.0439 22.4987 22.6659 23.2266 24.9772 24.6092C27.2885 25.9918 29.2077 27.9804 30.542 30.375"
          stroke={'#AAAAAA'}
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="profileOutlineClip">
          <Rect width="34.75" height="36" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ProfileTabIcon;
