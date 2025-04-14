// src/components/shared/Loader.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ loading = true }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
      <ClipLoader size={80} color="#f4f4f4" loading={loading} />
    </div>
  );
};

export default Loader;
