import React, { Suspense, lazy } from 'react';
import { LoadingState } from './components';

const lazyLoad = (importFunc, fallback = <LoadingState />) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default lazyLoad;

// Preload function for critical routes
export const preloadComponent = (importFunc) => {
  const component = lazy(importFunc);
  component.preload = importFunc;
  return component;
};
