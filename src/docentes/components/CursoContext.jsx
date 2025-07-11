// src/docentes/context/CursoContext.jsx
import { createContext, useContext, useState } from 'react';

const CursoContext = createContext();

export const CursoProvider = ({ children }) => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  return (
    <CursoContext.Provider value={{ cursoSeleccionado, setCursoSeleccionado, busqueda, setBusqueda }}>
      {children}
    </CursoContext.Provider>
  );
};

export const useCurso = () => useContext(CursoContext);
