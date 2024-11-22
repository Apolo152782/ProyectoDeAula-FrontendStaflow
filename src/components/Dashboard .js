import React from 'react';

const Dashboard = () => {
  const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiM2QwZWU0NDItMWVhNy00OTAxLWI0NTctZTRhODEwYTUzOGIyIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"; // Reemplaza con el enlace generado desde Power BI.

  return (
    <div className="dashboard-container">
      <iframe
        title="Dashboard Power BI"
        width="100%"
        height="580px"
        src={powerBiUrl}
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default Dashboard;
