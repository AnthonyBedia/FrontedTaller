import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Fade,
  Grow,
  Stack,
} from "@mui/material";

const OpcionesEdicion = ({ onSelect }) => (
  <Fade in={true}>
    <Card
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        "&:hover": {
          boxShadow: 4,
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <CardContent>
        <Grow in={true}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Opción a editar:
          </Typography>
        </Grow>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => onSelect("componente")}
            sx={{
              px: 4,
              py: 1.5,
              minWidth: 150,
            }}
          >
            Componente
          </Button>
          <Button
            variant="contained"
            onClick={() => onSelect("competencia")}
            sx={{
              px: 4,
              py: 1.5,
              minWidth: 150,
            }}
          >
            Competencia
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </Fade>
);

OpcionesEdicion.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default OpcionesEdicion;
