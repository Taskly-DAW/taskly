'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface AddTaskModalProps {
  onTaskAdded?: () => void;
}

const statusOptions = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'doing', label: 'Em Progresso' },
  { value: 'block', label: 'Bloqueada' },
  { value: 'done', label: 'Concluída' },
];

export const AddTaskModal = ({ onTaskAdded }: AddTaskModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'doing' | 'block' | 'done',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !projectId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8002/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          project_id: parseInt(projectId),
          description: formData.description,
          status: formData.status,
          priority: 0,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'todo',
      });
      
      setOpen(false);
      onTaskAdded?.();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
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
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Adicionar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
