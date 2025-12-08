import TaskColumn from "@/components/molecules/TaskColumn";
import { Task } from "@/types/tasks";

interface Column {
  title: string;
  items: Task[];
}

interface TasksBoardProps {
  columns: Column[];
}

export default function TasksBoard({ columns }: TasksBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <TaskColumn
          key={col.title}
          title={col.title}
          items={col.items}
        />
      ))}
    </div>
  );
}