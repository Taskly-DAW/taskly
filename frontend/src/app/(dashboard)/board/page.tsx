'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from '@/components/organisms/KanbanColumn';
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/react/shallow';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { AddTaskModal } from '@/components/organisms/AddTaskModal/AddTaskModal';

const COLUMNS = [
  { id: "A Fazer", title: "A Fazer" },
  { id: "Em Progresso", title: "Em Progresso" },
  { id: "Bloqueadas", title: "Bloqueadas" },
  { id: "Concluído", title: "Concluído" },
];

export default function TasksPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const { tasks, moveTask, fetchTasks, fetchTasksByProject, fetchProjects, updateTaskStatus } = useDashboardStore(
    useShallow((state) => ({
      tasks: state.tasks,
      moveTask: state.moveTask,
      fetchTasks: state.fetchTasks,
      fetchTasksByProject: state.fetchTasksByProject,
      fetchProjects: state.fetchProjects,
      updateTaskStatus: state.updateTaskStatus,
    }))
  );

  useEffect(() => {
    const loadTasks = async () => {
      if (projectId) {
        await fetchProjects(); // Carrega projetos para ter informações
        await fetchTasksByProject(projectId);
      } else {
        await fetchTasks(); // Carrega todas as tasks se não houver projectId
      }
    };
    
    loadTasks();
  }, [projectId, fetchTasks, fetchTasksByProject, fetchProjects]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === result.source.droppableId &&
      destination.index === result.source.index
    ) {
      return;
    }

    // Atualizar status na API ao mover
    await updateTaskStatus(draggableId, destination.droppableId);
  };

  const projectName = tasks.length > 0 ? tasks[0].projectName : 'Todas as Tarefas';

  const handleTaskAdded = () => {
    // Recarregar as tasks após adicionar uma nova
    if (projectId) {
      fetchTasksByProject(projectId);
    } else {
      fetchTasks();
    }
  };

  const handleTaskUpdated = () => {
    // Recarregar as tasks após editar uma task
    if (projectId) {
      fetchTasksByProject(projectId);
    } else {
      fetchTasks();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {projectId ? `Tarefas - ${projectName}` : 'Minhas Tarefas'}
        </h1>
        {projectId && <AddTaskModal onTaskAdded={handleTaskAdded} />}
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto h-full pb-4">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((task) => task.status === col.id);
            
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={columnTasks}
                onTaskUpdated={handleTaskUpdated}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}