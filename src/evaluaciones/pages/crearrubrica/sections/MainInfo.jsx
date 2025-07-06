import { useState } from "react";
import { Button, Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AutocompleteSelect({ label, options, value, onChange }) {
  return (
    <Autocomplete
      fullWidth
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label={label} />}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
    />
  );
}

export default function MainInfo({ rubricaInfo, setRubricaInfo }) {
  const [rubricaTitle, setRubricaTitle]= useState("");
  const [rubricaDesc, setRubricaDesc]= useState("");

  return (
    <section>
      <div>
        <h3 className="h3-text">Crear una rúbrica</h3>
        <p className="p-text">Añadir a un componente designado de un curso en específico</p>

        <TextField
            label="Nombre de la rúbrica"
            className="dropdown-textfield"
            variant="outlined"
            value={rubricaInfo.nombre}
            onChange={(e) => setRubricaInfo(prev => ({ ...prev, nombre: e.target.value }))}
        />
        <TextField
            label="Descripción de la rúbrica"
            className="dropdown-textfield"
            variant="outlined"
            value={rubricaInfo.descripcion}
            onChange={(e) => setRubricaInfo(prev => ({ ...prev, descripcion: e.target.value }))}
        />
      </div>
    </section>
  );
}
