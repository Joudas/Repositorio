import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg"; //Postgres  // pnpm i -D @types/pg
import { prisma } from "./prisma";
export const auth = betterAuth({
	//...
    plugins: [nextCookies()],
	database: new Pool({
    // connection options
        connectionString: process.env.DATABASE_URL,
        ssl: false, // Si es etorno local false, si es bd en la nube true
    }),
    emailAndPassword: { // Proveedores de email
        enabled: true, 
        requireEmailVerification: true
    }, 
    socialProviders: { // Proveedores de sociales
        github: { 
        clientId: process.env.GITHUB_CLIENT_ID as string, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
        clientId: process.env.GOOGLE_CLIENT_ID as string, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
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