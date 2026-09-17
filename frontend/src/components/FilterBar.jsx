import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown } from 'lucide-react';

export default function FilterBar({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, sortBy, setSortBy }) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input 
          type="text"
          placeholder="Search by title, description or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-50 border-slate-200 rounded-xl text-xs h-9"
        />
      </div>

      {/* Filter Status Buttons */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-medium mr-1">Status:</span>
        {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
          <Button
            key={st}
            size="sm"
            variant={statusFilter === st ? "default" : "ghost"}
            onClick={() => setStatusFilter(st)}
            className={`h-7 text-xs rounded-lg ${
              statusFilter === st ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </Button>
        ))}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-400 font-medium">Sort:</span>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 py-1 px-2 focus:outline-none"
        >
          <option value="due_date">Due Date</option>
          <option value="created_at">Created Date</option>
        </select>
      </div>
    </div>
  );
}