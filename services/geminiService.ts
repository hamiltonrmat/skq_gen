import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface CourseParams {
    domaine: string;
    nomCompetence: string;
    sujetPrincipal: string;
    motsCles: string;
}

export async function generateCourseMarkdown(params: CourseParams): Promise<string> {
    const model = 'gemini-2.5-flash';
    const { domaine, nomCompetence, sujetPrincipal, motsCles } = params;
    const topic = `${nomCompetence} : ${sujetPrincipal}`;

    const systemInstruction = `Tu es un assistant expert dans la création de contenu pédagogique pour des étudiants ingénieurs de niveau L1/L2. Ton objectif est de générer des plans de cours complets et structurés au format Markdown, optimisés pour être utilisés dans des applications comme Obsidian, qui supporte le formatage LaTeX pour les mathématiques.

    Voici les règles de formatage à respecter impérativement :
    - **Hiérarchie :** Utilise une hiérarchie claire avec des titres et sous-titres (\`#\`, \`##\`, \`###\`).
    - **Organisation :** Organise le contenu en modules et leçons.
    - **Listes :** Utilise des listes à puces (\`-\`) pour les points clés et les détails.
    - **Mise en évidence :** Mets en évidence les concepts importants en **gras** ou en *italique*.
    - **Formules mathématiques :**
        - Pour les formules en ligne (dans le texte), entoure-les d'un seul dollar (\`$\`). Par exemple : \`L'équation d'Euler est $e^{i\pi} + 1 = 0$.\`.
        - Pour les formules en bloc (centrées sur leur propre ligne), entoure-les de doubles dollars (\`$$\`). Par exemple : \`$$ \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi} $$\`.
    - **Définitions :** Mets en avant les définitions en utilisant des blockquotes (\`>\`). Commence la définition par "**Définition :**".
    - **Théorèmes :** Mets en avant les théorèmes en utilisant des blockquotes (\`>\`). Commence le théorème par "**Théorème :**".
    - **Sortie :** Assure-toi que la sortie est uniquement du Markdown valide. Ne fournis aucune introduction ou conclusion en dehors du format Markdown.`;
    
    const userPrompt = `Génère un plan de cours détaillé pour l'unité d'enseignement "SkillQuest". Le cours est destiné à des étudiants ingénieurs de niveau L1/L2. Le contenu doit être rigoureux et inclure des exemples pertinents.

    Voici les détails du cours à créer :
    - **Domaine d'étude :** ${domaine}
    - **Compétence visée :** ${nomCompetence}
    - **Sujet principal du cours :** ${sujetPrincipal}
    ${motsCles ? `- **Mots-clés à inclure :** ${motsCles}` : ''}

    Structure et formatage requis :
    - Le plan doit commencer par un titre principal (\`#\`) qui mentionne "SkillQuest", la compétence, et le sujet. Par exemple: "# SkillQuest - ${topic}".
    - Il doit inclure une introduction, plusieurs modules principaux, et une conclusion ou un résumé.
    - L'introduction doit expliquer brièvement l'importance de la compétence "${nomCompetence}" dans le domaine "${domaine}" pour un futur ingénieur.
    - Chaque module doit être un titre de niveau 2 (\`##\`) et contenir plusieurs leçons en tant que titres de niveau 3 (\`###\`).
    - Chaque leçon doit présenter les concepts clés, des définitions, des théorèmes et des exemples.
    - **Important :** Respecte scrupuleusement les règles de formatage pour les mathématiques, les définitions et les théorèmes comme spécifié dans les instructions système (formules avec \`$\` et \`$$\`, définitions et théorèmes avec \`>\`).`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating course content:", error);
        if (error instanceof Error) {
            return `Une erreur est survenue lors de la génération du cours : ${error.message}`;
        }
        return "Une erreur inconnue est survenue.";
    }
}