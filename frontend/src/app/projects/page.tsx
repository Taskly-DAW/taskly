'use client';
import React, { useEffect } from 'react';
import { ProjectTable } from '@/components/organisms/ProjectTable';
import { ProjectStatusTabs } from '@/components/molecules/ProjectStatusTabs';
import { useShallow } from 'zustand/shallow';
import { DashboardState } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import { CreateProjectModal } from '@/components/organisms/CreateProjectModal';

export default function ProjectsPage() {
  const { projects, fetchProjects, isLoading, error, fetchTasks, tasks } =
    useDashboardStore(
      useShallow((state: DashboardState) => ({
        projects: state.projects,
        fetchProjects: state.fetchProjects,
        fetchTasks: state.fetchTasks,
        isLoading: state.isLoading,
        error: state.error,
        tasks: state.tasks,
      })),
    );

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  if (isLoading) {
    return <div className="p-6">Carregando projetos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Projetos</h1>
      <div className="flex justify-between mb-6">
        {' '}
        <ProjectStatusTabs currentStatus="Ativos" onStatusChange={() => {}} />
        <div className="flex gap-3">
          <CreateProjectModal />
        </div>
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
