import React from "react";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900">
      <h1 className="text-4xl font-bold text-rose-500">Access Denied</h1>
      <p className="text-slate-500 text-sm mt-2">
        You don't have permission to view this page.
      </p>
      <Link
        to="/dashboard"
        className="mt-4 bg-blue-900 text-white text-xs px-4 py-2 rounded-xl font-bold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
