import TaskCard from "@/components/atoms/TaskCard";
import AddTaskButton from "@/components/atoms/AddTaskButton";
import { Task } from "@/types/tasks";

interface TaskColumnProps {
  title: string;
  items: Task[];
}

export default function TaskColumn({ title, items }: TaskColumnProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-gray-900">
          {title}
        </h2>

        <span className="text-base bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
          {items.length}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <AddTaskButton onClick={() => {}} />
    </div>
  );
}
