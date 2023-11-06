import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import A from "../../image/A.png";
import { Menubar } from 'primereact/menubar';

export default function NavBar() {
  const navigate = useNavigate();
  const pages = [
    {
      label: '  ',
      command: () => { navigate('/') }
    },
    {
      label: 'Students',
      command: () => { navigate('/About') }

    },
    {
      label: 'Roles',
      command: () => { navigate('/Formations') }

    },
    
    {
      label: 'Filières',
      command: () => { navigate('/Projets') }

    },
    {
      label: 'Students by filiere',
      command: () => { navigate('/Certifications') }

    },
    
  ];

  useEffect(() => {
    const handlePopstate = () => {
      navigate('/');
    };
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [navigate]);

  const start = (
    <img
      alt="AR"
      src={A}
      width="50"
      className="mr-2"
    />
  );

  return (
    <div>
      <div className="card">
        <Menubar
        //   start={start}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#bdedff',
          // background: '-webkit-linear-gradient(to left, #0f0c29, #302b63, #24243e)',
          // background: 'linear-gradient(to left,#0f0c29, #302b63, #24243e)'
        }}
        
        
          model={pages}
        />
      </div>
    </div>
  );
}
