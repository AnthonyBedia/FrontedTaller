const GestionAlumnos = ( {curso=null} ) => {
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
        Gestión de alumnos
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Panel Izquierdo - Registro */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ 
            color: '#3498db', 
            textAlign: 'center',
            marginTop: 0,
            marginBottom: '30px',
            fontSize: '1.3rem'
          }}>
            Registro individual de alumnos
          </h3>

          {['Código', 'Facultad', 'Programa', 'Nombres', 'Apellidos', 'Correo'].map(label => (
            <div key={label} style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {label}:
              </label>
              <input
                type={label === 'Correo' ? 'email' : 'text'}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e8eef7',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#f8f9fa',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ))}

          <button style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.3s'
          }}>
            Registrar
          </button>
        </div>

        {/* Panel Derecho - Información del Alumno */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ 
            color: '#3498db', 
            textAlign: 'center',
            marginTop: 0,
            marginBottom: '30px',
            fontSize: '1.3rem'
          }}>
            Alumno
          </h3>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#e8d5f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              👤
            </div>
          </div>

          {[
            ['Código', '20200291'],
            ['Facultad', '20 - INGENIERÍA DE SISTEMAS E INFORMÁTICA'],
            ['Programa', '2 - E.P. de Ingeniería de Software'],
            ['Nombres', 'Antony'],
            ['Apellidos', 'Lujan Roldan'],
            ['Correo', 'antony.lujanroldan@unmsm.edu.pe']
          ].map(([label, value]) => (
            <div key={label} style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #ecf0f1'
              }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>{label}:</span>
                <span style={{ color: '#7f8c8d', fontSize: '0.9rem', textAlign: 'right' }}>{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestionAlumnos;
