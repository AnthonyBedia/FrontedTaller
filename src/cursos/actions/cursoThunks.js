import { iniciaCargaCursos, cargaCursos, cargaCursoIdActivo } from '../slices/cursoSlice';

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const institucion = import.meta.env.VITE_APP_INSTITUCION;
const periodo = import.meta.env.VITE_APP_PERIODO;
const apiCursos = import.meta.env.VITE_APP_API_CURSOS

export const getCursos = () => {

    return async(dispatch, getState) => {
        dispatch( iniciaCargaCursos() );

        const resp = await fetch(`${ urlBack + apiCursos }/cursos`);
        const data = await resp.json();
        
        console.log( data );
        dispatch( cargaCursos( { cursos: data } ) );
    }
}

export const setCursoIdActivo = ( cursoid ) => {

    return async(dispatch, getState) => {

        //onsole.log( data );
        dispatch( cargaCursoIdActivo( { cursoidActivo: cursoid } ) );
    }
}

export const crearCurso = (cursoData) => {
    return async (dispatch, getState) => {
        try {

            const resp = await fetch(`${urlBack + apiCursos}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cursoData)
            });

            if (!resp.ok) {
                throw new Error('Error al crear el curso');
            }

            const data = await resp.json();
            console.log('Curso creado:', data);

            //dispatch(getCursos());

        } catch (error) {
            console.error('Error creando curso:', error);
        }
    }
}