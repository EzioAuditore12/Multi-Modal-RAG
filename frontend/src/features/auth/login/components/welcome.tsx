'use client';

import { ShieldCheck } from 'lucide-react';
import type { ComponentProps } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeLoginDialogProps extends ComponentProps<typeof Dialog> {
  handleConfirmOnboarding: () => void;
}

export function WelcomeLoginDialog({
  open,
  onOpenChange,
  handleConfirmOnboarding,
  ...props
}: WelcomeLoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Multi-Modal RAG Project</DialogTitle>
          <DialogDescription className="text-center">
            Welcome! To experience the full capabilities of our RAG system, please log in using our{' '}
            <strong>Test User</strong> credentials.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted space-y-1 rounded-lg p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono font-medium">test@example.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono font-medium">Test@123</span>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleConfirmOnboarding} className="w-full sm:w-auto">
            Start Tutorial & Autofill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
