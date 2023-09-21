import dotenv from 'dotenv';

dotenv.config();

export const config = {
    api: {
        prefix: process.env.API_PREFIX ?? '/api',
    },
    port: process.env.PORT ?? 8070,
}