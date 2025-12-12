'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface ProjectFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;
}

const statusOptions = [
  { value: 'Ativos', label: 'Ativos', color: 'bg-green-100 text-green-800' },
  { value: 'Concluídos', label: 'Concluídos', color: 'bg-blue-100 text-blue-800' },
  { value: 'Arquivados', label: 'Arquivados', color: 'bg-gray-100 text-gray-800' },
];

export const ProjectFilter = ({ 
  searchTerm, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange 
}: ProjectFilterProps) => {
  
  const handleStatusToggle = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange([]);
  };

  const hasActiveFilters = searchTerm || selectedStatus.length > 0;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar projetos por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Status</div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Badge
              key={status.value}
              className={`cursor-pointer transition-colors ${
                selectedStatus.includes(status.value)
                  ? status.color
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {searchTerm && `Busca: "${searchTerm}"`}
            {searchTerm && selectedStatus.length > 0 && ' • '}
            {selectedStatus.length > 0 && `${selectedStatus.length} status selecionado(s)`}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
};
