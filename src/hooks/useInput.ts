import { useState, useCallback, ChangeEvent } from 'react';

function useInput<S>(
  initialValue: S
): [S, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState<S>(initialValue);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value =
      typeof initialValue === 'boolean' ? e.target.checked : e.target.value;
    setValue(value as S);
  }, []);
  return [value, onChange];
}

export default useInput;
