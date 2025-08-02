import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

// Email del administrador
const ADMIN_EMAIL = "devsplice@gmail.com";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let userRole = null;

      // Caso 1: El usuario es el Administrador
      if (user.email === ADMIN_EMAIL) {
        userRole = 'admin';
        if (!userDoc.exists()) {
          // Si es la primera vez que el admin inicia sesión, crea su documento
          await setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'admin', // Asigna el rol de admin directamente
            createdAt: new Date(),
            lastLoginAt: new Date(),
          });
        } else {
          // Si ya existe, solo actualiza la fecha de login
          await updateDoc(userDocRef, { lastLoginAt: new Date() });
        }
        navigate('/admin'); // Redirige al dashboard de admin
        return; // Termina la ejecución aquí
      }

      // Caso 2: El usuario ya existe en Firestore
      if (userDoc.exists()) {
        await updateDoc(userDocRef, { lastLoginAt: new Date() });
        // Comprueba si el usuario ya tiene un rol asignado
        if (userDoc.data().role) {
          navigate('/dashboard'); // Si tiene rol, va al dashboard general
        } else {
          navigate('/select-role'); // Si no tiene rol, va a la página de selección
        }
      } else {
        // Caso 3: Es un usuario completamente nuevo
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          role: null // El rol se deja nulo para que lo elija después
        });
        navigate('/select-role'); // Lo mandamos a elegir su rol
      }

    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
    }
  };

  return (
    <div>
      <h1>Bienvenido</h1>
      <p>Inicia sesión para continuar</p>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;