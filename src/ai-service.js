import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    constructor() {
        // Version simulée pour le développement
        this.model = {
            generateContent: async (prompt) => {
                return {
                    response: {
                        text: () => JSON.stringify(this.getDefaultAnalysis())
                    }
                };
            }
        };
    }

    async analyzeCV(cvText, jobDescription = '') {
        try {
            const prompt = this.buildAnalysisPrompt(cvText, jobDescription);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const analysisText = response.text();
            
            return this.parseAnalysisResponse(analysisText);
        } catch (error) {
            console.error('Erreur lors de l\'analyse IA:', error);
            throw new Error('Erreur lors de l\'analyse par l\'IA');
        }
    }

    buildAnalysisPrompt(cvText, jobDescription) {
        return `
Analysez ce CV en tant qu'expert en recrutement et systèmes ATS. Fournissez une analyse détaillée au format JSON.

CV À ANALYSER:
${cvText}

${jobDescription ? `DESCRIPTION DU POSTE:
${jobDescription}` : ''}

Analysez selon ces critères et retournez UNIQUEMENT un JSON valide avec cette structure exacte:

{
  "overallScore": [score sur 100],
  "details": [
    {
      "category": "Structure et Format",
      "score": [score sur 100],
      "description": "Évaluation de l'organisation, lisibilité et compatibilité ATS",
      "issues": ["problème 1", "problème 2"],
      "strengths": ["point fort 1", "point fort 2"]
    },
    {
      "category": "Mots-clés et Optimisation ATS",
      "score": [score sur 100],
      "description": "Présence de mots-clés pertinents pour les systèmes ATS",
      "issues": ["problème 1", "problème 2"],
      "strengths": ["point fort 1", "point fort 2"]
    },
    {
      "category": "Contenu et Expérience",
      "score": [score sur 100],
      "description": "Qualité et pertinence des informations professionnelles",
      "issues": ["problème 1", "problème 2"],
      "strengths": ["point fort 1", "point fort 2"]
    },
    {
      "category": "Compétences et Qualifications",
      "score": [score sur 100],
      "description": "Présentation des compétences techniques et soft skills",
      "issues": ["problème 1", "problème 2"],
      "strengths": ["point fort 1", "point fort 2"]
    },
    {
      "category": "Impact et Résultats",
      "score": [score sur 100],
      "description": "Quantification des réalisations et impact professionnel",
      "issues": ["problème 1", "problème 2"],
      "strengths": ["point fort 1", "point fort 2"]
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "title": "Titre de la recommandation",
      "description": "Description détaillée de l'amélioration à apporter",
      "impact": "Impact attendu de cette amélioration"
    }
  ],
  "atsCompatibility": {
    "score": [score sur 100],
    "issues": ["problème ATS 1", "problème ATS 2"],
    "recommendations": ["conseil ATS 1", "conseil ATS 2"]
  },
  "keywordAnalysis": {
    "matchedKeywords": ["mot-clé 1", "mot-clé 2"],
    "missingKeywords": ["mot-clé manquant 1", "mot-clé manquant 2"],
    "suggestions": ["suggestion 1", "suggestion 2"]
  }
}

Critères d'évaluation:
- Structure: Sections claires, format professionnel, lisibilité
- Mots-clés: Pertinence secteur, optimisation ATS, correspondance poste
- Contenu: Richesse informations, cohérence, progression carrière
- Compétences: Diversité, pertinence, niveau détail
- Impact: Quantification résultats, réalisations concrètes, valeur ajoutée

Retournez UNIQUEMENT le JSON, sans texte supplémentaire.
        `;
    }

    parseAnalysisResponse(responseText) {
        try {
            // Nettoyer la réponse pour extraire le JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Format de réponse invalide');
            }
            
            const jsonString = jsonMatch[0];
            const analysis = JSON.parse(jsonString);
            
            // Validation de la structure
            if (!analysis.overallScore || !analysis.details || !analysis.recommendations) {
                throw new Error('Structure de réponse incomplète');
            }
            
            return analysis;
        } catch (error) {
            console.error('Erreur lors du parsing de la réponse IA:', error);
            // Retourner une analyse par défaut en cas d'erreur
            return this.getDefaultAnalysis();
        }
    }

    getDefaultAnalysis() {
        return {
            overallScore: 65,
            details: [
                {
                    category: "Structure et Format",
                    score: 70,
                    description: "Évaluation de l'organisation, lisibilité et compatibilité ATS",
                    issues: ["Format pourrait être optimisé"],
                    strengths: ["Structure générale correcte"]
                },
                {
                    category: "Mots-clés et Optimisation ATS",
                    score: 60,
                    description: "Présence de mots-clés pertinents pour les systèmes ATS",
                    issues: ["Manque de mots-clés spécifiques"],
                    strengths: ["Quelques termes techniques présents"]
                },
                {
                    category: "Contenu et Expérience",
                    score: 65,
                    description: "Qualité et pertinence des informations professionnelles",
                    issues: ["Descriptions d'expérience à enrichir"],
                    strengths: ["Expériences pertinentes"]
                },
                {
                    category: "Compétences et Qualifications",
                    score: 70,
                    description: "Présentation des compétences techniques et soft skills",
                    issues: ["Niveau de compétences à préciser"],
                    strengths: ["Bonnes compétences listées"]
                },
                {
                    category: "Impact et Résultats",
                    score: 55,
                    description: "Quantification des réalisations et impact professionnel",
                    issues: ["Manque de quantification", "Résultats peu détaillés"],
                    strengths: ["Quelques réalisations mentionnées"]
                }
            ],
            recommendations: [
                {
                    priority: "high",
                    title: "Optimiser pour les ATS",
                    description: "Améliorer la compatibilité avec les systèmes de tracking des candidatures",
                    impact: "Augmentation significative des chances de passage des filtres automatiques"
                },
                {
                    priority: "medium",
                    title: "Quantifier les réalisations",
                    description: "Ajouter des chiffres et des résultats concrets à vos expériences",
                    impact: "Meilleure démonstration de votre valeur ajoutée"
                },
                {
                    priority: "medium",
                    title: "Enrichir les mots-clés",
                    description: "Intégrer plus de termes techniques et sectoriels pertinents",
                    impact: "Amélioration du matching avec les offres d'emploi"
                }
            ],
            atsCompatibility: {
                score: 65,
                issues: ["Format à optimiser", "Mots-clés insuffisants"],
                recommendations: ["Utiliser un format plus simple", "Ajouter des mots-clés sectoriels"]
            },
            keywordAnalysis: {
                matchedKeywords: ["expérience", "compétences", "formation"],
                missingKeywords: ["leadership", "gestion de projet", "résultats"],
                suggestions: ["Ajouter des termes spécifiques au poste", "Utiliser le vocabulaire de l'offre d'emploi"]
            }
        };
    }

    async generateCVSuggestions(cvData, jobDescription = '') {
        try {
            const prompt = `
En tant qu'expert en rédaction de CV, analysez ces données et suggérez des améliorations:

DONNÉES CV:
${JSON.stringify(cvData, null, 2)}

${jobDescription ? `POSTE VISÉ:
${jobDescription}` : ''}

Fournissez des suggestions d'amélioration au format JSON:

{
  "summary": "Version améliorée du résumé professionnel",
  "experienceImprovements": [
    {
      "originalDescription": "description originale",
      "improvedDescription": "description améliorée avec quantification et mots-clés",
      "addedValue": "ce qui a été amélioré"
    }
  ],
  "skillsSuggestions": {
    "technical": ["compétence technique 1", "compétence technique 2"],
    "soft": ["soft skill 1", "soft skill 2"]
  },
  "keywordSuggestions": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
  "generalTips": ["conseil 1", "conseil 2", "conseil 3"]
}

Retournez UNIQUEMENT le JSON.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const suggestionsText = response.text();
            
            const jsonMatch = suggestionsText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            return null;
        } catch (error) {
            console.error('Erreur lors de la génération de suggestions:', error);
            return null;
        }
    }
}