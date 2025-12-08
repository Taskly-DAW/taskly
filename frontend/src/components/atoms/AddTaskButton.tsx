import { Plus } from "lucide-react";

interface AddTaskButtonProps {
  onClick: () => void;
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full flex justify-center items-center text-blue-600 text-sm font-medium hover:underline"
    >
      <Plus size={16} className="mr-1" />
      Adicionar Tarefa
    </button>
  );
}