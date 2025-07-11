import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getComponentes } from "../../../actions/evalThunks";

function AutocompleteSelect({ label, options, value, onChange }) {
  return (
    <Autocomplete
      className="dropdown-select"
      options={options}
      getOptionLabel={(option) => option.nombre || option.descripcion || option.codigo}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label={label} />}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
    />
  );
}

export default function ExtraInfo({ rubricaInfo, setRubricaInfo, onGuardar }) {
  const dispatch = useDispatch();

  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedCur, setSelectedCur] = useState(null);
  const [cursos, setCursos] = useState([]);

  const { componentes } = useSelector((state) => state.componente); // del slice componenteSlice

  useEffect(() => {
    dispatch(getComponentes());
  }, [dispatch]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const resp = await fetch("https://modcursosayudoc-e4b3fub9g5c5gda7.brazilsouth-01.azurewebsites.net/api-cur/v1/cursos");
        const data = await resp.json();
        setCursos(data);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  const handleCompChange = (newValue) => {
    setSelectedComp(newValue);
    setRubricaInfo((prev) => ({
      ...prev,
      componenteId: newValue?.id || null,
    }));
  };

  const handleCursoChange = (newValue) => {
    setSelectedCur(newValue);
    setRubricaInfo((prev) => ({
      ...prev,
      cursoId: newValue?.id || null,
    }));
  };

  return (
    <section>
      <div className="comp-cur-crear-rubrica">
        <AutocompleteSelect
          label="Componente asociado"
          options={componentes}
          value={selectedComp}
          onChange={handleCompChange}
        />
        <AutocompleteSelect
          label="Curso asociado"
          options={cursos}
          value={selectedCur}
          onChange={handleCursoChange}
        />
        <button className="btn-crear-rubrica" onClick={onGuardar}>
          Crear Rúbrica
        </button>
      </div>
    </section>
  );
}
