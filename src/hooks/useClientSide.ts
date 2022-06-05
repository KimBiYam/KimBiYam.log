import { useEffect, useState } from 'react';

const useClientSide = () => {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return isClientSide;
};

export default useClientSide;
