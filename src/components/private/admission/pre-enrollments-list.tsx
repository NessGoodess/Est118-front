"use client"
import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { studentsTableConfig } from './students.config';
import { tableIcons } from './icons';
import { PreEnrollmentListItem } from '@/lib/types/admission/preEnrollmentApi';
import { tableRenderers } from './tableRerenders';

interface props {
  data: PreEnrollmentListItem[];
}

export default function DataTableExample({ data }: props) {
  const [selectedStudents, setSelectedStudents] = useState<PreEnrollmentListItem[]>([]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lista de Estudiantes</h1>
          <p className="text-slate-600">Gestiona los estudiantes de la institución</p>
        </div>
        <DataTable
          config={studentsTableConfig}
          data={data}
          renderers={tableRenderers}
          icons={tableIcons}
          onSelectionChange={setSelectedStudents}
          emptyMessage="No se encontraron estudiantes"
        />

        {selectedStudents.length > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Has seleccionado {selectedStudents.length} estudiante{selectedStudents.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}