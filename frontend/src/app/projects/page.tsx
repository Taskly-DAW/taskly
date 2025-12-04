'use client';
import React, { useEffect, useState } from 'react';
import { ProjectTable } from '@/components/organisms/ProjectTable';
import { ProjectStatusTabs } from '@/components/molecules/ProjectStatusTabs';
import { Project } from '@/schemas/projectSchema';
import { useShallow } from 'zustand/shallow';
import { DashboardState } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';

export default function ProjectsPage() {
  const { projects, fetchProjects, isLoading, error } = useDashboardStore(
    useShallow((state: DashboardState) => ({
      projects: state.projects,
      fetchProjects: state.fetchProjects,
      isLoading: state.isLoading,
      error: state.error,
    })),
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (isLoading) {
    return <div className="p-6">Carregando projetos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Projetos</h1>
      <ProjectStatusTabs currentStatus="Ativos" onStatusChange={() => {}} />
      <ProjectTable projects={projects} />
    </div>
  );
}
