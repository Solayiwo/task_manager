import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function HomeLayout() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    pending: 0,
    completed: 0,
    health: 0,
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 antialiased overflow-hidden">
      {/* Fixed left sidebar */}
      <Sidebar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stats={stats}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main content scroll area on the right */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Outlet
          context={{
            statusFilter,
            setStatusFilter,
            setStats,
            setIsSidebarOpen,
          }}
        />
      </div>
    </div>
  );
}