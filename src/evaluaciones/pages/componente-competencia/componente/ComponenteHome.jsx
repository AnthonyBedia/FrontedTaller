import React from "react";
import { CursosLayout } from "../../../layout";
import { AsociarComponentesPage } from "../..";
import PropTypes from "prop-types";

export const CursosHome = ({ vista }) => {
  let contenido;

  if (vista === "componente") {
    contenido = <AsociarComponentesPage />;
  } else {
    contenido = <br />;
  }

  return <CursosLayout>{contenido}</CursosLayout>;
};

CursosHome.propTypes = {
  vista: PropTypes.string.isRequired,
};
