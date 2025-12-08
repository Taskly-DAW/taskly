"use client";

import { useState, useMemo } from "react";
import ReportFiltersCard from "@/components/organisms/ReportFiltersCard/ReportFiltersCard";
import TasksChart from "@/components/organisms/TasksChart/TasksChart";
import MetricsGrid from "@/components/organisms/MetricsGrid/MetricsGrid";
import TasksTable from "@/components/molecules/TasksTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProjectsPage() {
  const [chartType, setChartType] = useState("bar");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const tasks = [
    { nome: "Desenvolver API", projeto: "Projeto Alpha", usuario: "João Silva", vencimento: "2024-07-30", status: "Em Andamento" },
    { nome: "Revisar documentação", projeto: "Projeto Beta", usuario: "Maria Oliveira", vencimento: "2024-07-25", status: "Concluído" },
    { nome: "Planejar sprint 3", projeto: "Projeto Alpha", usuario: "Pedro Souza", vencimento: "2024-07-22", status: "Atrasado" },
    { nome: "Criar layout mobile", projeto: "Projeto Gamma", usuario: "Ana Lima", vencimento: "2024-07-21", status: "Não Iniciado" },
    { nome: "Setup CI/CD", projeto: "Projeto Delta", usuario: "João Silva", vencimento: "2024-07-19", status: "Concluído" },
    { nome: "Reunião com cliente", projeto: "Projeto Beta", usuario: "Carlos Alberto", vencimento: "2024-07-28", status: "Em Andamento" },
    { nome: "Análise de logs", projeto: "Projeto Gamma", usuario: "Ana Lima", vencimento: "2024-07-18", status: "Concluído" },
    { nome: "Testes automatizados", projeto: "Projeto Alpha", usuario: "Pedro Souza", vencimento: "2024-08-01", status: "Atrasado" },
    { nome: "Criar protótipo", projeto: "Projeto Delta", usuario: "Maria Oliveira", vencimento: "2024-07-29", status: "Em Andamento" },
    { nome: "Deploy produção", projeto: "Projeto Beta", usuario: "Carlos Alberto", vencimento: "2024-07-31", status: "Não Iniciado" },
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const withinStart = startDate ? new Date(t.vencimento) >= new Date(startDate) : true;
      const withinEnd = endDate ? new Date(t.vencimento) <= new Date(endDate) : true;

      const matchProject = projectFilter === "all" || t.projeto === projectFilter;
      const matchUser = userFilter === "all" || t.usuario === userFilter;
      const matchStatus = statusFilter === "all" || t.status === statusFilter;

      return withinStart && withinEnd && matchProject && matchUser && matchStatus;
    });
  }, [tasks, startDate, endDate, projectFilter, userFilter, statusFilter]);

  const chartData = [
    { name: "Concluído", value: filteredTasks.filter(t => t.status === "Concluído").length, color: "#1E88E5" },
    { name: "Em Andamento", value: filteredTasks.filter(t => t.status === "Em Andamento").length, color: "#212121" },
    { name: "Atrasado", value: filteredTasks.filter(t => t.status === "Atrasado").length, color: "#E57373" },
    { name: "Não Iniciado", value: filteredTasks.filter(t => t.status === "Não Iniciado").length, color: "#424242" }
  ];

  return (
    <div className="p-8 w-full text-gray-900">
      <h1 className="text-4xl font-bold mb-10">Relatórios de Tarefas</h1>

      <ReportFiltersCard
        startDate={startDate}
        endDate={endDate}
        onStart={(e:any)=>setStartDate(e.target.value)}
        onEnd={(e:any)=>setEndDate(e.target.value)}
        setProjectFilter={setProjectFilter}
        setUserFilter={setUserFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={() => {
          setStartDate("");
          setEndDate("");
          setProjectFilter("all");
          setUserFilter("all");
          setStatusFilter("all");
        }}
      />

      <TasksChart
        chartType={chartType}
        setChartType={setChartType}
        chartData={chartData}
      />

      <MetricsGrid tasks={filteredTasks} />

      <Card className="shadow-sm mb-10">
        <CardHeader>
          <CardTitle>Tarefas Correspondentes</CardTitle>
        </CardHeader>
        <CardContent>
          <TasksTable tasks={filteredTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
