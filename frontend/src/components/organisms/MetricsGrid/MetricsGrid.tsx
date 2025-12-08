import MetricCard from "@/components/atoms/MetricCard";

export default function MetricsGrid({ tasks }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <MetricCard label="Total de Tarefas" value={tasks.length} />
      <MetricCard label="Tarefas Concluídas" value={tasks.filter((t:any)=>t.status==="Concluído").length} />
      <MetricCard label="Tarefas Atrasadas" value={tasks.filter((t:any)=>t.status==="Atrasado").length} />
      <MetricCard
        label="Média de Conclusão"
        value={`${Math.round(
          (tasks.filter((t:any)=>t.status==="Concluído").length /
            (tasks.length || 1)) * 100
        )}%`}
      />
    </div>
  );
}
