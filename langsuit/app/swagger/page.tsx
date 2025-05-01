"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerDocs = () => {
  const [spec, setSpec] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized access");
        }
        return response.json();
      })
      .then((data) => setSpec(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Only administrators can view API documentation in
        production.
      </div>
    );
  }

  if (!spec) {
    return <div>Loading...</div>;
  }

  return <SwaggerUI spec={spec} />;
};

export default SwaggerDocs;
