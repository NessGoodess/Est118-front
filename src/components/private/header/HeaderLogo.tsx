"use client";

export function HeaderLogo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">118</span>
      </div>
      <div className="hidden sm:block">
        <h1 className="text-lg font-semibold text-gray-900">Portal Escolar</h1>
        <p className="text-xs text-gray-500">Técnica 118</p>
      </div>
    </div>
  );
}

