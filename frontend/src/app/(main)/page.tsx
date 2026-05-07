'use client';

import { Code } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Route } from 'next';
import { useDebounce } from 'use-debounce';
import { useJoyride } from 'react-joyride';

import { useTutorialStore } from '@/store/tutorial';

import { HomeHeader } from '@/features/home/components/header';
import { HomeTileCard, type Tile } from '@/features/home/components/tiles/card';
import { useGetAllProjects } from '@/features/home/hooks/use-get-all-projects';
import { Project } from '@/features/home/schemas/project.schema';
import { Input } from '@/components/ui/input';
import { CreateNewProjectForm } from '@/features/project/components/create-new-project-form';
import { useCreateNewProject } from '@/features/project/hooks/use-create-new-project';

import { WelcomeTourModal } from '@/features/home/components/welcome';

function mapProjectsToTiles(projects: Project[] | undefined): Tile[] {
  if (!projects) return [];

  return projects.map((project) => ({
    id: project.id,
    title: project.name,
    description: project.description ?? '',
    icon: Code,
    href: `/project/${project.id}` as Route,
    iconColor: 'teal',
    bgColor: '#e0f7fa',
  }));
}

const steps = [
  {
    target: '[data-step="1"]',
    content:
      'This is your first project card. It represents a sample multi-modal RAG implementation.',
    disableBeacon: true,
  },
  {
    target: '[data-step="2"]',
    content: 'Click "Get Started" to dive into the project and explore its details!',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState<string>('');
  const [searchValue] = useDebounce(search, 300);

  // Tutorial state from Zustand
  const { homeTutorialCompleted, setHomeTutorialCompleted } = useTutorialStore((state) => state);
  // State for Tour
  const [runTour, setRunTour] = useState(false);

  const { data } = useGetAllProjects({ pageSize: 10, search: searchValue });
  const { mutate, isPending } = useCreateNewProject();

  const flattenedProjects = data?.pages.flat() || [];
  const projectTiles = mapProjectsToTiles(flattenedProjects as Project[]);

  // Only run the tour if the user clicked start AND we have tiles rendered
  const shouldRunTour = runTour && projectTiles.length > 0;

  const { on, Tour } = useJoyride({
    continuous: true,
    steps,
    run: shouldRunTour,
    options: {
      primaryColor: '#0ea5e9',
      backgroundColor: '#fff',
      textColor: '#0f172a',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      width: 400,
      zIndex: 1000,
    },
  });

  // End tutorial and persist state
  useEffect(() => {
    return on('tour:end', () => {
      setRunTour(false);
      setHomeTutorialCompleted(true);
    });
  }, [on, setHomeTutorialCompleted]);

  const handleStartTour = () => {
    setRunTour(true);
  };

  const handleSkipTour = () => {
    setHomeTutorialCompleted(true);
    setRunTour(false);
  };

  // Derive whether the modal should be open based on existing state
  const isWelcomeModalOpen = !homeTutorialCompleted && !runTour;

  return (
    <>
      {/* 1. Welcome Modal for Home Screen */}
      <WelcomeTourModal
        isOpen={isWelcomeModalOpen}
        onOpenChange={(isOpen) => {
          // If the modal closes without clicking start/skip (e.g., clicking outside)
          if (!isOpen) {
            handleSkipTour();
          }
        }}
        onStartTour={handleStartTour}
        onSkipTour={handleSkipTour}
      />

      {/* 2. Main Dashboard UI */}
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        {/* Mount the Joyride Tour */}
        {Tour}

        {/* Header Section */}
        <HomeHeader className="space-y-2" />

        <div className="flex flex-row gap-x-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search through projects..."
          />
          <CreateNewProjectForm handleFormSubmit={mutate} isFormSubmitting={isPending} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectTiles.map((tile, i) => (
            <HomeTileCard
              key={tile.id || i}
              data={tile}
              isFirstTile={i === 0} // Joyride will target the card where this is true
            />
          ))}
        </div>
      </div>
    </>
  );
}
