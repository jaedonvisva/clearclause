import { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="prose prose-sm mx-auto my-8 max-w-3xl p-4">
      {children}
    </div>
  );
}
