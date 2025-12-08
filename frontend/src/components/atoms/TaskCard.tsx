import { MoreHorizontal, Calendar, User } from "lucide-react";
import PriorityTag from "./PriorityTag";
import DateTag from "./DateTag";
import { Task } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-base">
          {task.title}
        </h3>

        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
      </div>

      <div className="flex items-center gap-2 text-gray-700 mb-3">
        <User size={18} />
        <span className="text-sm font-medium">{task.responsible}</span>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <PriorityTag priority={task.priority} />
        <DateTag date={task.dueDate} />
      </div>
    </div>
  );
}