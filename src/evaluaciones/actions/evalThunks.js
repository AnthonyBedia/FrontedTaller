import { iniciaCargaFormulas, cargaFormulas, cargaFormulaIdActiva } from "../slices/formulaSlice";
import { iniciaCargaFunciones, cargaFunciones, cargaFuncionIdActiva } from "../slices/funcionSlice";
import { iniciaGuardadoRubrica, guardadoRubricaExitoso, guardadoRubricaError } from "../slices/rubricaSlice";



export const getFormulas = () => {

    return async(dispatch, getState) => {
        const token= localStorage.getItem("token")
        console.log("TOKEN actual: ", token)
        dispatch( iniciaCargaFormulas() );
        const resp = await fetch(`http://localhost:8080/api/formula`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await resp.json();
        
        console.log( data );
        dispatch( cargaFormulas( { formulas: data } ) );
    }
}


export const postFormula = (nuevaFormula) => {
    return async (dispatch, getState) => {
        try {
            const token= localStorage.getItem("token")
            const response = await fetch("http://localhost:8080/api/formula", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
            const token= localStorage.getItem("token")
            const response = await fetch(`http://localhost:8080/api/formula/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
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
            const token= localStorage.getItem("token")
            const response = await fetch(`http://localhost:8080/api/formula/${formulaActualizada.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
        const token= localStorage.getItem("token")
        dispatch( iniciaCargaFunciones() );
        
        const resp = await fetch(`http://localhost:8080/api/funcion`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await resp.json();
        
        console.log( data );
        dispatch( cargaFunciones( { funciones: data } ) );
    }
}

export const postRubrica = (rubricaData) => {
    return async (dispatch) => {
        try {
            const token= localStorage.getItem("token")
            dispatch(iniciaGuardadoRubrica());

            const response = await fetch("http://localhost:8080/api/rubricas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(rubricaData)
            });

            if (!response.ok) throw new Error("Error al guardar la rúbrica");

            const data = await response.json();
            dispatch(guardadoRubricaExitoso(data));
        } catch (error) {
            console.error("Error al guardar rúbrica:", error);
            dispatch(guardadoRubricaError(error.message));
        }
    };
};

export const getComponentes = () => {
  return async () => {
    const token = localStorage.getItem("token");
    const resp = await fetch("http://localhost:8080/componentes", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    return { payload: data };
  };
};

export const updateComponente = (componente) => {
  return async () => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/componentes/${componente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(componente)
    });
  };
};

export const postComponente = (nuevoComponente) => {
  return async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:8080/componentes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoComponente)
    });
  };
};
