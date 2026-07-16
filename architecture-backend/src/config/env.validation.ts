type Environment = Record<string, string | undefined>;

const validNodeEnvironments = ['development', 'test', 'production'];

const requiredVariables = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'JWT_ISSUER',
  'JWT_AUDIENCE',
  'FRONTEND_URL',
];

export function validateEnvironment(config: Environment) {
  const missingVariables = requiredVariables.filter((key) => !config[key]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
  }

  const databaseUrl = config.DATABASE_URL;
  if (!databaseUrl || !/^postgres(ql)?:\/\//.test(databaseUrl)) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  const accessSecret = config.JWT_ACCESS_SECRET || '';
  const refreshSecret = config.JWT_REFRESH_SECRET || '';
  if (accessSecret.length < 24) {
    throw new Error('JWT_ACCESS_SECRET must be at least 24 characters long');
  }
  if (refreshSecret.length < 24) {
    throw new Error('JWT_REFRESH_SECRET must be at least 24 characters long');
  }
  if (accessSecret === refreshSecret) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
  }
  if (!config.JWT_ACCESS_EXPIRES_IN) {
    throw new Error('JWT_ACCESS_EXPIRES_IN is required');
  }
  if (!config.JWT_REFRESH_EXPIRES_IN) {
    throw new Error('JWT_REFRESH_EXPIRES_IN is required');
  }
  if (!config.JWT_ISSUER) {
    throw new Error('JWT_ISSUER is required');
  }
  if (!config.JWT_AUDIENCE) {
    throw new Error('JWT_AUDIENCE is required');
  }

  const bcryptSaltRounds = Number(config.BCRYPT_SALT_ROUNDS || 12);
  if (!Number.isInteger(bcryptSaltRounds) || bcryptSaltRounds < 10 || bcryptSaltRounds > 14) {
    throw new Error('BCRYPT_SALT_ROUNDS must be an integer between 10 and 14');
  }

  if (config.ADMIN_EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.ADMIN_EMAIL)) {
    throw new Error('ADMIN_EMAIL must be a valid email address');
  }
  if (config.ADMIN_PASSWORD && config.ADMIN_PASSWORD.length < 10) {
    throw new Error('ADMIN_PASSWORD must be at least 10 characters long');
  }

  const uploadMaxFileSizeMb = Number(config.UPLOAD_MAX_FILE_SIZE_MB || 10);
  if (!Number.isInteger(uploadMaxFileSizeMb) || uploadMaxFileSizeMb < 1 || uploadMaxFileSizeMb > 20) {
    throw new Error('UPLOAD_MAX_FILE_SIZE_MB must be an integer between 1 and 20');
  }

  const uploadMaxFiles = Number(config.UPLOAD_MAX_FILES || 20);
  if (!Number.isInteger(uploadMaxFiles) || uploadMaxFiles < 1 || uploadMaxFiles > 30) {
    throw new Error('UPLOAD_MAX_FILES must be an integer between 1 and 30');
  }

  const requiresCloudinary =
    config.NODE_ENV !== 'test' &&
    (config.CLOUDINARY_CLOUD_NAME || config.CLOUDINARY_API_KEY || config.CLOUDINARY_API_SECRET);
  if (requiresCloudinary) {
    if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is incomplete');
    }
  }

  const frontendUrl = config.FRONTEND_URL;
  if (frontendUrl) {
    const origins = frontendUrl
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    if (origins.length === 0) {
      throw new Error('FRONTEND_URL must include at least one valid URL');
    }
    for (const origin of origins) {
      try {
        new URL(origin);
      } catch {
        throw new Error('FRONTEND_URL must be a comma-separated list of valid URLs');
      }
    }
  }

  const nodeEnv = config.NODE_ENV || 'development';
  if (!validNodeEnvironments.includes(nodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${validNodeEnvironments.join(', ')}`);
  }

  const port = Number(config.PORT || 4000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return {
    ...config,
    NODE_ENV: nodeEnv,
    BCRYPT_SALT_ROUNDS: bcryptSaltRounds,
    CLOUDINARY_PROJECT_FOLDER: config.CLOUDINARY_PROJECT_FOLDER || 'architecture-projects',
    UPLOAD_MAX_FILE_SIZE_MB: uploadMaxFileSizeMb,
    UPLOAD_MAX_FILES: uploadMaxFiles,
    PORT: port,
  };
}
