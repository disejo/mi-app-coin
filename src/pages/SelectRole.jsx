import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const SelectRole = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelection = async (role) => {
        if (!user) {
            console.error("No hay usuario autenticado.");
            navigate('/login');
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                role: role
            });
            // Importante: forzar una recarga o redirigir al dashboard
            // donde el AuthContext actualizado lo recogerá.
            navigate('/dashboard'); 
        } catch (error) {
            console.error("Error al seleccionar el rol:", error);
        }
    };

    return (
        <div>
            <h1>Completa tu perfil</h1>
            <p>Para continuar, por favor elige tu rol en la plataforma.</p>
            <div>
                <button onClick={() => handleRoleSelection('docente')}>Soy Docente</button>
                <button onClick={() => handleRoleSelection('estudiante')}>Soy Estudiante</button>
            </div>
        </div>
    );
};

export default SelectRole;