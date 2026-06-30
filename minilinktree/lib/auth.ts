import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { prisma } from "./prisma";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno faltante: ${name}. Revisa .env.example`);
  }
  return value;
}

const DATABASE_URL = requireEnv("DATABASE_URL");
const GITHUB_CLIENT_ID = requireEnv("GITHUB_CLIENT_ID");
const GITHUB_CLIENT_SECRET = requireEnv("GITHUB_CLIENT_SECRET");
const GOOGLE_CLIENT_ID = requireEnv("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = requireEnv("GOOGLE_CLIENT_SECRET");

export const auth = betterAuth({
    plugins: [nextCookies()],
	database: new Pool({
        connectionString: DATABASE_URL,
        ssl: false,
    }),
    emailAndPassword: {
        enabled: true, 
        requireEmailVerification: true,
    }, 
    socialProviders: {
        github: { 
        clientId: GITHUB_CLIENT_ID, 
        clientSecret: GITHUB_CLIENT_SECRET, 
        }, 
        google: { 
        clientId: GOOGLE_CLIENT_ID, 
        clientSecret: GOOGLE_CLIENT_SECRET, 
        }, 
    },
    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            console.log(`Hola ${user}, copia esta url: ${url}`)
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // Esto se ejecuta única y exclusivamente cuando un usuario nuevo se registra
                    console.log("Usuario recién creado:", user);
                    
                    try {
                        await prisma.perfil.create({
                            data: {
                                userId: user.id,
                                username: user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
                                displayName: user.name,
                                bio: "¡Bienvenido a mi nuevo Mini-Linktree!",
                            }
                        });
                        console.log("Perfil de Prisma creado con éxito");
                    } catch (error) {
                        console.error("Error creando el perfil inicial en Prisma:", error);
                    }
                }
            }
        }
    }
});