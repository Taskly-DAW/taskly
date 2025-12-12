'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/react/shallow';
import { MultiSelectFilter } from '../molecules/MultiSelectFilter';
import { useEffect } from 'react';

const periodOptions = [
  { value: '7d', label: 'Últimos 7 Dias' },
  { value: '30d', label: 'Últimos 30 Dias' },
  { value: '90d', label: 'Últimos 90 Dias' },
  { value: 'all', label: 'Todo o Período' },
];

type MultiFilterKey = 'projects' | 'status' | 'responsible';

export const QuickFilters = () => {
  const {
    filters,
    setFilter,
    getProjectOptions,
    getStatusOptions,
    getResponsibleOptions,
    fetchProjects,projects
  } = useDashboardStore(
    useShallow((state) => ({
      filters: state.filters,
      projects: state.projects,
      fetchProjects: state.fetchProjects,
      setFilter: state.setFilter,
      getProjectOptions: state.getProjectOptions,
      getStatusOptions: state.getStatusOptions,
      getResponsibleOptions: state.getResponsibleOptions,
    })),
  );

  const handleMultiFilterChange = (
    key: MultiFilterKey,
    newValues: string[],
  ) => {
    const allLabelMap = {
      projects: 'Todos os Projetos',
      status: 'Todos os Status',
      responsible: 'Todos os Responsáveis',
    };
    const allLabel = allLabelMap[key];
    const oldValues = (filters as any)[key] || [];    

    if (newValues.length === 0) {
      setFilter(key, [allLabel] as any);
    } else if (newValues.includes(allLabel) && !oldValues.includes(allLabel)) {
      setFilter(key, [allLabel] as any);
    } else if (newValues.length > 1 && oldValues.includes(allLabel)) {
      const valuesWithoutAll = newValues.filter((v) => v !== allLabel);
      setFilter(key, valuesWithoutAll as any);
    } else {
      setFilter(key, newValues as any);
    }
  };

  const handleSingleFilterChange = (value: string) => {
    setFilter('period', value);
  };

  const getPeriodValue = (): string => {
    const currentValue = filters.period;
    const option = periodOptions.find((o) => o.value === currentValue);
    return option ? option.value : '7d';
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Filtros Rápidos</CardTitle>
        <CardDescription>
          Refine os dados do painel selecionando os filtros abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <MultiSelectFilter
            placeholder="Todos os Projetos"
            options={getProjectOptions()}
            selectedValues={filters.projects}
            onValueChange={(values) =>
              handleMultiFilterChange('projects', values)
            }
          />
        </div>

        <div className="mb-4">
          <MultiSelectFilter
            placeholder="Todos os Status"
            options={getStatusOptions()}
            selectedValues={filters.status}
            onValueChange={(values) =>
              handleMultiFilterChange('status', values)
            }
          />
        </div>

        <div className="mb-4">
          <MultiSelectFilter
            placeholder="Todos os Responsáveis"
            options={getResponsibleOptions()}
            selectedValues={filters.responsible}
            onValueChange={(values) =>
              handleMultiFilterChange('responsible', values)
            }
          />
        </div>

        <div className="mb-4">
          <Select
            value={getPeriodValue()}
            onValueChange={handleSingleFilterChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
