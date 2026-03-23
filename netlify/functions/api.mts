import { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req: Request, context: Context) => {
    // 1. SIMPLE AUTHENTICATION
    const authHeader = req.headers.get("Authorization");
    const adminPin = process.env.APP_PIN; // Configure on Netlify dashboard
    
    if (!adminPin) {
        return new Response(JSON.stringify({ error: "Server Configuration Error: Missing PIN" }), { status: 500 });
    }
    
    if (authHeader !== `Bearer ${adminPin}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // CORS Headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    // If preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers });
    }

    try {
        const url = new URL(req.url);
        const action = url.searchParams.get("action");
        const blobStore = getStore("player_stats");

        // Initialization of store if empty
        let points = parseInt(await blobStore.get("points") || "0");
        let level = parseInt(await blobStore.get("level") || "1");
        let failedTopics = await blobStore.get("failed_topics") || "";

        if (action === "stats") {
            return new Response(JSON.stringify({ points, level, failedTopics }), { headers, status: 200 });
        }

        if (action === "challenge") {
            const body = await req.json();
            const preferredTopic = body.topic || "Conceptos avanzados";

            // Get professor code from Github directly via api
            const githubRes = await fetch("https://api.github.com/repos/aguscarrera77/Python-datos/contents");
            let githubCode = "No fresh code available";
            if (githubRes.ok) {
                const files = await githubRes.json();
                const pyFiles = files.filter((f: any) => f.name.endsWith('.py') || f.name.endsWith('.ipynb'));
                if (pyFiles.length > 0) {
                    const lastFileUrl = pyFiles[pyFiles.length - 1].download_url;
                    const codeRes = await fetch(lastFileUrl);
                    githubCode = await codeRes.text();
                }
            }

            const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
            const model = genai.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

            const prompt = `
            Eres mi simulador educativo personal para Python.
            Soy Nivel ${level}. He fallado previamente en: ${failedTopics}.
            El tema de estudio que he solicitado es: ${preferredTopic}.
            
            Usa la siguiente base del github del profesor como inspiración para sintaxis y nivel:
            ${githubCode.substring(0, 1000)}

            Genera un problema real de hardware o software que yo deba resolver.
            Usa el siguiente formato JSON estricto sin markdown tags:
            {
                "contexto": "Escenario",
                "pregunta": "Pregunta",
                "codigo": "Código con '___' si es completar",
                "opciones": ["A", "B", "C", "D"],
                "correcta": "La respuesta exacta",
                "explicacion": "El porqué de la respuesta"
            }
            `;

            const aiResponse = await model.generateContent(prompt);
            const textResponse = aiResponse.response.text();
            const cleanJson = textResponse.replace(/^```json/g, '').replace(/```$/g, '').trim();

            return new Response(cleanJson, { headers, status: 200 });
        }

        if (action === "submit") {
            const body = await req.json();
            const isCorrect = body.isCorrect;
            const topic = body.topic;

            if (isCorrect) {
                points += 100 * level;
                level = Math.floor(points / 500) + 1;
                await blobStore.set("points", points.toString());
                await blobStore.set("level", level.toString());
            } else {
                failedTopics += `${topic}, `;
                await blobStore.set("failed_topics", failedTopics.substring(0, 50));
            }

            return new Response(JSON.stringify({ success: true, points, level }), { headers, status: 200 });
        }

        return new Response(JSON.stringify({ error: "Unknown Action" }), { status: 400 });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const config: Config = {
    path: "/api/game"
};
