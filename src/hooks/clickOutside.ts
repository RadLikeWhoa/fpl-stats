import React from 'react'

const useClickOutside = <T extends HTMLElement>(callback: () => void): React.RefObject<T> => {
  const element = React.useRef<T>(null);

  React.useEffect(() => {
    const listener = (e: MouseEvent): void => {
      if (e.target instanceof Node && element.current && !element.current.contains(e.target)) {
        callback();
      }
    };

    if (element.current) {
      document.addEventListener('click', listener);
    } else {
      document.removeEventListener('click', listener);
    }

    return () => document.removeEventListener('click', listener);
  }, [element, callback]);

  return element;
};

export default useClickOutside;
