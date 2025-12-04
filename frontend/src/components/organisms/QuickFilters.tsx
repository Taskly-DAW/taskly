'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/store/dashboardStore';
import { useShallow } from 'zustand/react/shallow';
import { MultiSelectFilter } from '@/components/molecules/MultiSelectFilter';
import { projectOptions, statusOptions, responsibleOptions, periodOptions } from '@/data/filterOptions';

type MultiFilterKey = 'project' | 'status' | 'responsible';

export const QuickFilters = () => {
    const { filters, setFilter } = useDashboardStore(
        useShallow((state) => ({
            filters: state.filters,
            setFilter: state.setFilter,
        }))
    );

    const handleMultiFilterChange = (key: MultiFilterKey, newValues: string[]) => {
        const allLabelMap = {
            project: 'Todos os Projetos',
            status: 'Todos os Status',
            responsible: 'Todos os Responsáveis',
        };
        const allLabel = allLabelMap[key];
        const oldValues = filters[key] || [];

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
        const labelToStore = periodOptions.find(o => o.value === value)?.label || value;
        setFilter('period', labelToStore);
    };

    const getPeriodValue = (): string => {
        const currentLabel = filters.period;
        const option = periodOptions.find(o => o.label === currentLabel);
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
                        options={projectOptions}
                        selectedValues={filters.project}
                        onValueChange={(values) => handleMultiFilterChange('project', values)}
                    />
                </div>

                <div className="mb-4">
                    <MultiSelectFilter
                        placeholder="Todos os Status"
                        options={statusOptions}
                        selectedValues={filters.status}
                        onValueChange={(values) => handleMultiFilterChange('status', values)}
                    />
                </div>

                <div className="mb-4">
                    <MultiSelectFilter
                        placeholder="Todos os Responsáveis"
                        options={responsibleOptions}
                        selectedValues={filters.responsible}
                        onValueChange={(values) => handleMultiFilterChange('responsible', values)}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        value={getPeriodValue()}
                        onValueChange={handleSingleFilterChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={filters.period} /> 
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