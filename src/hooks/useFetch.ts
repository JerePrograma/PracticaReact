import { useEffect, useState } from "react";

/**
 * Tipos genéricos y estructuras para el hook `useFetch`:
 * - `Data<T>`: Los datos pueden ser del tipo genérico `T` o `null` (inicialmente no hay datos).
 * - `ErrorType`: Define que el error puede ser del tipo `Error` o `null` (inicialmente no hay errores).
 */
type Data<T> = T | null;
type ErrorType = Error | null;

interface Params<T> {
  data: Data<T>; // Datos obtenidos de la API.
  loading: boolean; // Indicador de estado de carga.
  error: ErrorType; // Mensaje de error en caso de fallo.
}

/**
 * Hook `useFetch`:
 * - Este hook encapsula la lógica de realizar solicitudes HTTP.
 * - Es genérico, lo que significa que puede adaptarse al tipo de datos esperado (`T`).
 */
export const useFetch = <T>(url: string): Params<T> => {
  const [data, setData] = useState<Data<T>>(null); // Estado inicial para almacenar los datos.
  const [loading, setLoading] = useState(true); // Estado de carga inicializado como `true`.
  const [error, setError] = useState<ErrorType>(null); // Estado de error inicializado como `null`.

  /**
   * Hook `useEffect`:
   * - Realiza la solicitud HTTP al montarse el componente o al cambiar la URL.
   */
  useEffect(() => {
    const controller = new AbortController(); // `AbortController` permite cancelar la solicitud si el componente se desmonta.

    setLoading(true); // Activa el indicador de carga antes de la solicitud.

    /**
     * Función `fetchData`:
     * - Realiza la solicitud HTTP.
     * - Maneja los estados de datos, error y carga.
     */
    const fetchData = async () => {
      try {
        // Realiza la solicitud `fetch`, pasando el controlador para habilitar la cancelación.
        const response = await fetch(url, { signal: controller.signal });

        // Si la respuesta no es satisfactoria (status code fuera de 2xx), lanza un error.
        if (!response.ok) {
          throw new Error("Error en la petición");
        }

        // Convierte la respuesta en JSON y la almacena en el estado `data`.
        const jsonData: T = await response.json();
        setData(jsonData); // Actualiza el estado con los datos obtenidos.
        setError(null); // Limpia cualquier error previo.
      } catch (err) {
        // En caso de error, actualiza el estado con el mensaje del error.
        setError(err as Error);
      } finally {
        // Al finalizar (con éxito o fallo), desactiva el indicador de carga.
        setLoading(false);
      }
    };

    fetchData(); // Llama a la función para iniciar la solicitud.

    // Limpieza: cancela la solicitud si el componente se desmonta antes de completarse.
    return () => {
      controller.abort();
    };
  }, [url]); // Dependencia: React ejecutará este efecto solo si `url` cambia.

  /**
   * Retorno del hook:
   * - Devuelve un objeto con los estados `data`, `loading` y `error`.
   * - Esto permite que el componente consumidor gestione la interfaz según el estado.
   */
  return { data, loading, error };
};
