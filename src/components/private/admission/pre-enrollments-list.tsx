"use client"
import React, { useState} from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { studentsTableConfig } from './students.config';
import { tableIcons } from './icons';
import { PreEnrollmentListItem } from '@/lib/types/admission/preEnrollmentApi';
import { tableRenderers } from './tableRerenders';
import { TableConfig } from '@/lib/types/data-table';

interface props {
  data: PreEnrollmentListItem[];
}

export default function PreEnrollmentsList({ data }: props) {
  const [selectedStudents, setSelectedStudents] = useState<PreEnrollmentListItem[]>([]);
  return (
    <>
      <DataTable
        config={studentsTableConfig as TableConfig<PreEnrollmentListItem>}
        data={data}
        renderers={tableRenderers}
        icons={tableIcons}
        onSelectionChange={setSelectedStudents}
        emptyMessage="No se encontraron estudiantes"
        minRows={10}
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

