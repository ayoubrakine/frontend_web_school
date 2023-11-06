import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

const Table = styled.table`
  border-collapse: collapse;
  width: 60%;
  margin: 20px auto;
  & td,
  & th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: #333;
    transform: scale(1.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  color: red;
`;

const UpdateButton = styled(ActionButton)`
  color: blue;
`;

const Header = styled.h2`
  margin-top: 90px;
  text-align: center;
`;

const AddButton = styled.button`
  margin-top: 100px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const FilieresRoles = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.13:8080/api/v1/filieres');
        setRoles(response.data);
      } catch (error) {
        // Gestion des erreurs
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, libelle) => {
    const confirmation = await Swal.fire({
      title: `Êtes-vous sûr de vouloir supprimer "${libelle}" ?`,
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer'
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://192.168.1.13:8080/api/v1/filieres/${id}`);
        setRoles(roles.filter((role) => role.id !== id));
        await Swal.fire('Supprimé!', 'La filière a été supprimée.', 'success');
      } catch (error) {
        await Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression.', 'error');
      }
    }
  };

  const handleUpdate = (role) => {
    Swal.fire({
      title: 'Modifier la filière',
      html: `
        <input type="text" id="roleCode" class="swal2-input" value="${role.code}">
        <input type="text" id="roleLibelle" class="swal2-input" value="${role.libelle}">
      `,
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const newCode = document.getElementById('roleCode').value;
        const newLibelle = document.getElementById('roleLibelle').value;
        return { newCode, newLibelle };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { newCode, newLibelle } = result.value;
        handleUpdateName(role.id, newCode, newLibelle);
      }
    });
  };

  const handleUpdateName = async (id, newCode, newLibelle) => {
    try {
      await axios.put(`http://192.168.1.13:8080/api/v1/filieres/${id}`, { code: newCode, libelle: newLibelle });
      const updatedRoles = roles.map((role) => {
        if (role.id === id) {
          return { ...role, code: newCode, libelle: newLibelle };
        }
        return role;
      });
      setRoles(updatedRoles);
      await Swal.fire('Modifié!', 'La filière a été mise à jour.', 'success');
    } catch (error) {
      await Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
    }
  };

  const handleAddRole = async () => {
    const { value: roleCode, value: roleLibelle } = await Swal.fire({
      title: 'Ajouter une filière',
      html: `
        <input type="text" id="roleCode" class="swal2-input" placeholder="Code de la filière">
        <input type="text" id="roleLibelle" class="swal2-input" placeholder="Libellé de la filière">
      `,
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const newCode = document.getElementById('roleCode').value;
        const newLibelle = document.getElementById('roleLibelle').value;
        return { roleCode: newCode, roleLibelle: newLibelle }; // Utiliser des clés distinctes pour les valeurs
      }
    });
  
    if (roleCode && roleLibelle) {
      try {
        const response = await axios.post('http://192.168.1.13:8080/api/v1/filieres', {
          id: 0,
          code: roleCode,
          libelle: roleLibelle,
   
        });
        setRoles([...roles, response.data]);
        await Swal.fire('Ajouté!', 'La filière a été ajoutée avec succès.', 'success');
      } catch (error) {
        await Swal.fire('Erreur', 'Une erreur s\'est produite lors de l\'ajout de filière.', 'error');
      }
    }
  };
  

  return (
    <div>
      <div>
        <AddButton onClick={handleAddRole}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter une filière
        </AddButton>
        <Header>Liste des filières</Header>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Libellé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.code}</td>
              <td>{role.libelle}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(role.id, role.libelle)}>
                  <FontAwesomeIcon icon={faTrash} />
                </DeleteButton>
                <UpdateButton onClick={() => handleUpdate(role)}>
                  <FontAwesomeIcon icon={faEdit} />
                </UpdateButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FilieresRoles;
