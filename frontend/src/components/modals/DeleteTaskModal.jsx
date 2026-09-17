import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";

export default function DeleteTaskModal({ task, isOpen, onClose, onConfirm, error, onDismissError }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
    }
  }, [isOpen, task?.id]);

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-slate-100 shadow-xl">
        {/* Warning Badge Icon */}
        <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 leading-snug">
          Delete Task Deliverable?
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mt-1 mb-4">
          Are you sure you want to permanently delete this task? This action cannot be undone and will remove all associated sprint milestones and logs.
        </p>

        {error && (
          <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <span>{error}</span>
            <button type="button" onClick={onDismissError} className="shrink-0 font-semibold hover:text-rose-900">
              Dismiss
            </button>
          </div>
        )}

        {/* Task Summary Card */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-400 font-semibold">TASK-{task.id || "104"}</span>
            <Badge className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] px-2 py-0 font-medium">
              • {task.status === "in_progress" ? "In Progress" : task.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <RefreshCw className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{task.title}</span>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-2.5 mb-6">
          <Checkbox
            id="confirm-delete"
            checked={isConfirmed}
            onCheckedChange={(checked) => setIsConfirmed(checked)}
            className="mt-0.5 border-slate-300 rounded"
          />
          <label htmlFor="confirm-delete" className="text-[11px] text-slate-500 leading-tight cursor-pointer">
            I understand this sprint item will be removed permanently and unlinked from active production deliverables.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs h-9 px-4">
            Cancel
          </Button>
          <Button
            disabled={!isConfirmed}
            onClick={async () => {
              const deleted = await onConfirm(task.id);
              if (deleted) onClose();
            }}
            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs h-9 px-4 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}