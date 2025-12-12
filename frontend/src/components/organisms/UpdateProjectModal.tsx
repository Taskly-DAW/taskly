// UpdateProjectModal.tsx - Atualizando para lidar com carregamento assíncrono

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import {
  CreateProjectSchema,
  CreateProjectFormData,
  Project,
} from '@/schemas/projectSchema';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SelectOption } from '@/types/dashboard';

interface UpdateProjectModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function UpdateProjectModal({
  project,
  open,
  onOpenChange,
  children,
}: UpdateProjectModalProps) {
  const updateProject = useDashboardStore((state) => state.updateProject);
  const fetchUsers = useDashboardStore((state) => state.fetchUsers);
  const users = useDashboardStore((state) => state.users);
  const isLoadingUsers = useDashboardStore((state) => state.isLoadingUsers);
  const error = useDashboardStore((state) => state.error);
  const getResponsibleOptions = useDashboardStore(
    (state) => state.getResponsibleOptions,
  );
  const [responsibleOptions, setResponsibleOptions] = useState<
    SelectOption<string>[]
  >([]);

  // Carrega os usuários quando o modal é aberto
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, fetchUsers]);

  // Atualiza as opções de responsáveis quando os usuários são carregados
  useEffect(() => {
    if (users.length > 0) {
      const options = getResponsibleOptions();
      setResponsibleOptions(
        options.filter((option) => option.value !== 'Todos os Responsáveis'),
      );
    }
  }, [users, getResponsibleOptions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      responsible: project?.responsible?.name || '',
    },
  });

  // Atualiza os valores do formulário quando o projeto ou o modal é aberto
  useEffect(() => {
    if (open && project) {
      reset({
        name: project.name,
        description: project.description,
        responsible: project.responsible?.name || '',
      });
    }
  }, [open, project, reset]);

  const onSubmit = async (data: CreateProjectFormData) => {
    await updateProject(project.id, { ...data, tenant_id: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
            <DialogDescription>
              Atualize as informações do projeto. Clique em salvar quando
              terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              placeholder="Nome do projeto"
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o projeto"
              {...register('description')}
              disabled={isSubmitting}
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsible_id">Responsável</Label>
            {isLoadingUsers ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Carregando usuários...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : (
              <Select
                onValueChange={(value) => {
                  const setValue = register('responsible_id').onChange;
                  setValue?.({ target: { name: 'responsible_id', value } } as any);
                }}
                defaultValue={project?.responsible_id?.name || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent>
                  {responsibleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback>
                            {option.label.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.responsible_id && (
              <p className="text-sm text-red-500">
                {errors.responsible_id.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingUsers}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
