"use client"
import React, { useState, useMemo } from "react";

// Vista de asistencia - Componente React (Tailwind CSS)
// - 3 grados
// - 8 grupos por grado
// - 24 alumnos por grupo
// - Dos logos (SVG) en el header
// - Al "pasar" (simular) una credencial NFC aparece un modal con foto (SVG), info y marca asistencia
// - Si pasa otro alumno, el modal se actualiza con su información y marca la asistencia

// Nota: esto es una simulación de frontend. Para usar NFC real hay que integrar Web NFC o una API en el backend.

// -----------------------------
// Tipos TypeScript
// -----------------------------
interface Student {
  id: string;
  name: string;
  grade: number;
  group: string;
  number: number;
  photoPlaceholderColor: number;
  nfcTag: string;
  attended: boolean;
}

interface ScanLog {
  id: string;
  time: string;
  name: string;
  tag: string;
}

interface PhotoPlaceholderProps {
  name: string;
  color?: number;
}

interface LogoProps {
  className?: string;
}

type ByGradeMap = {
  [grade: number]: {
    [group: string]: Student[];
  };
};

// -----------------------------
// Helpers para generar datos
// -----------------------------
const GRADES = [1, 2, 3] as const;
const GROUPS_PER_GRADE = 8;
const STUDENTS_PER_GROUP = 24;

function generateStudents(): Student[] {
  const students: Student[] = [];
  let idCounter = 1;
  for (const grade of GRADES) {
    for (let g = 1; g <= GROUPS_PER_GRADE; g++) {
      const groupName = String.fromCharCode(64 + g); // A, B, C...
      for (let s = 1; s <= STUDENTS_PER_GROUP; s++) {
        const student: Student = {
          id: `S${idCounter}`,
          name: `Alumno ${idCounter}`,
          grade,
          group: groupName,
          number: s,
          photoPlaceholderColor: 100 + (idCounter % 6) * 100,
          nfcTag: `TAG-${grade}${groupName}-${s}`,
          attended: false,
        };
        students.push(student);
        idCounter++;
      }
    }
  }
  return students;
}

// -----------------------------
// SVG Logos (2) y placeholder foto
// -----------------------------
const LogoOne = ({ className = "w-12 h-12" }: LogoProps) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="5" y="5" width="90" height="90" rx="18" fill="currentColor" opacity="0.12" />
    <path d="M20 70 L40 35 L60 70 Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="70" cy="30" r="8" fill="currentColor" />
  </svg>
);

const LogoTwo = ({ className = "w-12 h-12" }: LogoProps) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" />
    <path d="M30 55 C40 35, 60 35, 70 55" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
    <rect x="42" y="30" width="16" height="10" rx="3" fill="currentColor" />
  </svg>
);

const PhotoPlaceholder = ({ name, color = 300 }: PhotoPlaceholderProps) => (
  <svg viewBox="0 0 200 200" width="160" height="160" className="rounded-lg shadow-sm" aria-hidden>
    <rect x="0" y="0" width="200" height="200" rx="12" fill={`hsl(${color}, 60%, 85%)`} />
    <circle cx="100" cy="80" r="34" fill={`hsl(${color}, 60%, 60%)`} />
    <rect x="40" y="130" width="120" height="30" rx="6" fill={`hsl(${color}, 60%, 60%)`} />
    <text x="100" y="145" textAnchor="middle" fontSize="14" fill="#fff">{name.split(" ").slice(0,2).join(" ")}</text>
  </svg>
);

// -----------------------------
// Componente principal
// -----------------------------
export default function VistaAsistencia() {
  const [students] = useState<Student[]>(() => generateStudents());
  const [query, setQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [scanLog, setScanLog] = useState<ScanLog[]>([]);

  // Indizar por grado y grupo para render más rápido
  const byGrade = useMemo<ByGradeMap>(() => {
    const map: ByGradeMap = {};
    for (const grade of GRADES) {
      map[grade] = {};
      for (let g = 1; g <= GROUPS_PER_GRADE; g++) {
        const groupName = String.fromCharCode(64 + g);
        map[grade][groupName] = students.filter((s) => s.grade === grade && s.group === groupName);
      }
    }
    return map;
  }, [students]);

  function simulateNfcScan(student: Student) {
    // Marcar asistencia (mutar copia local)
    student.attended = true;
    setSelectedStudent({ ...student });

    setScanLog((l) => [
      { id: student.id, time: new Date().toLocaleString(), name: student.name, tag: student.nfcTag },
      ...l,
    ].slice(0, 20));
  }

  function handleCloseModal() {
    setSelectedStudent(null);
  }

  function markAbsent(studentId: string) {
    const s = students.find((x) => x.id === studentId);
    if (s) s.attended = false;
    setSelectedStudent(null);
  }

  const filtered = useMemo(() => {
    if (!query) return students;
    const q = query.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.nfcTag.toLowerCase().includes(q));
  }, [students, query]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">Panel de Asistencia</div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">3 grados · 8 grupos · 24 alumnos/grupo</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700">
            <LogoOne className="w-10 h-10 text-indigo-600" />
            <LogoTwo className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="bg-white rounded-xl p-3 shadow">
            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border rounded-md px-3 py-2 w-48 text-sm"
                placeholder="Buscar nombre o tag NFC"
              />
              <div className="text-xs text-slate-500">Simulación NFC: haga clic en "Pasar"</div>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista general: resumen por grado */}
        <section className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-3">Resumen general</h3>

          <div className="space-y-3">
            {GRADES.map((grade) => {
              const total = students.filter((s) => s.grade === grade).length;
              const attended = students.filter((s) => s.grade === grade && s.attended).length;
              return (
                <div key={grade} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Grado {grade}</div>
                    <div className="text-xs text-slate-500">{total} alumnos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{attended}</div>
                    <div className="text-xs text-slate-400">presentes</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="text-sm font-medium mb-2">Últimos escaneos</div>
            <div className="space-y-2">
              {scanLog.length === 0 && <div className="text-xs text-slate-400">No hay escaneos aún.</div>}
              {scanLog.map((log) => (
                <div key={log.id + log.time} className="flex items-center justify-between bg-slate-50 rounded px-3 py-2">
                  <div className="text-xs">{log.name}</div>
                  <div className="text-xs text-slate-400">{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Panel de grupos (por grado) */}
        <section className="col-span-2 bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-3">Grupos y alumnos</h3>

          <div className="space-y-6">
            {GRADES.map((grade) => (
              <div key={grade}>
                <h4 className="font-medium mb-2">Grado {grade}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.keys(byGrade[grade]).map((groupName) => (
                    <div key={groupName} className="border rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">Grupo {groupName}</div>
                        <div className="text-xs text-slate-500">{byGrade[grade][groupName].length} alumnos</div>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-auto pr-2">
                        {byGrade[grade][groupName].map((stu) => (
                          <div key={stu.id} className="flex items-center justify-between bg-white rounded px-2 py-1 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">{stu.number}</div>
                              <div className="text-sm">{stu.name}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className={`text-xs px-2 py-1 rounded ${stu.attended ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {stu.attended ? 'Presente' : '—'}
                              </div>
                              <button
                                onClick={() => simulateNfcScan(stu)}
                                className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:opacity-90"
                              >
                                Pasar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal - aparece al simular NFC */}
      {selectedStudent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseModal} />

          <div className="relative z-50 max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-100">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 14c1.5-2 5-2 6.5 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">{selectedStudent.name}</div>
                  <div className="text-xs text-slate-500">{selectedStudent.grade}° · Grupo {selectedStudent.group} · No. {selectedStudent.number}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-500">Tag: {selectedStudent.nfcTag}</div>
                <button onClick={handleCloseModal} className="px-3 py-1 rounded bg-slate-100">Cerrar</button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center">
                <PhotoPlaceholder name={selectedStudent.name} color={selectedStudent.photoPlaceholderColor} />
              </div>

              <div className="md:col-span-2">
                <div className="mb-4">
                  <div className="text-sm font-medium">Información</div>
                  <div className="text-sm text-slate-600">ID: {selectedStudent.id}</div>
                  <div className="text-sm text-slate-600">Nombre: {selectedStudent.name}</div>
                  <div className="text-sm text-slate-600">Grado y grupo: {selectedStudent.grade}° - {selectedStudent.group}</div>
                  <div className="text-sm text-slate-600">NFC: {selectedStudent.nfcTag}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded ${selectedStudent.attended ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {selectedStudent.attended ? 'Asistencia registrada' : 'No registrado'}
                  </div>

                  <button onClick={() => markAbsent(selectedStudent.id)} className="px-4 py-2 rounded bg-red-500 text-white">Marcar como ausente</button>
                </div>

                <div className="mt-4 text-sm text-slate-500">
                  (Simulación) Si quieres integrar esto con un lector NFC real, conecta el lector al servidor o usa Web NFC desde un navegador compatible y envía el tag al endpoint de registro.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pie: sugerencias rápidas */}
      <footer className="mt-6 text-sm text-slate-500">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="font-medium mb-2">Sugerencias</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Integrar Web NFC (navegadores compatibles) o un servicio intermedio que reciba el tag del lector USB y lo reenvíe al frontend.</li>
            <li>Sincronizar asistencia con un backend para persistencia y reportes (CSV / Excel).</li>
            <li>Agregar confirmaciones sonoras y visuales cuando se registra un pase NFC.</li>
            <li>Soporte offline: cachear escaneos y sincronizar cuando haya conexión.</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
