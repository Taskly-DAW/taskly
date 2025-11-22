import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; 

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link href={href} passHref>
      <div
        className={cn(
          "flex items-center gap-3 p-3 text-sm font-medium transition-colors cursor-pointer",
          "hover:bg-gray-100 dark:hover:bg-gray-800",

          isActive
            ? "bg-gray-100 dark:bg-gray-800 text-blue-600 font-semibold border-r-4 border-blue-600"
            : "text-gray-600 dark:text-gray-400"
        )}
      >
        {/* Ícone */}
        <Icon className="h-5 w-5" />

        {/* Rótulo */}
        <span>{label}</span>
      </div>
    </Link>
  );
};