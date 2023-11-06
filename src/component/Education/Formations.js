import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';

const Table = styled.table`
  border-collapse: collapse;
  width: 60%; /* Largeur réduite pour centrer le tableau */
  margin: 20px auto; /* Pour centrer le tableau */
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

const TableauRoles = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState({ id: null, name: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.13:8080/api/v1/roles');
        setRoles(response.data);
      } catch (error) {
        // Gestion des erreurs
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmation = await Swal.fire({
      title: `Êtes-vous sûr de vouloir supprimer "${name}" ?`,
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer'
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://192.168.1.13:8080/api/v1/roles/${id}`);
        setRoles(roles.filter((role) => role.id !== id));
        await Swal.fire('Supprimé!', 'Le rôle a été supprimé.', 'success');
      } catch (error) {
        await Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression.', 'error');
      }
    }
  };

  const handleUpdate = (role) => {
    Swal.fire({
      title: 'Modifier le rôle',
      html: `<input type="text" id="roleName" class="swal2-input" value="${role.name}">`,
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return document.getElementById('roleName').value;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleUpdateName(role.id, result.value);
      }
    });
  };

  const handleUpdateName = async (id, newName) => {
    try {
      await axios.put(`http://192.168.1.13:8080/api/v1/roles/${id}`, { name: newName });
      const updatedRoles = roles.map((role) => {
        if (role.id === id) {
          return { ...role, name: newName };
        }
        return role;
      });
      setRoles(updatedRoles);
      await Swal.fire('Modifié!', 'Le rôle a été mis à jour.', 'success');
    } catch (error) {
      await Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
    }
  };

  const handleAddRole = async () => {
    const { value: roleName } = await Swal.fire({
      title: 'Ajouter un rôle',
      input: 'text',
      inputLabel: 'Nom du rôle',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Le nom du rôle est requis';
        }
      }
    });

    if (roleName) {
      try {
        const response = await axios.post('http://192.168.1.13:8080/api/v1/roles', {
          id: 0,
          name: roleName,
          present: true
        });
        setRoles([...roles, response.data]);
        await Swal.fire('Ajouté!', 'Le rôle a été ajouté avec succès.', 'success');
      } catch (error) {
        await Swal.fire('Erreur', 'Une erreur s\'est produite lors de l\'ajout du rôle.', 'error');
      }
    }
  };

  return (
    <div>
      <div>
        <AddButton onClick={handleAddRole}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un rôle
        </AddButton>
        <Header>Liste des rôles</Header>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(role.id, role.name)}>
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

export default TableauRoles;
