import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, AlignLeft } from "lucide-react";

export default function ViewTaskModal({ task, isOpen, onClose, onEdit, onDelete }) {
  if (!task) return null;

  const isCompleted = task.status === "completed";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white border border-slate-100 shadow-xl">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mt-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <DialogTitle className="font-bold text-slate-900 text-base">Task Details</DialogTitle>

              <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[11px] font-mono px-2 py-0.5">
                TASK-{task.id || "102"}
              </Badge>
            </div>
            <div className="mt-2 flex items-center">
              <Badge className="bg-blue-50 text-blue-600 border border-blue-200 text-xs px-2.5 py-1 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {task.status === "in_progress" ? "In Progress" : task.status}
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {!isCompleted && (
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-slate-400 hover:text-rose-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
          {task.title}
        </h2>

        {/* Dates Meta Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
            <p className="text-[11px] font-medium text-slate-400 mb-1">Due Date</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">{task.due_date || "Apr 11, 2025"}</span>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
            <p className="text-[11px] font-medium text-slate-400 mb-1">Created Date</p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.created_at || "Mar 25, 2025"}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
            <AlignLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Description</span>
          </div>
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
            {task.description || "No description provided."}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs h-9 px-4">
            Close
          </Button>
          {!isCompleted && (
            <Button onClick={onEdit} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs h-9 px-4 font-semibold">
              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Task
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}