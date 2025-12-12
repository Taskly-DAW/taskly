'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from '@/components/molecules/TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Task } from '@/schemas/taskSchema';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export const KanbanColumn = ({ id, title, tasks }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col w-full max-w-sm min-w-[300px] bg-gray-50 border rounded-lg shadow-inner p-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              'flex flex-col gap-3 overflow-y-auto min-h-[150px] transition-colors',
              snapshot.isDraggingOver ? 'bg-gray-100/50 rounded-md' : '',
            )}
            
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                    className='gap-1'
                  >
                    <TaskCard
                      id={task.id}
                      title={task.title}
                      priority={task.priority}
                      dueDate={
                        new Date(task.dueDate).toISOString().split('T')[0]
                      }
                      responsible={task.responsible}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Botão Adicionar */}
      <Button
        variant="ghost"
        className="mt-4 justify-center text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" /> Adicionar Tarefa
      </Button>
    </div>
  );
};
