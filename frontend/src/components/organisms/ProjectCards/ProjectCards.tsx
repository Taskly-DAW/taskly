'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UpdateProjectModal } from '../UpdateProjectModal';
import { Project } from '@/schemas/projectSchema';
import { useRouter } from 'next/navigation';

interface ProjectCardsProps {
  projects: Project[];
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativos':
      return 'bg-green-100 text-green-800';
    case 'Concluídos':
      return 'bg-blue-100 text-blue-800';
    case 'Arquivados':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ProjectCards = ({ projects }: ProjectCardsProps) => {
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/board?projectId=${projectId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <React.Fragment key={project.id}>
          <UpdateProjectModal
            project={editingProject!}
            open={!!editingProject && editingProject.id === project.id}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setEditingProject(null);
              }
            }}
          />
          
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handleProjectClick(project.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}
                    >
                      Ver Tarefas
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      Arquivar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900 mt-2">
                {project.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {project.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={project.responsible.avatarUrl}
                        alt={project.responsible.name}
                      />
                      <AvatarFallback className="text-xs">
                        {project.responsible.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{project.responsible.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.dueDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};
