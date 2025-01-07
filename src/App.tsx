import "./App.css";
import { useFetch } from "./hooks";

/**
 * URL de la API:
 * - La URL que será utilizada por el hook `useFetch` para realizar la solicitud.
 */
const url = "https://api.example.com/data";

/**
 * Interfaz `Data`:
 * - Define la estructura esperada de los datos que devuelve la API.
 */
interface Data {
  name: string;
  lastName: string;
  age: number;
}

/**
 * Componente `App`:
 * - Utiliza el hook `useFetch` para gestionar la solicitud HTTP.
 * - Renderiza la interfaz según el estado de la solicitud.
 */
function App() {
  /**
   * Hook `useFetch`:
   * - `data`: Contiene los datos obtenidos de la API.
   * - `loading`: Indica si la solicitud está en curso.
   * - `error`: Contiene información del error si ocurre un fallo.
   */
  // Uso del hook `useFetch` con el tipo `Data`.
  const { data, error, loading } = useFetch<Data>(url);

  /**
   * Renderizado condicional:
   * - Muestra diferentes contenidos según el estado de la solicitud HTTP.
   */

  // Caso 1: La solicitud está en curso.
  if (loading) {
    return <div>Cargando...</div>; // Mientras se cargan los datos, muestra este mensaje.
  }

  // Caso 2: Ocurrió un error durante la solicitud.
  if (error) {
    return <div>UPS! Hay un error: {error.message}</div>; // Muestra el mensaje de error.
  }

  // Caso 3: La solicitud fue exitosa y hay datos para mostrar.
  return (
    // Renderiza los datos obtenidos de la API en formato JSON.
    <div>{JSON.stringify(data)}</div>
  );
}

export default App;
