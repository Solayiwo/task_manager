import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";

const getToday = () => {
  return new Date().toISOString().slice(0, 10);
};

export default function CreateTaskModal({ isOpen, onClose, onSubmit, error, onDismissError }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitted = await onSubmit(formData);
    if (submitted) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white border border-slate-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <h2 className="font-bold text-slate-900 text-base">Create New Task</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Add a deliverable task</p>
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
          {/* Title Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Task Title <span className="text-rose-500">*</span></label>
              <span className="text-[10px] text-slate-400">Max 120 chars</span>
            </div>
            <Input
              required
              maxLength={120}
              placeholder="OAuth2 Implementation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl text-xs h-10 border-slate-200"
            />
            <p className="text-[10px] text-slate-400 mt-1">Provide a concise, action-oriented name for this work item.</p>
          </div>

          {/* Description Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Description <span className="text-rose-500">*</span></label>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              
              <textarea
                required
                maxLength={2000}
                rows={6}
                placeholder="Integrate authorization code grant with Proof Key for Code Exchange..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 text-xs focus:outline-none resize-none text-slate-700"
              />
            </div>
          </div>

          {/* Status Select */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-slate-200 rounded-xl text-xs h-10 px-3 bg-white text-slate-700 focus:outline-none"
            >
              <option value="pending">🟡 Pending</option>
              <option value="in_progress">🔵 In Progress</option>
              <option value="completed">🟢 Completed</option>
            </select>
          </div>

          {/* Due Date Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Due Date <span className="text-rose-500">*</span></label>
            </div>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                required
                min={getToday()}
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="pl-9 rounded-xl text-xs h-10 border-slate-200"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs h-9 px-4">
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs h-9 px-4 font-semibold">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}