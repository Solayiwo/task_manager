import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return null;

  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function TaskCard({ task, onView, onEdit, onDelete }) {
  const getBadgeProps = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
      case 'in_progress':
        return { label: 'In Progress', className: 'border-blue-200 bg-blue-50 text-blue-700' };
      default:
        return { label: 'Pending', className: 'border-amber-200 bg-amber-50 text-amber-700' };
    }
  };

  const badge = getBadgeProps(task.status);

  return (
    <Card className="shadow-sm border-slate-200 flex flex-col justify-between hover:shadow-md transition">
      <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
        <Badge variant="outline" className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${badge.className}`}>
          {badge.label}
        </Badge>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-700" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          {task.status !== 'completed' && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-600" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2">
        <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-1">{task.title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
          {task.description || "No description provided."}
        </p>
      </CardContent>

      <CardFooter className="px-5 pt-3 pb-4 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-400">
        <div className="w-full flex justify-between items-center">
          <span>Created:</span>
          <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {formatDate(task.created_at) || 'Unknown'}
          </span>
        </div>
        <div className="w-full flex justify-between items-center">
          <span>Due:</span>
          <span className="font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
            {formatDate(task.due_date) || 'No due date'}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}