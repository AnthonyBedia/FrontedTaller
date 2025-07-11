import { useEffect, useState, useMemo } from "react";
import Tree from "react-d3-tree";
import { useNavigate } from "react-router-dom";
import { competenciaService } from "../../../services/competenciaService";
import { getArbolCompetencia } from "../../../services/arbolCompetenciaService";
import { componenteService } from "../../../services/componenteService";
import {
  Slider,
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

// Paleta de colores
const palette = [
  "#4caf50", "#2196f3", "#ffeb3b", "#ff9800", "#e91e63",
  "#9c27b0", "#795548", "#607d8b", "#f44336"
];

// Hook para mapear pesos a colores
function usePesoColorMap(arbol) {
  return useMemo(() => {
    if (!arbol || !arbol[0] || !arbol[0].children) return {};

    function recolectarPesos(nodos, set = new Set()) {
      nodos.forEach(n => {
        if (typeof n.peso === "number") set.add(n.peso);
        if (n.children) recolectarPesos(n.children, set);
      });
      return set;
    }

    const pesos = Array.from(recolectarPesos(arbol));
    const uniquePesos = pesos.sort((a, b) => b - a);
    const map = {};
    uniquePesos.forEach((peso, idx) => {
      map[peso] = palette[idx % palette.length];
    });
    return map;
  }, [arbol]);
}

// Transforma los datos en árbol jerárquico por pesos y limita niveles
function transformarArbol(data, maxNiveles = 4) {
  if (!data || !data.componentes || data.componentes.length === 0) return [];

  // Agrupar componentes por peso
  const porPeso = {};
  data.componentes.forEach(comp => {
    if (!porPeso[comp.peso]) porPeso[comp.peso] = [];
    porPeso[comp.peso].push(comp);
  });

  // Ordenar pesos de mayor a menor
  const pesosOrdenados = Object.keys(porPeso)
    .map(p => parseInt(p))
    .sort((a, b) => b - a);

  // Limitar la cantidad de niveles
  const pesosLimitados = pesosOrdenados.slice(0, maxNiveles);

  // Crear nodos por nivel
  const niveles = pesosLimitados.map(peso => {
    return porPeso[peso].map(comp => ({
      name: comp.descripcion,
      peso: comp.peso,
    }));
  });

  // Conectar jerárquicamente
  for (let i = 0; i < niveles.length - 1; i++) {
    const padre = niveles[i][0];
    if (!padre.children) padre.children = [];
    padre.children = padre.children.concat(niveles[i + 1]);
  }

  return [
    {
      name: data.nombre,
      children: niveles.length > 0 ? niveles[0] : [],
    }
  ];
}

export default function VisualizarArbol() {
  const [modoBusqueda, setModoBusqueda] = useState("competencia"); // "competencia" o "componente"
  const [competencias, setCompetencias] = useState([]);
  const [competenciaId, setCompetenciaId] = useState("");
  const [componentes, setComponentes] = useState([]);
  const [componenteId, setComponenteId] = useState("");
  const [arbol, setArbol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [maxNiveles, setMaxNiveles] = useState(4); // por defecto 4 niveles
  const [competenciasDeComponente, setCompetenciasDeComponente] = useState([]);
  const [arbolesPorComponente, setArbolesPorComponente] = useState([]);

  // Cargar competencias y componentes al montar
  useEffect(() => {
    competenciaService.getCompetencias()
      .then(setCompetencias)
      .catch(() => setError("Error al cargar competencias"));
    componenteService.getComponentesUnicos()
      .then(setComponentes)
      .catch(() => setError("Error al cargar componentes"));
  }, []);

  // Buscar por competencia
  useEffect(() => {
    if (modoBusqueda !== "competencia") return;
    if (!competenciaId) {
      setArbol(null);
      return;
    }
    setLoading(true);
    getArbolCompetencia(competenciaId)
      .then(data => setArbol(transformarArbol(data, maxNiveles)))
      .catch(() => setError("Error al cargar el árbol"))
      .finally(() => setLoading(false));
  }, [competenciaId, maxNiveles, modoBusqueda]);

  // Buscar competencias de un componente y sus árboles
  useEffect(() => {
    if (modoBusqueda !== "componente") return;
    if (!componenteId) {
      setCompetenciasDeComponente([]);
      setArbolesPorComponente([]);
      return;
    }
    setLoading(true);
    competenciaService.getCompetenciasByComponente(componenteId)
      .then(async (competenciasAsociadas) => {
        setCompetenciasDeComponente(competenciasAsociadas);
        // Para cada competencia, obtener su árbol
        const arboles = await Promise.all(
          competenciasAsociadas.map(async comp => {
            try {
              const arbol = await getArbolCompetencia(comp.competenciaId || comp.id);
              return {
                competencia: comp,
                arbol: transformarArbol(arbol, maxNiveles)
              };
            } catch {
              return {
                competencia: comp,
                arbol: null
              };
            }
          })
        );
        setArbolesPorComponente(arboles);
      })
      .catch(() => setError("Error al buscar competencias y árboles por componente"))
      .finally(() => setLoading(false));
  }, [componenteId, maxNiveles, modoBusqueda]);

  const pesoColorMap = usePesoColorMap(arbol);

  function renderCustomNode({ nodeDatum, hierarchyPointNode }) {
    const isRoot = hierarchyPointNode.depth === 0;
    const peso = nodeDatum.peso ?? null;

    let color = "#000000"; // color por defecto
    if (!isRoot && peso !== null && pesoColorMap[peso]) {
      color = pesoColorMap[peso];
    }

    return (
      <g>
        <circle r={30} fill={color} stroke="#333" strokeWidth={1} />
        <text
          textAnchor="middle"
          y={-60}
          fontSize="14"
          fill="#000"
          fontFamily="'Roboto', 'Segoe UI', Arial, sans-serif"
        >
          {nodeDatum.name}
        </text>
        {peso !== null && (
          <text
            textAnchor="middle"
            y={-40}
            fontSize="12"
            fill="#444"
            fontFamily="'Roboto', 'Segoe UI', Arial, sans-serif"
          >
            Peso: {peso}
          </text>
        )}
      </g>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3e9f7 100%)",
        fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
        padding: "0 0 48px 0"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "40px 0 24px 0",
          maxWidth: 1200,
          margin: "0 auto"
        }}
      >
        <IconButton
          onClick={() => navigate("/evaluaciones")}
          style={{
            background: "#2196f3",
            color: "#fff",
            borderRadius: "50%",
            boxShadow: "0 2px 8px #2196f355",
            marginLeft: "32px",
            transition: "background 0.2s"
          }}
          size="large"
        >
          <HomeIcon fontSize="inherit" />
        </IconButton>
        <h2
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "2.6rem",
            fontWeight: 700,
            color: "#222",
            margin: 0,
            letterSpacing: "1px",
            fontFamily: "inherit"
          }}
        >
          Árbol de Componentes
        </h2>
        <div style={{ width: 64 }} />
      </div>

      {/* Selector de modo de búsqueda */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <ToggleButtonGroup
          value={modoBusqueda}
          exclusive
          onChange={(_, value) => value && setModoBusqueda(value)}
          aria-label="modo de búsqueda"
          sx={{
            background: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 8px #0001"
          }}
        >
          <ToggleButton
            value="competencia"
            aria-label="Buscar por competencia"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#1976d2",
              "&.Mui-selected": {
                background: "#1976d2",
                color: "#fff"
              }
            }}
          >
            Buscar por competencia
          </ToggleButton>
          <ToggleButton
            value="componente"
            aria-label="Buscar por componente"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#1976d2",
              "&.Mui-selected": {
                background: "#1976d2",
                color: "#fff"
              }
            }}
          >
            Buscar por componente
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Controles de búsqueda */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 48,
          marginBottom: 32
        }}
      >
        {/* Slider de niveles */}
        <div style={{ marginBottom: 24, width: 240 }}>
          <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Niveles a mostrar:</label>
          <Slider
            value={maxNiveles}
            min={1}
            max={6}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={(_, value) => setMaxNiveles(value)}
            sx={{
              color: "#1976d2"
            }}
          />
        </div>
        {/* Autocomplete según modo */}
        {modoBusqueda === "competencia" ? (
          <div>
            <label style={{ fontWeight: "bold", marginBottom: 8, display: "block", fontSize: "1.1rem" }}>
              Selecciona una competencia:
            </label>
            <Autocomplete
              options={competencias}
              getOptionLabel={option => option.nombre || ""}
              value={competencias.find(c => (c.competenciaId || c.id) === competenciaId) || null}
              onChange={(_, value) => setCompetenciaId(value ? (value.competenciaId || value.id) : "")}
              renderInput={params => (
                <TextField {...params} label="Buscar competencia" variant="outlined" />
              )}
              style={{ minWidth: 280 }}
              isOptionEqualToValue={(option, value) =>
                (option.competenciaId || option.id) === (value?.competenciaId || value?.id)
              }
            />
          </div>
        ) : (
          <div>
            <label style={{ fontWeight: "bold", marginBottom: 8, display: "block", fontSize: "1.1rem" }}>
              Selecciona un componente:
            </label>
            <Autocomplete
              options={componentes}
              getOptionLabel={option => option.descripcion || ""}
              value={componentes.find(c => c.id === componenteId) || null}
              onChange={(_, value) => setComponenteId(value ? value.id : "")}
              renderInput={params => (
                <TextField {...params} label="Buscar componente" variant="outlined" />
              )}
              style={{ minWidth: 280 }}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
            />
          </div>
        )}
      </div>

      {/* Árbol o competencias del componente */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        {loading && <p style={{ fontSize: "1.2rem" }}>Cargando árbol...</p>}
        {error && <p style={{ color: "red", fontSize: "1.2rem" }}>{error}</p>}
        {modoBusqueda === "competencia" && arbol && arbol[0]?.children?.length > 0 ? (
          <div style={{
            width: "95vw",
            maxWidth: 1100,
            height: "70vh",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0002",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 0 48px 0",
            padding: "24px"
          }}>
            <Tree
              data={arbol}
              orientation="vertical"
              renderCustomNodeElement={renderCustomNode}
              nodeSize={{ x: 350, y: 180 }}
              zoomable
              collapsible
              translate={{ x: window.innerWidth * 0.5, y: 100 }}
              zoom={1.2}
            />
          </div>
        ) : modoBusqueda === "competencia" && competenciaId && !loading ? (
          <p style={{ fontSize: "1.1rem" }}>No hay componentes para esta competencia.</p>
        ) : null}

        {modoBusqueda === "componente" && !loading && componenteId && (
          <div style={{ marginTop: 32, width: "100%" }}>
            <h3 style={{ textAlign: "center", color: "#1976d2", fontSize: "1.5rem", fontWeight: 600 }}>
              Componente seleccionado:
            </h3>
            <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
              {
                (componentes.find(c => c.id === componenteId) || {}).descripcion
              }
            </p>
            <h4 style={{ textAlign: "center", marginTop: 24, fontSize: "1.2rem" }}>Competencias Asociadas:</h4>
            {arbolesPorComponente.length > 0 ? (
              arbolesPorComponente.map(({ competencia, arbol }) => (
                <div key={competencia.competenciaId || competencia.id} style={{
                  marginBottom: 48,
                  background: "#f8fafc",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px #0001",
                  padding: "24px"
                }}>
                  <h5 style={{
                    textAlign: "center",
                    color: "#1976d2",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    marginBottom: 16
                  }}>
                    {arbol && arbol[0]?.name}
                  </h5>
                  {arbol && arbol[0]?.children?.length > 0 ? (
                    <div style={{
                      width: "95vw",
                      maxWidth: 1100,
                      height: "60vh",
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 12px #0001",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Tree
                        data={arbol}
                        orientation="vertical"
                        renderCustomNodeElement={renderCustomNode}
                        nodeSize={{ x: 350, y: 180 }}
                        zoomable
                        collapsible
                        translate={{ x: window.innerWidth * 0.5, y: 100 }}
                        zoom={1.2}
                      />
                    </div>
                  ) : (
                    <p style={{ textAlign: "center", fontSize: "1.1rem" }}>No hay árbol para esta competencia.</p>
                  )}
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", fontSize: "1.1rem" }}>Este componente no pertenece a ninguna competencia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}