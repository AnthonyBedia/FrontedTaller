import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCursos, setCursoIdActivo } from '../actions';
import { Autocomplete, TextField } from '@mui/material';

export const CursosResumen = () => {
    
    const dispatch = useDispatch();
    const { cursos } = useSelector( state => state.curso );

    useEffect(() => {
        dispatch( getCursos() );
        console.log('Inicializando los cursos');

    },  []);

    return (

        <Autocomplete
            disablePortal
            id="comboCursos"
            sx={{ width: 600 }}
            options={cursos.map( (option) => (
                                                {id: option.id, label: option.codigo + ' - ' + option.nombre}
                                             )
            )}
            isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option.id === value.id
            }
            renderInput={(params) => <TextField {...params} label="Curso" />}
            //onChange={handleChangeCourse}
        />

    )
}
