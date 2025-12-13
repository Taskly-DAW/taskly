'use client';

import React, { useEffect, useCallback } from 'react';
import { ProjectCards } from '@/components/organisms/ProjectCards/ProjectCards';
import { ProjectStatusTabs } from '@/components/molecules/ProjectStatusTabs';
import { ProjectFilter } from '@/components/organisms/ProjectFilter/ProjectFilter';
import { useShallow } from 'zustand/shallow';
import { DashboardState } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import { CreateProjectModal } from '@/components/organisms/CreateProjectModal';
import { Card } from '@/components/ui/card';

export default function TasksPage() {
  const {
    projects,
    isLoading,
    error,
    fetchTasks,
    fetchUsers,
    fetchProjects,
    getFilteredProjects,
    filters,
    setFilter,
  } = useDashboardStore(
    useShallow((state: DashboardState) => ({
      projects: state.projects,
      fetchTasks: state.fetchTasks,
      fetchUsers: state.fetchUsers,
      fetchProjects: state.fetchProjects,
      isLoading: state.isLoading,
      error: state.error,
      getFilteredProjects: state.getFilteredProjects,
      filters: state.filters,
      setFilter: state.setFilter,
    })),
  );

  const filteredProjects = getFilteredProjects();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers();
        await fetchProjects();
        await fetchTasks();
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Filtros
            </h2>
            <ProjectFilter
              searchTerm={filters.projectSearch}
              onSearchChange={(value) => setFilter('projectSearch', value)}
              selectedStatus={filters.projectStatus}
              onStatusChange={(value) => setFilter('projectStatus', value)}
            />
          </Card>
        </div>

        {/* Lista de Projetos */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {filteredProjects.length} de {projects.length} projetos
              </span>
            </div>
            <div className="flex gap-3">
              <CreateProjectModal />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p>Tente ajustar os filtros ou criar um novo projeto.</p>
              </div>
            </Card>
          ) : (
            <ProjectCards projects={filteredProjects} />
          )}
        </div>
      </div>
    </div>
  );
}
