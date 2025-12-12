import { MoreHorizontal, Calendar, Edit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { EditTaskModal } from '@/components/organisms/EditTaskModal/EditTaskModal';
import { useState } from 'react';
import { Task } from '@/schemas/taskSchema';

interface TaskCardProps {
  id: string;
  title: string;
  responsible: {
    name: string;
    avatarUrl?: string;
  };
  priority: 'Alta' | 'Média' | 'Baixa';
  dueDate: string;
  onTaskUpdated?: () => void;
}

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
    case 'Média':
      return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
    case 'Baixa':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const TaskCard = ({
  id,
  title,
  responsible,
  priority,
  dueDate,
  onTaskUpdated,
}: TaskCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const initials = responsible.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const task: Task = {
    id,
    title,
    status: 'A Fazer',
    priority,
    dueDate: new Date(dueDate),
    projectName: '',
    responsible: {
      name: responsible.name,
      initials,
      avatarUrl: responsible.avatarUrl || '',
    },
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  return (
    <>
      <Card className="gap-2 p-0 w-full bg-white shadow-sm hover:shadow-md transition-all border border-gray-200 rounded-xl">
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mr-2">
            {title}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-2 text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Tarefa
              </DropdownMenuItem>
              <DropdownMenuItem>Mover para...</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-4 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={responsible.avatarUrl} alt={responsible.name} />
              <AvatarFallback className="text-[10px] bg-gray-100 text-gray-600 font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 font-medium">
              {responsible.name}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-2 flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-semibold px-2 py-0.5 border-0',
              getPriorityStyles(priority),
            )}
          >
            {priority}
          </Badge>

          <div className="flex items-center text-xs text-gray-500 font-medium">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span>{dueDate}</span>
          </div>
        </CardFooter>
      </Card>

      <EditTaskModal
        task={task}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onTaskUpdated={onTaskUpdated}
      />
    </>
  );
};
