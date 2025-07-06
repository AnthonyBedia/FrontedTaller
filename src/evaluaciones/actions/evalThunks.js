import { iniciaCargaFormulas, cargaFormulas, cargaFormulaIdActiva } from "../slices/formulaSlice";
import { iniciaCargaFunciones, cargaFunciones, cargaFuncionIdActiva } from "../slices/funcionSlice";

export const getFormulas = () => {

    return async(dispatch, getState) => {
        dispatch( iniciaCargaFormulas() );

        const resp = await fetch(`http://localhost:8080/api/formula`);
        const data = await resp.json();
        
        console.log( data );
        dispatch( cargaFormulas( { formulas: data } ) );
    }
}


export const postFormula = (nuevaFormula) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch("http://localhost:8080/api/formula", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaFormula),
            });

            if (!response.ok) throw new Error("Error al guardar fórmula");

            const data = await response.json();

            const { formulas } = getState().formula;

            dispatch(cargaFormulas({ formulas: [...formulas, data] }));
        } catch (error) {
            console.error("Error en postFormula:", error);
        }
    };
};


export const deleteFormula = (id) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(`http://localhost:8080/api/formula/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Error al eliminar fórmula");

            const { formulas } = getState().formula;
            const nuevasFormulas = formulas.filter(f => f.id !== id);

            dispatch(cargaFormulas({ formulas: nuevasFormulas }));
        } catch (error) {
            console.error("Error en deleteFormula:", error);
        }
    };
};

export const updateFormula = (formulaActualizada) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(`http://localhost:8080/api/formula/${formulaActualizada.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formulaActualizada),
            });

            if (!response.ok) throw new Error("Error al actualizar fórmula");

            const data = await response.json();

            const { formulas } = getState().formula;
            const nuevasFormulas = formulas.map(f =>
                f.id === data.id ? data : f
            );

            dispatch(cargaFormulas({ formulas: nuevasFormulas }));
        } catch (error) {
            console.error("Error en updateFormula:", error);
        }
    };
};

export const getFunciones = () => {

    return async(dispatch, getState) => {
        dispatch( iniciaCargaFunciones() );

        const resp = await fetch(`http://localhost:8080/api/funcion`);
        const data = await resp.json();
        
        console.log( data );
        dispatch( cargaFunciones( { funciones: data } ) );
    }
}