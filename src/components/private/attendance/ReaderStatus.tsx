"use client"
import { useEffect, useState } from "react";
import {globalToast} from "@/lib/toast/globalToast";

interface Students {
    id: number;
    name: string;
    credential_id: string;
    is_assigned: boolean;
    grade: string;
    group: string;
}

export default function ReaderStatus() {
    const [readerStatus, setReaderStatus] = useState<string>('');
    const [students, setStudents] = useState<Students[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    
    // Estados para filtros
    const [filterGrade, setFilterGrade] = useState<string>('');
    const [filterGroup, setFilterGroup] = useState<string>('');
    const [filterAssigned, setFilterAssigned] = useState<string>('all'); // 'all', 'assigned', 'not_assigned'

    useEffect(() => {
        async function fetchReaderStatus() {
            const response = await fetch(`http://192.168.1.83:8000/api/reader/status`);
            const data = await response.json();

            setReaderStatus(data.data.connected);
        }
        fetchReaderStatus();

        async function fetchStudents() {
            const response = await fetch(`http://192.168.1.83:8000/api/reader/studentsNfCAssignment`);
            const data = await response.json();

            setStudents(data.students);
        }
        fetchStudents();
    }, []);

    // Función para enviar el ID del estudiante al API de Laravel
    const handleStudentClick = async (studentId: number) => {
        // Verificar si el estudiante ya está asignado
        console.log(studentId);
        const student = students.find(s => s.id === studentId);
        if (student?.is_assigned) {
            globalToast.warning('Este estudiante ya ha sido asignado');
            return;
        }

        setLoading(true);
        setSelectedStudent(studentId);
        
        try {
            // Enviar el ID del estudiante al API de Laravel usando fetch directo
            const response = await fetch('http://192.168.1.83:8000/api/reader/nfcAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ 
                    studentId: studentId,
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Estudiante seleccionado exitosamente:', data);
                globalToast.success('Estudiante asignado exitosamente');
                
                // Actualizar el estado local para marcar como asignado
                setStudents(prevStudents => 
                    prevStudents.map(s => 
                        s.id === studentId 
                            ? { ...s, is_assigned: true }
                            : s
                    )
                );
            } else {
                console.error('Error al enviar estudiante:', data.message || 'Error desconocido');
                globalToast.error('Error al enviar estudiante:', data.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            globalToast.error('Error de conexión:', 'Error desconocido');
        } finally {
            setLoading(false);
            // Resetear el estudiante seleccionado después de un tiempo
            setTimeout(() => setSelectedStudent(null), 2000);
        }
    };

    // Función para filtrar estudiantes
    const filteredStudents = students.filter(student => {
        const matchesGrade = !filterGrade || student.grade.toLowerCase().includes(filterGrade.toLowerCase());
        const matchesGroup = !filterGroup || student.group.toLowerCase().includes(filterGroup.toLowerCase());
        const matchesAssigned = filterAssigned === 'all' || 
            (filterAssigned === 'assigned' && student.is_assigned) ||
            (filterAssigned === 'not_assigned' && !student.is_assigned);
        
        return matchesGrade && matchesGroup && matchesAssigned;
    });

    // Obtener valores únicos para los filtros
    const uniqueGrades = [...new Set(students.map(s => s.grade))].sort();
    const uniqueGroups = [...new Set(students.map(s => s.group))].sort();

    return (
        <>
            <div>
                <h1>Estado del lector: {readerStatus ? 'Conectado' : 'Desconectado'}</h1>
            </div>
            <div>
                <h1>Estudiantes</h1>
                
                {/* Controles de filtro */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
                            Grado:
                        </label>
                        <select
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px',
                                minWidth: '120px'
                            }}
                        >
                            <option value="">Todos los grados</option>
                            {uniqueGrades.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
                            Grupo:
                        </label>
                        <select
                            value={filterGroup}
                            onChange={(e) => setFilterGroup(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px',
                                minWidth: '120px'
                            }}
                        >
                            <option value="">Todos los grupos</option>
                            {uniqueGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
                            Estado:
                        </label>
                        <select
                            value={filterAssigned}
                            onChange={(e) => setFilterAssigned(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px',
                                minWidth: '140px'
                            }}
                        >
                            <option value="all">Todos</option>
                            <option value="not_assigned">No asignados</option>
                            <option value="assigned">Asignados</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
                            Resultados:
                        </label>
                        <span style={{ 
                            fontSize: '14px', 
                            color: '#6c757d',
                            padding: '8px 12px',
                            backgroundColor: 'white',
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                        }}>
                            {filteredStudents.length} de {students.length}
                        </span>
                    </div>
                </div>

                {/* Tabla de estudiantes */}
                {filteredStudents.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        backgroundColor: '#f8f9fa',
                        border: '2px dashed #dee2e6',
                        borderRadius: '8px',
                        margin: '20px 0'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            color: '#6c757d',
                            marginBottom: '16px'
                        }}>
                            {students.length === 0 ? '👥' : '🔍'}
                        </div>
                        <h3 style={{
                            color: '#6c757d',
                            margin: '0 0 8px 0',
                            fontSize: '18px'
                        }}>
                            {students.length === 0 ? 'No hay estudiantes disponibles' : 'No se encontraron estudiantes'}
                        </h3>
                        <p style={{
                            color: '#6c757d',
                            margin: '0',
                            fontSize: '14px'
                        }}>
                            {students.length === 0 
                                ? 'Los estudiantes aparecerán aquí cuando estén disponibles'
                                : 'Intenta ajustar los filtros para ver más resultados'
                            }
                        </p>
                    </div>
                ) : (
                    <div style={{
                        overflowX: 'auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        backgroundColor: 'white'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '14px'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ 
                                        padding: '12px', 
                                        textAlign: 'left', 
                                        borderBottom: '2px solid #dee2e6',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        Nombre
                                    </th>
                                    <th style={{ 
                                        padding: '12px', 
                                        textAlign: 'left', 
                                        borderBottom: '2px solid #dee2e6',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        ID Credencial
                                    </th>
                                    <th style={{ 
                                        padding: '12px', 
                                        textAlign: 'left', 
                                        borderBottom: '2px solid #dee2e6',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        Grado
                                    </th>
                                    <th style={{ 
                                        padding: '12px', 
                                        textAlign: 'left', 
                                        borderBottom: '2px solid #dee2e6',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        Grupo
                                    </th>
                                    <th style={{ 
                                        padding: '12px', 
                                        textAlign: 'center', 
                                        borderBottom: '2px solid #dee2e6',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        Estado
                                    </th>
                                    <th style={{ 
                                        padding: '12px', 
                                        textAlign: 'center', 
                                        borderBottom: '2px solid #dee2e6',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr 
                                        key={student.id}
                                        style={{
                                            borderBottom: '1px solid #dee2e6',
                                            backgroundColor: selectedStudent === student.id ? '#e3f2fd' : 'white',
                                            opacity: student.is_assigned ? 0.8 : 1,
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '12px', fontWeight: '500' }}>
                                            {student.name}
                                        </td>
                                        <td style={{ padding: '12px', color: '#6c757d' }}>
                                            {student.credential_id}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                backgroundColor: '#e9ecef',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                backgroundColor: '#d1ecf1',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {student.group}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {student.is_assigned ? (
                                                <span style={{
                                                    backgroundColor: '#4caf50',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    ✓ ASIGNADO
                                                </span>
                                            ) : (
                                                <span style={{
                                                    backgroundColor: '#ffc107',
                                                    color: '#212529',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    PENDIENTE
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {student.is_assigned ? (
                                                <span style={{ 
                                                    color: '#6c757d', 
                                                    fontSize: '12px',
                                                    fontStyle: 'italic'
                                                }}>
                                                    Ya asignado
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleStudentClick(student.id)}
                                                    disabled={loading}
                                                    style={{
                                                        backgroundColor: selectedStudent === student.id ? '#007bff' : '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        borderRadius: '4px',
                                                        cursor: loading ? 'not-allowed' : 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        opacity: loading ? 0.7 : 1,
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {selectedStudent === student.id && loading ? 'Enviando...' : 'Asignar'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

