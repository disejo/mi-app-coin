import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <img src={userData.photoURL} alt="Foto de perfil" width="100" />
      <p><strong>Nombre:</strong> {userData.displayName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
    </div>
  );
};

export default Profile;