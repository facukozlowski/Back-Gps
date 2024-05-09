require("dotenv").config();

export function checkEnvs<T extends readonly string[]>(
  envs: { [k: string]: string | undefined },
  requiredKeys: T
): { [key in T[number]]: string } {
  let response: { [k: string]: string } = {};
  const keys = Object.keys(envs);

  requiredKeys.forEach((key) => {
    if (!keys.includes(key))
      throw new Error(`Falta variable de entorno: ${key}`);
  });

  const env = Object.entries(envs);

  env.forEach(([k, v]) => {
    if (k in requiredKeys) {
      if (!v || v == null || v == undefined)
        throw new Error(
          `La propiedad de entorno ${k} no puede estar vacio y no debe ser NULL`
        );
      response[k] = v;
    }
  });

  return envs as any;
}
