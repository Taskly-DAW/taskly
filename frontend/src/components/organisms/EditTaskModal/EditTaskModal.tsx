'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { Task } from '@/schemas/taskSchema';
import { useDashboardStore } from '@/store/dashboardStore';
import { useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

interface EditTaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated?: () => void;
}

const statusOptions = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'doing', label: 'Em Progresso' },
  { value: 'block', label: 'Bloqueada' },
  { value: 'done', label: 'Concluída' },
];

const statusMapping: Record<string, 'todo' | 'doing' | 'block' | 'done'> = {
  'A Fazer': 'todo',
  'Em Progresso': 'doing',
  'Bloqueadas': 'block',
  'Concluído': 'done',
};

const reverseStatusMapping: Record<'todo' | 'doing' | 'block' | 'done', string> = {
  'todo': 'A Fazer',
  'doing': 'Em Progresso',
  'block': 'Bloqueadas',
  'done': 'Concluído',
};

export const EditTaskModal = ({ task, open, onOpenChange, onTaskUpdated }: EditTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'doing' | 'block' | 'done',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const { updateTask, fetchTasksByProject, fetchTasks, projects } = useDashboardStore(
    useShallow((state) => ({
      updateTask: state.updateTask,
      fetchTasksByProject: state.fetchTasksByProject,
      fetchTasks: state.fetchTasks,
      projects: state.projects,
    }))
  );

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: statusMapping[task.status] || 'todo',
      });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !task) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Encontrar o project_id correto
      let project_id = 1; // valor padrão
      
      if (projectId) {
        project_id = parseInt(projectId);
      } else {
        // Tentar encontrar pelo nome do projeto da task
        const project = projects.find(p => p.name === task.projectName);
        if (project) {
          project_id = parseInt(project.id);
        }
      }

      await updateTask(task.id, {
        title: formData.title,
        project_id,
        description: formData.description,
        status: formData.status,
        priority: 0,
        completed: formData.status === 'done',
      });

      onOpenChange(false);
      onTaskUpdated?.();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      // TODO: Adicionar toast de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Digite o título da tarefa..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Digite a descrição da tarefa..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'todo' | 'doing' | 'block' | 'done') => 
                handleInputChange('status', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
