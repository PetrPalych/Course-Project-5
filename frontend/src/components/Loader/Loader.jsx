import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <span className="spinner spinner1"></span>
      <span className="spinner spinner2"></span>
      <span className="spinner spinner3"></span>
      <br></br>
      <span className="loader-text">LOADING...</span>
    </div>
  );
};

export default Loader;
