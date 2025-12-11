'use client';

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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { CreateProjectSchema, CreateProjectFormData } from '@/schemas/projectSchema';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const createProject = useDashboardStore((state) => state.createProject);
  const getResponsibleOptions = useDashboardStore((state) => state.getResponsibleOptions);
  const [responsibleOptions, setResponsibleOptions] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    if (open) {
      const options = getResponsibleOptions();
      // Remove a opção "Todos os Responsáveis" do array
      setResponsibleOptions(options?.filter(option => option.value !== 'Todos os Responsáveis'));
    }
  }, [open, getResponsibleOptions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(CreateProjectSchema),
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    await createProject(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-black text-white hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" /> Criar Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para iniciar um novo projeto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              placeholder="Ex: Redesign do Dashboard"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Detalhes opcionais sobre o projeto..."
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Select
              onValueChange={(value) => {
                // Atualiza o valor do formulário quando uma opção é selecionada
                const setValue = register('responsible').onChange;
                setValue?.({ target: { name: 'responsible', value } } as any);
              }}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {responsibleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback>{option.label.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.responsible && (
              <p className="text-sm text-red-500">{errors.responsible.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Criar Projeto'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}