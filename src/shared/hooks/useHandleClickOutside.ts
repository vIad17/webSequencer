import { useEffect, useRef } from "react";

export const useHandleClickOutside = (onClickOutside: () => void) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClickOutside();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef.current]);
  return { modalRef };
};