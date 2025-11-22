import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Header = () => {
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

        <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors">
          <AvatarImage src="/path/to/profile-image.jpg" alt="User Profile" />

          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
