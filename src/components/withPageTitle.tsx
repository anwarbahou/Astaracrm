import React from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';

export function withPageTitle<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageTitleKey: string
) {
  return function WithPageTitleComponent(props: P) {
    usePageTitle(`app.topNav.pageTitle.${pageTitleKey}`);
    return <WrappedComponent {...props} />;
  };
} 