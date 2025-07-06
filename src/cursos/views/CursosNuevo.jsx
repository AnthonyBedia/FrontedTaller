import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Grid2, MenuItem  } from '@mui/material';
import { crearCurso } from '../actions';

export const CursosNuevo = () => {
    const dispatch = useDispatch();
    const [curso, setCurso] = useState({
        codigo: '',
        nombre: '',
        tipo: '',
        numHorasTeoria: '',
        numHorasPractica: '',
        numHorasLaboratorio: '',
        numHorasCampo: '',
        numCreditos: '',
        ciclo: ''
    });

    const tiposCurso = [
        { value: 'Obligatorio', label: 'Obligatorio' },
        { value: 'Electivo', label: 'Electivo' }
    ];

    const ciclos = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'
    ];
    
    const handleChange = (e) => {
        setCurso({
            ...curso,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(crearCurso(curso));
        // Opcional: limpiar formulario
        setCurso({
            codigo: '',
            nombre: '',
            tipo: '',
            numHorasTeoria: '',
            numHorasPractica: '',
            numHorasLaboratorio: '',
            numHorasCampo: '',
            numCreditos: '',
            ciclo: ''
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
                {/* Código */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Código"
                        name="codigo"
                        value={curso.codigo}
                        onChange={handleChange}
                        required
                    />
                </Grid2>

                {/* Nombre */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={curso.nombre}
                        onChange={handleChange}
                        required
                    />
                </Grid2>

                {/* Tipo (select) */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        fullWidth
                        label="Tipo"
                        name="tipo"
                        value={curso.tipo}
                        onChange={handleChange}
                        required
                    >
                        {tiposCurso.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>

                {/* Horas teoría */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Horas Teoría"
                        name="numHorasTeoria"
                        value={curso.numHorasTeoria}
                        onChange={handleChange}
                    />
                </Grid2>

                {/* Horas práctica */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Horas Práctica"
                        name="numHorasPractica"
                        value={curso.numHorasPractica}
                        onChange={handleChange}
                    />
                </Grid2>

                {/* Horas laboratorio */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Horas Laboratorio"
                        name="numHorasLaboratorio"
                        value={curso.numHorasLaboratorio}
                        onChange={handleChange}
                    />
                </Grid2>

                {/* Horas campo */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Horas Campo"
                        name="numHorasCampo"
                        value={curso.numHorasCampo}
                        onChange={handleChange}
                    />
                </Grid2>

                {/* Créditos */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Créditos"
                        name="numCreditos"
                        value={curso.numCreditos}
                        onChange={handleChange}
                    />
                </Grid2>

                {/* Ciclo (select) */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        fullWidth
                        label="Ciclo"
                        name="ciclo"
                        value={curso.ciclo}
                        onChange={handleChange}
                        required
                    >
                        {ciclos.map((ciclo) => (
                            <MenuItem key={ciclo} value={ciclo}>
                                {ciclo}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>

                {/* Botón */}
                <Grid2 size={12}>
                    <Button variant="contained" color="primary" type="submit">
                        Crear Curso
                    </Button>
                </Grid2>
            </Grid2>
        </form>
    );
};