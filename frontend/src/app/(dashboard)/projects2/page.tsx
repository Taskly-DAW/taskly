'use client';
import React, { useEffect, useCallback } from 'react';
import { ProjectTable } from '@/components/organisms/ProjectTable';
import { ProjectStatusTabs } from '@/components/molecules/ProjectStatusTabs';
import { useShallow } from 'zustand/shallow';
import { DashboardState } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import { CreateProjectModal } from '@/components/organisms/CreateProjectModal';

export default function ProjectsPage() {
  const { projects, isLoading, error, fetchTasks, fetchUsers, fetchProjects } = useDashboardStore(
    useShallow((state: DashboardState) => ({
      projects: state.projects,
      fetchTasks: state.fetchTasks,
      fetchUsers: state.fetchUsers,
      fetchProjects: state.fetchProjects,
      isLoading: state.isLoading,
      error: state.error,
    })),
    );

    useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers(); // Aguarda os usuários carregarem
        await fetchProjects(); // Depois carrega os projetos
        await fetchTasks(); // Por fim, carrega as tarefas
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, [fetchUsers, fetchProjects, fetchTasks]);


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
