import React from 'react';

import './button.css';

interface ButtonProps {
  children: React.ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return <button className="header__right_button">{children}</button>;
};

export default Button;
