import { CheckCircle, Clock, XCircle, Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/organisms/MetricCard/MetricCard';
import { MonthlyProgressChart } from '@/components/organisms/MonthlyProgressChart';
const MOCK_METRICS = [
  {
    title: 'Tarefas Concluídas',
    value: 1245,
    percentage: 20.1,
    icon: CheckCircle,
    iconColorClass: 'text-blue-600',
  },
  {
    title: 'Tarefas em Andamento',
    value: 350,
    percentage: -5.3,
    icon: Clock,
    iconColorClass: 'text-orange-500',
  },
  {
    title: 'Tarefas Atrasadas',
    value: 42,
    percentage: 15.0,
    icon: XCircle,
    iconColorClass: 'text-red-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo(a) ao Taskly!
        </h1>

        <div className="flex gap-3">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Nova Tarefa
          </Button>
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" /> Criar Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {MOCK_METRICS.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="h-96 bg-gray-50 border rounded-lg p-4">
            Distribuição de Status de Tarefas (Gráfico)
          </div>
        </div>

        <div className="lg:col-span-5">
          <MonthlyProgressChart />
        </div>

        <div className="lg:col-span-3">
          <div className="h-96 bg-gray-50 border rounded-lg p-4">
            Filtros Rápidos (Selects)
          </div>
        </div>
      </div>
    </div>
  );
}
