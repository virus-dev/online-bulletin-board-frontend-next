import React from 'react';
import { IconComponentsProps } from 'Models/IconComponent';

// TODO найти норм иконку, эта не очень
const IconSearch: React.FC<IconComponentsProps> = ({ color = 'white', size }) => (
  <svg viewBox="0 0 487.95 487.95" height={size} width={size}>
    <path stroke={color} d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z" />
  </svg>
);

export default IconSearch;
