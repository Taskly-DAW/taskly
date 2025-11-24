'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectStatusTabsProps {
  currentStatus: string;
  onStatusChange: (status: 'Ativos' | 'Concluídos' | 'Arquivados') => void;
}

export const ProjectStatusTabs = ({
  currentStatus,
  onStatusChange,
}: ProjectStatusTabsProps) => {
  return (
    <Tabs
      defaultValue={currentStatus}
      onValueChange={(value) =>
        onStatusChange(value as 'Ativos' | 'Concluídos' | 'Arquivados')
      }
      className="mb-6 w-fit"
    >
      <TabsList>
        <TabsTrigger value="Ativos">Ativos</TabsTrigger>
        <TabsTrigger value="Concluídos">Concluídos</TabsTrigger>
        <TabsTrigger value="Arquivados">Arquivados</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
