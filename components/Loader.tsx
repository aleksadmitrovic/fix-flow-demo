import { Spinner } from '@heroui/spinner';
import React from 'react';

export default function Loader({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Spinner
        label={label || 'Loading...'}
        variant="simple"
        color="primary"
        labelColor="primary"
      />
    </div>
  );
}
