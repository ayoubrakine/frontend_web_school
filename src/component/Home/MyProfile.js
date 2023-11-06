import React, { useState, useEffect } from 'react';

const Accueil = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://192.168.1.14:8080/api/student');
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const studentData = await response.json();
        console.log("Données des étudiants :", studentData); // Vérifier les données reçues
        setStudents(studentData); // Mettre à jour le state avec les données des étudiants
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Liste des étudiants</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <h2>{student.email}</h2>
         
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accueil;
