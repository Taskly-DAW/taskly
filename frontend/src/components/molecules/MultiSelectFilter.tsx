'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  options: Option[];
  placeholder: string;
  selectedValues: string[];
  onValueChange: (newValues: string[]) => void;
}

export const MultiSelectFilter = ({
  options,
  placeholder,
  selectedValues,
  onValueChange,
}: MultiSelectFilterProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    const isSelected = selectedValues.includes(value);
    
    let newSelection;
    if (isSelected) {
      newSelection = selectedValues.filter((v) => v !== value);
    } else {
      newSelection = [...selectedValues, value];
    }
    onValueChange(newSelection);
  };
  
  const handleRemoveBadge = (valueToRemove: string) => {
    const newSelection = selectedValues.filter((v) => v !== valueToRemove);
    onValueChange(newSelection);
  };
  
  const displayLabel = selectedValues.length > 0 
    ? selectedValues.map(v => v).join(', ') 
    : placeholder;
    
  const allValue = options[0]?.label; 

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 px-3 overflow-hidden"
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
              {selectedValues.length < 3 ? (
                selectedValues.map((value) => (
                  <Badge 
                    key={value} 
                    variant="secondary" 
                    className="text-xs py-0.5 px-2 font-normal"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBadge(value);
                    }}
                  >
                    {value}
                    <X className="w-3 h-3 ml-1 cursor-pointer" />
                  </Badge>
                ))
              ) : (
                <span className="text-sm truncate">
                    {selectedValues.slice(0, 1).join(', ')}... (+{selectedValues.length - 1} )
                </span>
              )}
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar ${placeholder.toLowerCase()}...`} /> 
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isChecked = selectedValues.includes(option.label);
                
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.label)}
                    className="flex justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                        <Check 
                            className={cn(
                                "mr-2 h-4 w-4",
                                isChecked ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {option.label}
                    </div>
                    {isChecked && <div className="ml-auto h-4 w-4 rounded-full bg-blue-600" />} 
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};