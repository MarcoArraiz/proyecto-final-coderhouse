import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Cookies from 'js-cookie';

const UsersDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:4000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('jwtCookie')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                console.log(response);
                const data = await response.json();
                console.log(data);
                setUsers(data.payload.docs);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('jwtCookie')}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            // Actualizar la lista de usuarios
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            {isLoading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.rol}</td>
                                <td>
                                    <Button variant="danger" onClick={() => deleteUser(user._id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default UsersDashboard;
