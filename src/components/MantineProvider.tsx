'use client';

import { MantineProvider } from '@mantine/core';

export default function MantineProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
} 