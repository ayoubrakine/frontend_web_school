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
        const response = await axios.get('http://localhost:8080/api/student');
        setRoles(response.data);
      } catch (error) {
        // Error handling
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, username) => {
    const confirmation = await Swal.fire({
      title: `Êtes-vous sûr de vouloir supprimer "${username}" ?`,
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer'
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/student/${id}`);
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
        <input type="text" id="roleUsername" class="swal2-input" value="${role.username}">
        <input type="text" id="roleName" class="swal2-input" value="${role.name}">
        <input type="text" id="roleEmail" class="swal2-input" value="${role.email}">
        <input type="text" id="rolePhone" class="swal2-input" value="${role.phone}">
      `,
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const newUsername = document.getElementById('roleUsername').value;
        const newName = document.getElementById('roleName').value;
        const newEmail = document.getElementById('roleEmail').value;
        const newPhone = document.getElementById('rolePhone').value;
        return { newUsername, newName, newEmail, newPhone };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { newUsername, newName, newEmail, newPhone } = result.value;
        handleUpdateName(role.id, newUsername, newName, newEmail, newPhone);
      }
    });
  };

  const handleUpdateName = async (id, newUsername, newName, newEmail, newPhone) => {
    try {
      await axios.put(`http://localhost:8080/api/student/${id}`, {
        username: newUsername,
        name: newName,
        email: newEmail,
        phone: newPhone
      });
      const updatedRoles = roles.map((role) => {
        if (role.id === id) {
          return { ...role, username: newUsername, name: newName, email: newEmail, phone: newPhone };
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
    const { value: roleUsername, value: roleName, value: roleEmail, value: rolePhone } = await Swal.fire({
      title: 'Ajouter une filière',
      html: `
        <input type="text" id="roleUsername" class="swal2-input" placeholder="Nom d'utilisateur">
        <input type="text" id="roleName" class="swal2-input" placeholder="Nom">
        <input type="text" id="roleEmail" class="swal2-input" placeholder="Email">
        <input type="text" id="rolePhone" class="swal2-input" placeholder="Téléphone">
      `,
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const newUsername = document.getElementById('roleUsername').value;
        const newName = document.getElementById('roleName').value;
        const newEmail = document.getElementById('roleEmail').value;
        const newPhone = document.getElementById('rolePhone').value;
        return { newUsername, newName, newEmail, newPhone };
      }
    });

    if (roleUsername && roleName && roleEmail && rolePhone) {
      try {
        const response = await axios.post('http://localhost/api/student', {
          id: 0,
          username: roleUsername,
          name: roleName,
          email: roleEmail,
          phone: rolePhone,
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
            <th>Usernmae</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.username}</td>
              <td>{role.name}</td>
              <td>{role.email}</td>
              <td>{role.phone}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(role.id, role.username)}>
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
