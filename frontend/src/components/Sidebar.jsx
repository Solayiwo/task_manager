import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Layers, RefreshCw, Clock, CheckCircle2, Check } from "lucide-react";

export default function Sidebar({ statusFilter, setStatusFilter, stats, isOpen, setIsOpen }) {
  const { total, inProgress, pending, completed, health } = stats;

  const navItems = [
    { label: "All Tasks", value: "All", count: total, icon: Layers, color: "text-slate-600" },
    { label: "In Progress", value: "In Progress", count: inProgress, icon: RefreshCw, color: "text-blue-500" },
    { label: "Pending", value: "Pending", count: pending, icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: "Completed", count: completed, icon: CheckCircle2, color: "text-emerald-500" },
  ];

  const SidebarBody = () => (
    <div className="flex flex-col justify-between h-full py-2">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">TaskFlow</span>
              <Badge variant="secondary" className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0">PRO</Badge>
            </div>
            <p className="text-xs text-slate-400">Workspace Manager</p>
          </div>
        </div>

        {/* Navigation / Filters */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Overview</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = statusFilter === item.value;
            return (
              <Button
                key={item.value}
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => {
                  setStatusFilter(item.value);
                  if (setIsOpen) setIsOpen(false);
                }}
                className={`w-full justify-between px-3 py-2.5 h-auto rounded-xl text-sm font-medium ${
                  isActive ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={isActive ? "bg-indigo-100 border-indigo-200 text-indigo-700" : "bg-slate-100 border-slate-200 text-slate-600"}
                >
                  {item.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Sprint Health Widget */}
        <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-700">Sprint Milestones</span>
            <span className="text-xs font-bold text-indigo-600">{health}%</span>
          </div>
          <Progress value={health} className="h-2 bg-slate-200" />
          <p className="text-[11px] text-slate-400 mt-2">{completed} of {total} deliverables finished.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen bg-white border-r border-slate-200 shrink-0 p-4">
        <SidebarBody />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-4 bg-white">
          <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
          <SidebarBody />
        </SheetContent>
      </Sheet>
    </>
  );
}