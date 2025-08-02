import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Loader from "../components/Loader"; // Asumimos que tienes un componente Loader

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Nuevo estado para el perfil de Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Escucha cambios en el documento del usuario en tiempo real
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserProfile({ uid: doc.id, ...doc.data() });
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot(); // Limpia el listener del snapshot
      } else {
        // No hay usuario, resetea todo
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Limpia el listener de autenticación
  }, []);

  if (loading) {
    return <Loader />; // Muestra un loader mientras carga la info
  }

  // Ahora el contexto provee el usuario de Auth y el perfil de Firestore
  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};