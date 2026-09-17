import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, History, Trash2, Check} from "lucide-react";

const normalizeDateInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const getMinimumDueDate = (createdAt) => {
  const today = new Date().toISOString().slice(0, 10);

  const createdDate = normalizeDateInput(createdAt);
  return createdDate && createdDate > today ? createdDate : today;
};

export default function EditTaskModal({ task, isOpen, onClose, onSave, onDelete, error, onDismissError }) {
  const [formData, setFormData] = useState({ title: "", description: "", status: "pending", due_date: "" });

  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        due_date: normalizeDateInput(task.due_date),
      });
    }
  }, [isOpen, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saved = await onSave({
      ...task,
      ...formData,
      due_date: normalizeDateInput(formData.due_date),
    });
    if (saved) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white border border-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">Edit Task</h2>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[11px] font-mono px-2 py-0.5">
                TASK-{task?.id || "104"}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Modify task details and update status for sprint tracking</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <span>{error}</span>
            <button type="button" onClick={onDismissError} className="shrink-0 font-semibold hover:text-rose-900">
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Status Selection Buttons */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Task Status</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              {[
                { label: "Pending", value: "pending", color: "text-amber-600", dot: "bg-amber-500" },
                { label: "In Progress", value: "in_progress", color: "text-blue-600", dot: "bg-blue-500" },
                { label: "Completed", value: "completed", color: "text-emerald-600", dot: "bg-emerald-500" },
              ].map((st) => (
                <button
                  type="button"
                  key={st.value}
                  onClick={() => setFormData({ ...formData, status: st.value })}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                    formData.status === st.value
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Task Title</label>
              <span className="text-[10px] text-slate-400">Required</span>
            </div>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl text-xs h-10 border-indigo-200 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Description</label>
            <textarea
              required
              maxLength={2000}
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-700"
            />
          </div>

          {/* Date & Creation Record Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Due Date</label>
              <div className="relative">
                <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="date"
                  min={getMinimumDueDate(task?.created_at)}
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="pl-9 rounded-xl text-xs h-10 border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Creation Record</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Created: {task?.created_at || "2025-03-28"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="text-rose-600 hover:bg-rose-50 rounded-xl text-xs h-9 px-3"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Task
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs h-9 px-4">
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs h-9 px-4 font-semibold">
                <Check className="w-3.5 h-3.5 mr-1.5" /> Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}