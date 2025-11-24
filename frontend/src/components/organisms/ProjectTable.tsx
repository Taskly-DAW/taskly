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
import { MoreVertical } from 'lucide-react';

import { Project } from '@/schemas/projectSchema';
import { ProgressCell } from '@/components/molecules/ProgressCell';
import { Button } from '../ui/button';

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
  return (
    <div className="rounded-lg border bg-white shadow-md">
      <h2 className="text-xl font-semibold p-4 border-b">
        Lista de Projetos Ativos
      </h2>

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[300px]">Nome do Projeto</TableHead>
            <TableHead className="w-[200px]">Responsável</TableHead>
            <TableHead className="w-[200px]">Progresso</TableHead>
            <TableHead className="w-[120px]">Data Final</TableHead>
            <TableHead className="w-[80px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium text-gray-900">
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
                    <DropdownMenuItem>Editar</DropdownMenuItem>
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
