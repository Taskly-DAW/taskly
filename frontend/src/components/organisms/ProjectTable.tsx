import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useState, useMemo } from 'react';
import { MoreVertical, ArrowDown, ArrowUp } from 'lucide-react';
import { UpdateProjectModal } from './UpdateProjectModal';

import { Project } from '@/schemas/projectSchema';
import { ProgressCell } from '@/components/molecules/ProgressCell';
import { Button } from '../ui/button';

type SortDirection = 'ascending' | 'descending';
type SortableProjectKeys = 'name' | 'responsible' | 'progress' | 'dueDate';

interface SortConfig {
  key: SortableProjectKeys;
  direction: SortDirection;
}

interface ProjectTableProps {
  projects: Project[];
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

export const ProjectTable = ({ projects }: ProjectTableProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedProjects = useMemo(() => {
    let sortableItems = [...projects];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue =
          sortConfig.key === 'responsible'
            ? a.responsible.name
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === 'responsible'
            ? b.responsible.name
            : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [projects, sortConfig]);

  const requestSort = (key: SortableProjectKeys) => {
    let direction: SortDirection = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableProjectKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };
  return (
    <div className="rounded-lg border bg-white shadow-md">
      <h2 className="text-xl font-semibold p-4 border-b">
        Lista de Projetos Ativos
      </h2>

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-gray-700 w-[300px] p-3">
              <Button
                className="px-0 has-[>svg]:px-0"
                variant="ghost"
                onClick={() => requestSort('name')}
              >
                Nome do Projeto
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead className="text-gray-700 w-[200px]">
              <Button
                className="px-0 has-[>svg]:px-0"
                variant="ghost"
                onClick={() => requestSort('responsible')}
              >
                Responsável
                {getSortIcon('responsible')}
              </Button>
            </TableHead>
            <TableHead className="text-gray-700 w-[200px]">
              <Button
                className="px-0 has-[>svg]:px-0"
                variant="ghost"
                onClick={() => requestSort('progress')}
              >
                Progresso
                {getSortIcon('progress')}
              </Button>
            </TableHead>
            <TableHead className="text-gray-700 w-[120px]">
              <Button
                className="px-0 has-[>svg]:px-0"
                variant="ghost"
                onClick={() => requestSort('dueDate')}
              >
                Data Final
                {getSortIcon('dueDate')}
              </Button>
            </TableHead>
            <TableHead className="text-gray-700 w-[80px] text-right pr-4">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <UpdateProjectModal
                project={editingProject!}
                open={!!editingProject && editingProject.id === project.id}
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    setEditingProject(null);
                  }
                }}
              />
              <TableCell className="font-medium text-gray-900 p-4">
                {project.name}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={project.responsible.avatarUrl}
                      alt={project.responsible.name}
                    />
                    <AvatarFallback>
                      {project.responsible.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.responsible.name}</span>
                </div>
              </TableCell>

              <TableCell>
                <ProgressCell progress={project.progress} />
              </TableCell>

              <TableCell className="text-sm text-gray-600">
                {formatDate(project.dueDate)}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setEditingProject(project)}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>Arquivar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
