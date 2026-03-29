import React from 'react';

import './Button.scss';

interface ButtonProps {
  type?: string;
  children: React.ReactNode;
}

const Button = ({ children, type }: ButtonProps) => {
  return <button className={`header__right_button ${type}`}>{children}</button>;
};

export default Button;
