import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
} from 'react';

const useDidUpdateEffect = (cb: EffectCallback, deps: DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return undefined;
    }
    return cb();
  }, deps);
};

export default useDidUpdateEffect;
