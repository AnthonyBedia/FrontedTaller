import React, { useState, useEffect } from 'react';

const estilos = {
  contenedor: {
    fontFamily: 'Arial, sans-serif',
    paddingBottom: '6rem',
  },
  titulo: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#2d3748',
  },
  filtros: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    gap: '1rem',
  },
  inputBusqueda: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
    background: '#ffffff',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
  },
  columnas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  tarjeta: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    padding: '1rem',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tarjetaActiva: {
    border: '3px solid #3182ce',
  },
  subtitulo: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#4a5568',
  },
  listaScrollable: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '8px',
    maxHeight: '500px',
  },
  boton: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    background: '#0000ff',
  },
  botonActivo: {
    backgroundColor: '#225b90',
    color: '#ffffff',
  },
  botonEnviarFixed: {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    border: 'none',
    zIndex: 50,
  },
  botonEnviarInactivo: {
    backgroundColor: '#e2e8f0',
    color: '#a0aec0',
    cursor: 'not-allowed',
  },
  botonEnviarActivo: {
    backgroundColor: '#38a169',
    color: '#ffffff',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  modalInput: {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '14px',
  },
};

const Notificaciones = () => {
  const [cursos, setCursos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosBase, setAlumnosBase] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroAlumno, setFiltroAlumno] = useState('');
  const [columnaActiva, setColumnaActiva] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [archivos, setArchivos] = useState([]);

  useEffect(() => {
    fetch('https://modcursosayudoc-e4b3fub9g5c5gda7.brazilsouth-01.azurewebsites.net/api-cur/v1/cursos')
      .then(res => res.json())
      .then(data => setCursos(data));

    fetch('https://docente-b5dbhwfgfdb9dwh3.canadacentral-01.azurewebsites.net/api/alumnos/listar')
      .then(res => res.json())
      .then(data => {
        setAlumnos(data);
        setAlumnosBase(data);
      });
  }, []);

  const cargarAlumnosYGrupos = (cursoId) => {
    fetch(`https://docente-b5dbhwfgfdb9dwh3.canadacentral-01.azurewebsites.net/api/alumnos/curso/${cursoId}/con-grupo`)
      .then(res => res.json())
      .then(data => {
        setAlumnos(data);
        setAlumnosBase(data);
        const gruposUnicos = Array.from(
          new Set(data.filter(d => d.grupoId).map(d => JSON.stringify({ grupoId: d.grupoId, grupoCodigo: d.grupoCodigo })))
        ).map(g => JSON.parse(g));
        setGrupos(gruposUnicos);
        setColumnaActiva('curso');
      });
  };

  const handleCurso = (curso) => {
    const nuevoCurso = cursoSeleccionado?.id === curso.id ? null : curso;
    setCursoSeleccionado(nuevoCurso);
    setGrupoSeleccionado(null);
    setAlumnosSeleccionados([]);
    if (nuevoCurso) {
      cargarAlumnosYGrupos(nuevoCurso.id);
    } else {
      setGrupos([]);
      fetch('https://docente-b5dbhwfgfdb9dwh3.canadacentral-01.azurewebsites.net/api/alumnos/listar')
        .then(res => res.json())
        .then(data => {
          setAlumnos(data);
          setAlumnosBase(data);
        });
    }
  };

  const handleGrupo = (grupo) => {
    if (grupoSeleccionado?.grupoId === grupo.grupoId) {
      setGrupoSeleccionado(null);
      setAlumnos(alumnosBase);
      setColumnaActiva('curso');
    } else {
      setGrupoSeleccionado(grupo);
      const alumnosGrupo = alumnosBase.filter(a => a.grupoId === grupo.grupoId);
      setAlumnos(alumnosGrupo);
      setColumnaActiva('grupo');
    }
    setAlumnosSeleccionados([]);
  };

  const toggleAlumno = (id) => {
    setAlumnosSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const obtenerTextoBoton = () => {
    if (alumnosSeleccionados.length > 0) return `Enviar a ${alumnosSeleccionados.length} alumno(s)`;
    if (grupoSeleccionado) return `Enviar a grupo: ${grupoSeleccionado.grupoCodigo}`;
    if (cursoSeleccionado) return `Enviar a curso: ${cursoSeleccionado.nombre}`;
    return 'Enviar';
  };

  const obtenerCorreosSeleccionados = () => {
    if (alumnosSeleccionados.length > 0) {
      return alumnosBase
        .filter(al => alumnosSeleccionados.includes(al.id))
        .map(al => al.email);
    }
    if (grupoSeleccionado) {
      return alumnosBase
        .filter(al => al.grupoId === grupoSeleccionado.grupoId)
        .map(al => al.email);
    }
    if (cursoSeleccionado) {
      return alumnosBase.map(al => al.email);
    }
    return [];
  };

  const cursosFiltrados = cursos.filter(c =>
    c.nombre.toLowerCase().includes(filtroCurso.toLowerCase())
  );

  const alumnosFiltrados = alumnos.filter(al =>
    `${al.nombres} ${al.apellidos}`.toLowerCase().includes(filtroAlumno.toLowerCase()) ||
    al.codigo.toLowerCase().includes(filtroAlumno.toLowerCase())
  );

  const handleEnviar = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setTitulo('');
    setMensaje('');
    setArchivos([]);
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>🔔 Notificaciones</h1>

      <div style={estilos.filtros}>
        <input
          type="text"
          placeholder="🔍 Buscar alumno..."
          value={filtroAlumno}
          onChange={(e) => setFiltroAlumno(e.target.value)}
          style={estilos.inputBusqueda}
        />
        <input
          type="text"
          placeholder="🔍 Buscar curso..."
          value={filtroCurso}
          onChange={(e) => setFiltroCurso(e.target.value)}
          style={estilos.inputBusqueda}
        />
      </div>

      <div style={estilos.columnas}>
        {/* Alumnos */}
        <div style={{ ...estilos.tarjeta, ...(columnaActiva ? estilos.tarjetaActiva : {}) }}>
          <h2 style={estilos.subtitulo}>👨‍🎓 Alumnos</h2>
          <div style={estilos.listaScrollable}>
            {alumnosFiltrados.map(al => (
              <div
                key={al.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={alumnosSeleccionados.includes(al.id)}
                  onChange={() => toggleAlumno(al.id)}
                />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  {al.nombres} {al.apellidos} ({al.codigo})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cursos */}
        <div style={estilos.tarjeta}>
          <h2 style={estilos.subtitulo}>📚 Cursos</h2>
          <div style={estilos.listaScrollable}>
            {cursosFiltrados.map(curso => (
              <div key={curso.id}>
                <button
                  style={{
                    ...estilos.boton,
                    ...(cursoSeleccionado?.id === curso.id ? estilos.botonActivo : {})
                  }}
                  onClick={() => handleCurso(curso)}
                >
                  {curso.nombre}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grupos */}
        <div style={{ ...estilos.tarjeta, ...(columnaActiva === 'grupo' ? estilos.tarjetaActiva : {}) }}>
          <h2 style={estilos.subtitulo}>👥 Grupos</h2>
          <div style={estilos.listaScrollable}>
            {grupos.map(grupo => (
              <div key={grupo.grupoId}>
                <button
                  style={{
                    ...estilos.boton,
                    ...(grupoSeleccionado?.grupoId === grupo.grupoId ? estilos.botonActivo : {})
                  }}
                  onClick={() => handleGrupo(grupo)}
                >
                  {grupo.grupoCodigo}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        style={{
          ...estilos.botonEnviarFixed,
          ...(alumnosSeleccionados.length > 0 || cursoSeleccionado || grupoSeleccionado
            ? estilos.botonEnviarActivo
            : estilos.botonEnviarInactivo)
        }}
        disabled={!(alumnosSeleccionados.length > 0 || cursoSeleccionado || grupoSeleccionado)}
        onClick={handleEnviar}
      >
        {obtenerTextoBoton()}
      </button>

      {mostrarModal && (
        <div style={estilos.modalOverlay}>
          <div style={estilos.modal}>
            <h3 style={{ marginBottom: '1rem' }}>✉️ Redactar mensaje</h3>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={estilos.modalInput}
            />
            <textarea
              placeholder="Mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              style={{ ...estilos.modalInput, height: '100px' }}
            />
            <input
              type="file"
              multiple
              onChange={(e) => setArchivos(Array.from(e.target.files))}
              style={estilos.modalInput}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleCerrarModal}>Cancelar</button>
              <button
                onClick={async () => {
                  const correos = obtenerCorreosSeleccionados();

                  if (correos.length === 0 || !titulo || !mensaje) {
                    alert("Faltan datos para enviar la notificación.");
                    return;
                  }

                  const formData = new FormData();
                  const payload = {
                    correos,
                    titulo,
                    mensaje,
                  };

                  formData.append("request", JSON.stringify(payload));

                  archivos.forEach((archivo) => {
                    formData.append("archivos", archivo);
                  });

                  try {
                    const res = await fetch("https://docente-b5dbhwfgfdb9dwh3.canadacentral-01.azurewebsites.net/api/notificaciones", {
                      method: "POST",
                      body: formData,
                    });

                    const resultado = await res.text();
                    alert(resultado);
                    setMostrarModal(false);
                    setTitulo('');
                    setMensaje('');
                    setArchivos([]);
                    setAlumnosSeleccionados([]);
                  } catch (error) {
                    console.error("Error al enviar correo:", error);
                    alert("Error al enviar el correo");
                  }
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
