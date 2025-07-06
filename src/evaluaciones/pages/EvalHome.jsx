import React from "react";
import { Card, CardActions, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../views/evalHomeStyles.css";

// Componente reutilizable
function EvalCard({ title, description, route }) {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 345 }} variant="outlined">
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => navigate(route)}>Ir allí</Button>
            </CardActions>
        </Card>
    );
}

export default function MainEval() {
    const formulaCards = [
        {
            title: "Crear, editar y ver fórmulas",
            description: "Actividades generales relacionadas con las fórmulas",
            route: "/evaluaciones/formulas"
        },
        {
            title: "Asignar fórmulas a componentes",
            description: "Relacionar y/o editar las fórmulas a utilizar para los componentes",
            route: "/evaluaciones/asignarformula"
        },
        {
            title: "Asignar componentes con competencia",
            description: "Relacionar y/o editar componentes con competencias",
            route: "/evaluaciones/componente"
        }
    ];

    const rubricaCards = [
        {
            title: "Crear rúbricas para componentes",
            description: "Creación de una rúbrica y sus criterios para los componentes asociados",
            route: "/evaluaciones/crearrubrica"
        },
        {
            title: "TODO",
            description: "Relacionar y/o editar las fórmulas a utilizar para los componentes",
            route: "/evaluaciones/asignarformula"
        },
        {
            title: "TODO",
            description: "Relacionar y/o editar componentes con competencias",
            route: "/evaluaciones/componente"
        }
    ];

    return (
        <main>
            <button onClick={() => navigate("/")}>Ir a inicio</button>

            <div className="formula-general-container m-2">
                <h3>Menú de fórmulas</h3>
                <div className="formula-cards">
                    {formulaCards.map((card, index) => (
                        <EvalCard
                            key={`formulas-${index}`}
                            title={card.title}
                            description={card.description}
                            route={card.route}
                        />
                    ))}
                </div>
            </div>

            <div className="formula-general-container m-2">
                <h3>Menú de rúbricas</h3>
                <div className="rubrica-cards">
                    {rubricaCards.map((card, index) => (
                        <EvalCard
                            key={`rubricas-${index}`}
                            title={card.title}
                            description={card.description}
                            route={card.route}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
