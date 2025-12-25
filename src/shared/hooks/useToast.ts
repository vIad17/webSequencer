import toast, { ToastOptions, ToastPosition } from 'react-hot-toast';

const defaultOptions = {
  duration: 4000,
  position: 'bottom-left' as ToastPosition,
  style: {
    background: 'var(--colors-bg-secondary)',
    border: '1px solid var(--colors-ui-accent)',
    color: 'var(--colors-ui-primary)',
    fontSize: '0.9vw'
  }
};

export const useToast = () => {
  const error = (messageKey: string, options: Partial<ToastOptions> = {}) => {
    toast.error(messageKey, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        fontSize: '1vw',
        ...options.style
      },
      ...options
    });
  };

  return {
    toastError: error
  };
};
