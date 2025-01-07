import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  /**
   * Estado del componente:
   * React usa el hook `useState` para manejar valores dinámicos que cambian durante
   * la vida útil del componente. Aquí definimos tres estados:
   *
   * 1. `data`: Almacena los datos obtenidos desde la API.
   * 2. `loading`: Indica si hay una operación en curso (muestra un mensaje de "cargando").
   * 3. `error`: Almacena cualquier mensaje de error si ocurre un fallo al interactuar con la API.
   */
  const [data, setData] = useState([]); // Inicialmente, un arreglo vacío para los datos.
  const [loading, setLoading] = useState(false); // Inicialmente no hay carga.
  const [error, setError] = useState(""); // Inicialmente no hay errores.

  /**
   * Función `consoleLoader`:
   * - Esta función está optimizada con `useCallback` para evitar que se recree en cada renderizado.
   * - Cambia el estado `loading` y registra su valor en la consola.
   * - El uso de `useCallback` asegura que solo se recreará si cambia `loading`, mejorando el rendimiento.
   */
  const consoleLoader = useCallback(
    (loadingValue: boolean) => {
      setLoading(loadingValue); // Actualiza el estado de carga.
      console.info(loading); // Nota: Este console.log muestra el valor ANTERIOR, no el actualizado.
    },
    [loading] // Dependencia: esta función depende de `loading` para saber cuándo cambiar.
  );

  /**
   * Función `fetchData`:
   * - Esta función realiza una solicitud `fetch` para obtener datos desde un endpoint externo.
   * - Es asincrónica porque la obtención de datos de una API puede tardar tiempo.
   * - Maneja tres estados: carga, datos obtenidos, y posibles errores.
   * - Optimizada con `useCallback` para evitar que se recree en cada renderizado.
   */
  const fetchData = useCallback(async () => {
    consoleLoader(true); // Inicia el indicador de carga.

    try {
      const response = await fetch("https://api.expample.com/data"); // Llamada a la API.

      if (!response.ok) {
        // Si la respuesta no es exitosa (código HTTP diferente de 2xx):
        throw new Error("Error al obtener datos"); // Lanza un error controlado.
      }

      const jsonData = await response.json(); // Convierte la respuesta en JSON.
      setData(jsonData); // Guarda los datos en el estado `data`.
    } catch (err) {
      // Captura cualquier error que ocurra durante la operación (ej. red fallida).
      setError((err as Error).message); // Almacena el mensaje de error en el estado.
    } finally {
      // Esta sección se ejecuta siempre, haya o no errores.
      consoleLoader(false); // Finaliza el indicador de carga.
    }
  }, [consoleLoader]); // Dependencia: usa `consoleLoader`, por lo que React verifica cambios.

  /**
   * Hook `useEffect`:
   * - Este hook permite manejar efectos secundarios en el componente, como la llamada a una API.
   * - Aquí se ejecuta la función `fetchData` cuando el componente se monta por primera vez.
   * - El arreglo de dependencias `[fetchData]` asegura que este efecto solo se ejecute
   *   nuevamente si la función `fetchData` cambia (poco probable en este caso).
   */
  useEffect(() => {
    fetchData(); // Llama a la función para obtener datos cuando el componente se monta.

    // Limpieza opcional (aquí no es necesaria porque no se usan recursos persistentes como timers):
    // return () => { ... };
  }, [fetchData]);

  /**
   * Renderizado condicional:
   * - React evalúa el estado actual (`loading`, `error`, o `data`) para decidir qué renderizar.
   * - Si `loading` es verdadero, muestra un mensaje de "Cargando...".
   * - Si `error` tiene contenido, muestra el mensaje de error.
   * - Si ninguno de los anteriores aplica, renderiza los datos obtenidos.
   */
  if (loading) {
    return <div>Cargando...</div>; // Mientras se cargan los datos, muestra este mensaje.
  }

  if (error) {
    return <div>UPS! Hay un error: {error}</div>; // Si ocurre un error, muestra este mensaje.
  }

  return (
    // Renderiza los datos obtenidos de la API en formato JSON.
    <div>{JSON.stringify(data)}</div>
  );
}

export default App;
