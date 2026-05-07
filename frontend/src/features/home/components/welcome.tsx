'use client';

import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface WelcomeTourModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTour: () => void;
  onSkipTour: () => void;
}

export function WelcomeTourModal({
  isOpen,
  onOpenChange,
  onStartTour,
  onSkipTour,
}: WelcomeTourModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <FolderOpen className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Projects Dashboard</DialogTitle>
          <DialogDescription className="text-center text-base">
            This screen contains a list of all the projects you have created in the system. Let's
            take a quick look at your first project to see how things work!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={onSkipTour} className="w-full sm:w-auto">
            Skip
          </Button>
          <Button onClick={onStartTour} className="w-full sm:w-auto">
            Start Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
