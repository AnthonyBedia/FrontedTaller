import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import BusquedaCursos from '../components/BusquedaCursos';

const CargaMasiva = () => {
  const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
  const [excelData, setExcelData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      alert('Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        let processedData = [];
        let headers = [];

        if (fileExtension === 'csv') {
          const text = data;
          const lines = text.split('\n').filter(line => line.trim() !== '');
          headers = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
          const dataLines = lines.slice(1);
          processedData = dataLines.map(line => {
            const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
            const rowObj = {};
            headers.forEach((header, index) => {
              rowObj[header] = columns[index] || '';
            });
            return rowObj;
          });
        } else {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          headers = jsonData[0].map(header => String(header || '').trim());
          const dataRows = jsonData.slice(1);
          processedData = dataRows
            .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
            .map(row => {
              const rowObj = {};
              headers.forEach((header, index) => {
                rowObj[header] = String(row[index] || '').trim();
              });
              return rowObj;
            });
        }

        setExcelHeaders(headers);
        setExcelData(processedData);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo. Verifica que sea un archivo válido.');
      }
    };

    if (fileExtension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
        Carga Masiva de Alumnos
      </h2>

      {/* Componente de búsqueda de cursos */}
      <BusquedaCursos 
        placeholder="Buscar curso para cargar alumnos..."
        label="Curso:"
      />

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={handleImportClick}
          disabled={!cursoSeleccionado}
          style={{
            backgroundColor: cursoSeleccionado ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: cursoSeleccionado ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Importar Excel <span style={{ backgroundColor: '#27ae60', padding: '2px 6px', borderRadius: '4px' }}>📊 X</span>
        </button>
        {!cursoSeleccionado && (
          <p style={{ marginTop: '10px', color: '#e74c3c', fontSize: '0.9rem' }}>
            ⚠️ Primero debes seleccionar un curso
          </p>
        )}
        {fileName && (
          <p style={{ marginTop: '10px', color: '#27ae60', fontWeight: '500' }}>✅ Archivo cargado: {fileName}</p>
        )}
      </div>

      <h3 style={{ color: '#2c3e50', fontSize: '1.2rem', marginBottom: '20px' }}>
        Vista previa {excelData.length > 0 && `(${excelData.length} registros)`}
      </h3>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'auto', maxHeight: '500px' }}>
        {excelHeaders.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${excelHeaders.length}, 1fr)`, gap: '10px', marginBottom: '15px', backgroundColor: 'white' }}>
              {excelHeaders.map((header, index) => (
                <div key={index} style={{ backgroundColor: '#e8eef7', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>{header}</div>
              ))}
            </div>
            {excelData.map((row, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: `repeat(${excelHeaders.length}, 1fr)`, gap: '10px', marginBottom: '10px' }}>
                {excelHeaders.map((header, headerIndex) => (
                  <div key={headerIndex} style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '0.9rem' }}>{row[header] || ''}</div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
            <p>No hay datos para mostrar</p>
            <p style={{ fontSize: '0.9rem', color: '#adb5bd' }}>Selecciona un archivo para ver la vista previa</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: excelData.length > 0 ? '#d4edda' : '#e3f2fd', borderRadius: '8px', borderLeft: `4px solid ${excelData.length > 0 ? '#28a745' : '#2196f3'}` }}>
        <p style={{ margin: 0, color: excelData.length > 0 ? '#155724' : '#1976d2', fontSize: '0.9rem' }}>
          {excelData.length > 0
            ? `✅ ¡Archivo cargado exitosamente! Se encontraron ${excelData.length} registros con ${excelHeaders.length} columnas.`
            : '💡 Selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv) para cargar los datos.'}
        </p>
      </div>

      {excelData.length > 0 && cursoSeleccionado && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
            Procesar y Guardar Alumnos ({excelData.length} registros)
          </button>
        </div>
      )}
    </div>
  );
};

export default CargaMasiva;
