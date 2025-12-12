"use client"

import { Search, Bell, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Header = () => {
  const handleLogout = () => {
    // Implementar lógica de logout
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('tenantId');
    
    // Limpar todos os cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b shadow-sm flex items-center justify-end pr-6">
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Input
            type="search"
            placeholder="Pesquisar tarefas ou projetos..."
            className="pl-10 h-10 rounded-lg focus-visible:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 text-gray-600 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors">
                <AvatarImage src="/path/to/profile-image.jpg" alt="User Profile" />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
