'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from '@/components/organisms/KanbanColumn';
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/react/shallow';

const COLUMNS = [
  { id: "A Fazer", title: "A Fazer" },
  { id: "Em Progresso", title: "Em Progresso" },
  { id: "Concluído", title: "Concluído" },
];

export default function TasksPage() {
  const { tasks, moveTask } = useDashboardStore(
    useShallow((state) => ({
      tasks: state.tasks,
      moveTask: state.moveTask,
    }))
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === result.source.droppableId &&
      destination.index === result.source.index
    ) {
      return;
    }

    moveTask(draggableId, destination.droppableId);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Minhas Tarefas</h1>
      
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
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}