// src/utils/configLoader.ts
import { useEffect, useState } from 'react';

// Définissez une interface pour le type de données du fichier de configuration
export interface Config {
  apiUrl: string;
}

export const useConfig = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config.json'); // Chemin vers le fichier JSON dans le dossier public
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        const configData: Config = await response.json();
        setConfig(configData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
};
