import { Button } from '@/components/ui/button';
import { Plus, Menu } from 'lucide-react';

export default function Header({ onOpenCreate, setIsSidebarOpen }) {
  return (
    <header className="flex items-center justify-between gap-4 pb-6">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Project Deliverables
          </h1>
          <p className="text-sm text-slate-500">
            Track, edit and inspect your sprint milestones
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={onOpenCreate} 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl"
      >
        <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
        Create Task
      </Button>
    </header>
  );
}