"use client";

import { useState, useMemo, useEffect } from "react";
import ReportFiltersCard from "@/components/organisms/ReportFiltersCard/ReportFiltersCard";
import TasksChart from "@/components/organisms/TasksChart/TasksChart";
import MetricsGrid from "@/components/organisms/MetricsGrid/MetricsGrid";
import TasksTable from "@/components/molecules/TasksTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/react/shallow';

export default function ReportsPage() {
  const [chartType, setChartType] = useState("bar");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { tasks, projects, fetchTasks, fetchProjects } = useDashboardStore(
    useShallow((state) => ({
      tasks: state.tasks,
      projects: state.projects,
      fetchTasks: state.fetchTasks,
      fetchProjects: state.fetchProjects,
    }))
  );

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      await fetchTasks();
    };
    loadData();
  }, [fetchProjects, fetchTasks]);

  const formattedTasks = useMemo(() => {
    return tasks.map((task) => ({
      nome: task.title,
      projeto: task.projectName,
      usuario: task.responsible.name,
      vencimento: task.dueDate.toISOString().split('T')[0],
      status: task.status,
    }));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return formattedTasks.filter((t) => {
      const withinStart = startDate ? new Date(t.vencimento) >= new Date(startDate) : true;
      const withinEnd = endDate ? new Date(t.vencimento) <= new Date(endDate) : true;

      const matchProject = projectFilter === "all" || t.projeto === projectFilter;
      const matchUser = userFilter === "all" || t.usuario === userFilter;
      const matchStatus = statusFilter === "all" || t.status === statusFilter;

      return withinStart && withinEnd && matchProject && matchUser && matchStatus;
    });
  }, [formattedTasks, startDate, endDate, projectFilter, userFilter, statusFilter]);

  const chartData = [
    { name: "Concluído", value: filteredTasks.filter(t => t.status === "Concluído").length, color: "#22C55E" },
    { name: "Em Progresso", value: filteredTasks.filter(t => t.status === "Em Progresso").length, color: "#3B82F6" },
    { name: "Bloqueadas", value: filteredTasks.filter(t => t.status === "Bloqueadas").length, color: "#EF4444" },
    { name: "A Fazer", value: filteredTasks.filter(t => t.status === "A Fazer").length, color: "#6B7280" }
  ];

  const projectOptions = useMemo(() => {
    const uniqueProjects = [...new Set(formattedTasks.map(t => t.projeto))];
    return uniqueProjects.filter(project => project !== 'Desconhecido');
  }, [formattedTasks]);

  const userOptions = useMemo(() => {
    const uniqueUsers = [...new Set(formattedTasks.map(t => t.usuario))];
    return uniqueUsers;
  }, [formattedTasks]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set(formattedTasks.map(t => t.status))];
    return uniqueStatuses;
  }, [formattedTasks]);

  const generateReport = () => {
    if (filteredTasks.length === 0) {
      alert('Não há tarefas para gerar o relatório com os filtros selecionados.');
      return;
    }

    const headers = ['Tarefa', 'Projeto', 'Responsável', 'Vencimento', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTasks.map(task => [
        `"${task.nome}"`,
        `"${task.projeto}"`,
        `"${task.usuario}"`,
        `"${task.vencimento}"`,
        `"${task.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    const fileName = `relatorio_tarefas_${today}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        projectOptions={projectOptions}
        userOptions={userOptions}
        statusOptions={statusOptions}
        generateReport={generateReport}
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
          <CardTitle>Tarefas Correspondentes ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TasksTable tasks={filteredTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
