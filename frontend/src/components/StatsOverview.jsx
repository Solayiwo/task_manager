import { Card, CardContent } from '@/components/ui/card';
import { Layers, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ tasks }) {
  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  const stats = [
    { title: 'Total Tasks', value: total, icon: Layers, color: 'text-slate-900', bg: 'bg-indigo-50 text-indigo-600' },
    { title: 'In Progress', value: inProgress, icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50 text-blue-600' },
    { title: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 text-amber-600' },
    { title: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="shadow-sm border-slate-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{item.title}</p>
                <h3 className={`text-2xl font-bold ${item.color}`}>{item.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}