'use client';

import { useState } from "react";
import TasksBoard from "@/components/organisms/TaskBoard/TaskBoard";
import { MOCK_TASKS } from "@/data/MockTasks";
import { Task } from "@/types/tasks";

export default function TasksPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);

  const columns = [
    { 
      title: "A Fazer", 
      items: tasks.filter(t => t.status === "A Fazer") 
    },
    { 
      title: "Em Progresso", 
      items: tasks.filter(t => t.status === "Em Progresso") 
    },
    { 
      title: "Concluído", 
      items: tasks.filter(t => t.status === "Concluído") 
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Minhas Tarefas
      </h1>

      <TasksBoard columns={columns} />
    </div>
  );
}
