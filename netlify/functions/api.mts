import { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req: Request, context: Context) => {
    // Auth simple
    const authHeader = req.headers.get("Authorization");
    const adminPin = process.env.APP_PIN;
    if (!adminPin) return new Response(JSON.stringify({ error: "Config missing" }), { status: 500 });
    if (authHeader !== `Bearer ${adminPin}`) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    if (req.method === "OPTIONS") return new Response("ok", { headers });

    try {
        const url = new URL(req.url);
        const action = url.searchParams.get("action");
        const blobStore = getStore("player_stats");

        let points = parseInt(await blobStore.get("points") || "0");
        let level = parseInt(await blobStore.get("level") || "1");
        let failed = await blobStore.get("failed_topics") || "Ninguno";

        if (action === "stats") {
            return new Response(JSON.stringify({ points, level, failedTopics: failed }), { headers });
        }

        if (action === "challenge") {
            const body = await req.json();
            const topic = body.topic || "Conceptos avanzados";

            // SCRAPER DE GITHUB (Filtrar solo .py para evitar errores 500)
            let githubCode = "Nivel básico de Python";
            try {
                const githubRes = await fetch("https://api.github.com/repos/aguscarrera77/Python-datos/contents");
                if (githubRes.ok) {
                    const files = await githubRes.json();
                    const pyFiles = files.filter((f: any) => f.name.endsWith('.py')); 
                    if (pyFiles.length > 0) {
                        const codeRes = await fetch(pyFiles[pyFiles.length - 1].download_url);
                        githubCode = await codeRes.text();
                    }
                }
            } catch (e) {
                console.log("Github unreachable");
            }

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

            const prompt = `
            Genera un reto personal de Python en formato JSON.
            Alumno Nivel: ${level}. Fallos previos: ${failed}.
            Tema solicitado: ${topic}.
            
            Contexto técnico del profesor:
            ${githubCode.substring(0, 1500)}

            Responde ÚNICAMENTE con el objeto JSON puro sin bloques de código markdown:
            {
                "contexto": "Escenario",
                "pregunta": "¿Qué resolver?",
                "codigo": "Código con '___' si aplica",
                "opciones": ["A", "B", "C", "D"],
                "correcta": "La opción exacta",
                "explicacion": "Análisis rápido"
            }
            `;

            const aiResult = await model.generateContent(prompt);
            const responseText = aiResult.response.text();
            const cleanJsonText = responseText.replace(/```json|```/g, "").trim();
            
            return new Response(cleanJsonText, { headers });
        }

        if (action === "submit") {
            const body = await req.json();
            if (body.isCorrect) {
                points += 100 * level;
                level = Math.floor(points / 500) + 1;
                await blobStore.set("points", points.toString());
                await blobStore.set("level", level.toString());
            } else {
                const newFailed = (failed + ", " + body.topic).substring(0, 100);
                await blobStore.set("failed_topics", newFailed);
            }
            return new Response(JSON.stringify({ success: true, points, level }), { headers });
        }

        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
};

export const config: Config = { path: "/api/game" };
