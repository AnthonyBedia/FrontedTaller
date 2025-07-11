import { useState } from "react";
import {Autocomplete, TextField } from "@mui/material";

function AutocompleteSelect({ label, options, value, onChange }) {
  return (
    <Autocomplete
      className="dropdown-select"
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label={label} />}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
    />
  );
}

const temporal = [
  { name: "comp1", id: 1 },
  { name: "comp2", id: 2 },
  { name: "comp3", id: 3 }
];

export default function ExtraInfo({ rubricaInfo, setRubricaInfo, onGuardar }) {
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedCur, setSelectedCur] = useState(null);

  const handleCompChange = (newValue) => {
    setSelectedComp(newValue);
    setRubricaInfo(prev => ({
      ...prev,
      componenteId: newValue?.id || null,
    }));
  };

  return (
    <section>
        <div className="comp-cur-crear-rubrica">
          <AutocompleteSelect
            label="Componente asociado"
            options={temporal}
            value={selectedComp}
            onChange={handleCompChange}
          />
          <AutocompleteSelect
            label="Curso asociado"
            options={temporal}
            value={selectedCur}
            onChange={setSelectedCur}
          />
          <button 
            className="btn-crear-rubrica"
            onClick={onGuardar}
            >
              Crear Rubrica
            </button>
        </div>
    </section>
  );
}
