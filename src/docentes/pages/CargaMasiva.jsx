import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import BusquedaCursos from '../components/BusquedaCursos';
import { grupoService } from '../services/grupoService'; // Asegúrate de que la ruta es correcta
import { alumnoService } from '../services/alumnoService';

const CargaMasiva = () => {
    // --- TUS ESTADOS ORIGINALES ---
    const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
    const [excelData, setExcelData] = useState([]);
    const [excelHeaders, setExcelHeaders] = useState([]);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    // --- NUEVOS ESTADOS PARA LA LÓGICA DE CARGA ---
    const [archivo, setArchivo] = useState(null); // Para guardar el objeto File
    const [uploading, setUploading] = useState(false);
    const [resultadoCarga, setResultadoCarga] = useState(null);
    const [error, setError] = useState('');

    // --- TU LÓGICA DE LECTURA DE ARCHIVO (CON PEQUEÑOS AJUSTES) ---
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Limpiar estados anteriores al cargar un nuevo archivo
        setArchivo(file);
        setFileName(file.name);
        setExcelData([]);
        setExcelHeaders([]);
        setError('');
        setResultadoCarga(null);

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            setError('Por favor selecciona un archivo Excel (.xlsx, .xls)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                if (jsonData.length === 0) {
                    setError("El archivo Excel está vacío.");
                    return;
                }

                const headers = jsonData[0].map(header => String(header || '').trim());
                const dataRows = jsonData.slice(1)
                    .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
                    .map(row => {
                        const rowObj = {};
                        headers.forEach((header, index) => {
                            rowObj[header] = String(row[index] || '').trim();
                        });
                        return rowObj;
                    });

                setExcelHeaders(headers);
                setExcelData(dataRows);
            } catch (err) {
                console.error('Error al procesar el archivo:', err);
                setError('Error al procesar el archivo. Verifica que sea un archivo válido.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // --- NUEVA LÓGICA PARA ENVIAR AL BACKEND ---
    const handleProcesarYGuardar = async () => {
        if (!cursoSeleccionado || !archivo) {
            setError('Se requiere un curso y un archivo para procesar.');
            return;
        }

        setUploading(true);
        setError('');
        setResultadoCarga(null);

        try {
            const resultado = await alumnoService.guardarAlumnosMasivo(archivo);
            setResultadoCarga(resultado);
        } catch (err) {
            setError(err.error || 'Ocurrió un error inesperado durante la carga.');
        } finally {
            setUploading(false);
        }
    };

    const handleImportClick = () => fileInputRef.current?.click();

    // --- TU DISEÑO JSX ORIGINAL (CON LÓGICA CONECTADA) ---
    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
                Carga Masiva de Alumnos
            </h2>

            <BusquedaCursos 
                placeholder="Buscar curso para cargar alumnos..."
                label="Curso:"
            />

            <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />

            <div style={{ margin: '20px 0 30px 0' }}>
                <button
                    onClick={handleImportClick}
                    disabled={!cursoSeleccionado}
                    style={{
                        backgroundColor: cursoSeleccionado ? '#3498db' : '#bdc3c7',
                        color: 'white', border: 'none', padding: '12px 20px',
                        borderRadius: '8px', cursor: cursoSeleccionado ? 'pointer' : 'not-allowed',
                        fontSize: '1rem', fontWeight: '500', display: 'flex',
                        alignItems: 'center', gap: '8px'
                    }}
                >
                    Importar Excel <span style={{ backgroundColor: '#27ae60', padding: '2px 6px', borderRadius: '4px' }}>📊</span>
                </button>
                {!cursoSeleccionado && (
                    <p style={{ marginTop: '10px', color: '#e74c3c', fontSize: '0.9rem' }}>
                        ⚠️ Primero debes seleccionar un curso.
                    </p>
                )}
                {fileName && (
                    <p style={{ marginTop: '10px', color: '#27ae60', fontWeight: '500' }}>✅ Archivo seleccionado: {fileName}</p>
                )}
            </div>

            <h3 style={{ color: '#2c3e50', fontSize: '1.2rem', marginBottom: '20px' }}>
                Vista previa {excelData.length > 0 && `(${excelData.length} registros)`}
            </h3>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'auto', maxHeight: '500px' }}>
                {excelData.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                {excelHeaders.map((header, index) => (
                                    <th key={index} style={{ backgroundColor: '#e8eef7', padding: '12px', border: '1px solid #ddd' }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((row, index) => (
                                <tr key={index}>
                                    {excelHeaders.map((header, headerIndex) => (
                                        <td key={headerIndex} style={{ padding: '12px', border: '1px solid #ddd', fontSize: '0.9rem' }}>{row[header] || ''}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
                        <p>No hay datos para mostrar</p>
                        <p style={{ fontSize: '0.9rem', color: '#adb5bd' }}>Selecciona un curso y luego importa un archivo para ver la vista previa</p>
                    </div>
                )}
            </div>
            
            {/* Botón para procesar y guardar, ahora funcional */}
            {excelData.length > 0 && cursoSeleccionado && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button 
                        onClick={handleProcesarYGuardar}
                        disabled={uploading}
                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
                    >
                        {uploading ? 'Procesando...' : `Procesar y Guardar Alumnos (${excelData.length} registros)`}
                    </button>
                </div>
            )}

            {/* Sección para mostrar resultados del backend */}
            {error && <div style={{ color: 'red', marginTop: '20px', border: '1px solid red', padding: '10px', borderRadius: '5px' }}><strong>Error:</strong> {error}</div>}
            {resultadoCarga && (
                <div style={{ marginTop: '20px', border: `1px solid ${resultadoCarga.errores > 0 ? '#ffc107' : '#28a745'}`, padding: '15px', borderRadius: '8px', backgroundColor: `${resultadoCarga.errores > 0 ? '#fff3cd' : '#e9f7ef'}` }}>
                    <h3 style={{color: `${resultadoCarga.errores > 0 ? '#856404' : '#155724'}`}}>Resultado de la Carga</h3>
                    <p>{resultadoCarga.mensaje}</p>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li><strong>Total de registros en archivo:</strong> {resultadoCarga.total}</li>
                        <li><strong>Matrículas exitosas:</strong> {resultadoCarga.exitosos}</li>
                        <li><strong>Registros con errores:</strong> {resultadoCarga.errores}</li>
                    </ul>
                    {resultadoCarga.mensajesError?.length > 0 && (
                        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '1rem', borderRadius: '5px', marginTop: '1rem' }}>
                            <h4>Detalle de errores:</h4>
                            <ul style={{paddingLeft: '20px', margin: 0}}>
                                {resultadoCarga.mensajesError.map((msg, index) => <li key={index}>{msg}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CargaMasiva;
