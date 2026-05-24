import React from 'react';
import { Card } from '@/components/ui/card';

type AuthCardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthCard({ title, subtitle, children, footer, className }: AuthCardProps) {
  return (
    <div className={`flex min-h-screen items-center justify-center p-6 ${className ?? ''}`}>
      <Card className="w-full max-w-md rounded-2xl border border-transparent p-6 shadow-lg">
        <div className="mb-4">
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>

        <div className="space-y-4">{children}</div>

        {footer && <div className="mt-4">{footer}</div>}
      </Card>
    </div>
  );
}

export default AuthCard;
