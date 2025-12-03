'use client';
import React, { useState } from 'react';
import { ProjectTable } from '@/components/organisms/ProjectTable';
import { ProjectStatusTabs } from '@/components/molecules/ProjectStatusTabs';
import { Project } from '@/schemas/projectSchema';

const MOCK_PROJECTS: Project[] = [
  {
    id: "1", name: "Desenvolvimento da Plataforma v2", 
    responsible: { name: "Maria Oliveira", avatarUrl: "..." }, 
    progress: 75, dueDate: new Date("2024-12-31"), status: "Ativos"
  },
  {
    id: "2", name: "Campanha de Marketing Digital Q3", 
    responsible: { name: "João Silva", avatarUrl: "..." }, 
    progress: 90, dueDate: new Date("2024-09-30"), status: "Ativos"
  },
  {
    id: "10", name: "Projeto Antigo", 
    responsible: { name: "Antônio Costa", avatarUrl: "..." }, 
    progress: 100, dueDate: new Date("2023-01-01"), status: "Concluídos"
  },
] as Project[];

export default function ProjectsPage() {
  const [activeStatus, setActiveStatus] = useState<'Ativos' | 'Concluídos' | 'Arquivados'>('Ativos');
  
  const filteredProjects = MOCK_PROJECTS.filter(p => p.status === activeStatus);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Projetos</h1>
      
      <ProjectStatusTabs 
        currentStatus={activeStatus} 
        onStatusChange={setActiveStatus} 
      />
      
      <ProjectTable projects={filteredProjects} />
    </div>
  );
}