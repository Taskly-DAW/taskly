'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Folder, ListChecks, BarChart2 } from 'lucide-react';
import { SidebarItem } from '@/components/molecules/SidebarItem';

const routes = [
  {
    icon: LayoutDashboard,
    label: "Painel",
    href: "/",
  },
  {
    icon: Folder,
    label: "Projetos",
    href: "/projects",
  },
  {
    icon: ListChecks,
    label: "Tarefas",
    href: "/tasks",
  },
  {
    icon: BarChart2,
    label: "Relatórios",
    href: "/reports",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm w-[240px] fixed top-0 left-0 z-10">
      
      <div className="flex items-center h-16 p-4 border-b">
        <span className="text-2xl font-bold text-blue-600">
          <span className='mr-1'>*</span>Taskly
        </span>
      </div>

      <div className="flex flex-col w-full py-2">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            isActive={pathname === route.href} 
          />
        ))}
      </div>
    </div>
  );
};