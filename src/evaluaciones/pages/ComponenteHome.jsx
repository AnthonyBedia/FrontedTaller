import React, { useState } from "react";
import { CursosLayout } from "../layout";
import { AsociarComponentesPage } from "../pages";

export const CursosHome = ({ vista }) => {
  let contenido;

  if (vista === "componente") {
    contenido = <AsociarComponentesPage />;
  } else {
    contenido = <br></br>;
  }

  return <CursosLayout>{contenido}</CursosLayout>;
};
