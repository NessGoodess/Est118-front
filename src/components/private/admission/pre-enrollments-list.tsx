"use client"
import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { studentsTableConfig } from './students.config';
import { tableIcons } from './icons';
import { PreEnrollmentListItem } from '@/lib/types/admission/preEnrollmentApi';
import { tableRenderers } from './tableRerenders';
import { TableConfig } from '@/lib/types/data-table';
import { downloadPreEnrollmentExcel } from '@/lib/services/admissions.service';
import { globalToast } from '@/lib/toast';
import { ApiError } from '@/lib/types/auth';
import { handleApiError } from '@/lib/config/api';

interface props {
  data: PreEnrollmentListItem[];
  loading?: boolean;
}

export default function PreEnrollmentsList({ data, loading = false }: props) {
  const [selectedStudents, setSelectedStudents] = useState<PreEnrollmentListItem[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  const exportFunction = async () => {
    try {
      const blob = await downloadPreEnrollmentExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pre-enrollments.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(handleApiError(err));
      globalToast.error(error?.message || 'Error al exportar datos');
    }
  }

  return (
    <>
      <DataTable
        config={studentsTableConfig as TableConfig<PreEnrollmentListItem>}
        data={data}
        renderers={tableRenderers}
        icons={tableIcons}
        onSelectionChange={setSelectedStudents}
        emptyMessage="No se encontraron estudiantes"
        loading={loading}
        minRows={10}
        exportable={true}
        exportFunction={exportFunction}
      />

      {selectedStudents.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Has seleccionado {selectedStudents.length} estudiante{selectedStudents.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </>
  );
}

