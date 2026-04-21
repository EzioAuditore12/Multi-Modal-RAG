'use client';

import { Code } from 'lucide-react';
import { useState } from 'react';
import type { Route } from 'next';
import { useDebounce } from 'use-debounce';

import { HomeHeader } from '@/features/home/components/header';
import { HomeTileCard, type Tile } from '@/features/home/components/tiles/card';
import { useGetAllProjects } from '@/features/home/hooks/use-get-all-projects';
import { Project } from '@/features/home/schemas/project.schema';
import { Input } from '@/components/ui/input';
import { CreateNewProjectForm } from '@/features/project/components/create-new-project-form';
import { useCreateNewProject } from '@/features/project/hooks/use-create-new-project';

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

export default function HomeScreen() {
  const [search, setSearch] = useState<string>('');

  const [searchValue] = useDebounce(search, 300);

  const { data } = useGetAllProjects({ pageSize: 10, search: searchValue });
  const { mutate, isPending } = useCreateNewProject();

  const flattenedProjects = data?.pages.flat() || [];
  const projectTiles = mapProjectsToTiles(flattenedProjects as Project[]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Header Section */}
      <HomeHeader className="space-y-2" />

      <div className="flex flex-row gap-x-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Serach through projects ..."
        />

        <CreateNewProjectForm handleFormSubmit={mutate} isFormSubmitting={isPending} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectTiles.map((tile, i) => (
          <HomeTileCard key={i} data={tile} />
        ))}
      </div>
    </div>
  );
}
