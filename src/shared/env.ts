interface Env {
  databaseUrl: string;
  nodeEnv: string;
}

export const env: Env = {
  databaseUrl: process.env.DATABASE_URL || "",
  nodeEnv: process.env.NODE_ENV,
};
