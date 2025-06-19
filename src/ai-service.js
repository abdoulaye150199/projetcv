import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    constructor() {
        // Version simulée pour le développement avec analyse dynamique
        this.model = {
            generateContent: async (prompt) => {
                return {
                    response: {
                        text: () => JSON.stringify(this.generateDynamicAnalysis(prompt))
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

    generateDynamicAnalysis(prompt) {
        // Extraire le contenu du CV du prompt
        const cvMatch = prompt.match(/CV À ANALYSER:\s*(.*?)(?=DESCRIPTION DU POSTE:|Analysez selon)/s);
        const cvText = cvMatch ? cvMatch[1].toLowerCase() : '';
        
        const jobMatch = prompt.match(/DESCRIPTION DU POSTE:\s*(.*?)(?=Analysez selon)/s);
        const jobDescription = jobMatch ? jobMatch[1].toLowerCase() : '';

        // Analyse dynamique basée sur le contenu réel
        const analysis = this.performDetailedAnalysis(cvText, jobDescription);
        
        return analysis;
    }

    performDetailedAnalysis(cvText, jobDescription) {
        const wordCount = cvText.split(/\s+/).length;
        const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(cvText);
        const hasPhone = /\b\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/.test(cvText);
        const hasExperience = /expérience|poste|emploi|travail|fonction/i.test(cvText);
        const hasEducation = /formation|diplôme|université|école|étude/i.test(cvText);
        const hasSkills = /compétence|skill|maîtrise|connaissance/i.test(cvText);
        const hasNumbers = /\d+/.test(cvText);
        const hasActionVerbs = /(géré|développé|créé|dirigé|organisé|amélioré|optimisé|réalisé)/i.test(cvText);

        // Calcul des scores basés sur le contenu réel
        const structureScore = this.calculateStructureScore(cvText, hasEmail, hasPhone, hasExperience, hasEducation);
        const keywordScore = this.calculateKeywordScore(cvText, jobDescription);
        const contentScore = this.calculateContentScore(cvText, wordCount, hasNumbers, hasActionVerbs);
        const skillsScore = this.calculateSkillsScore(cvText, hasSkills);
        const impactScore = this.calculateImpactScore(cvText, hasNumbers, hasActionVerbs);

        const overallScore = Math.round((structureScore + keywordScore + contentScore + skillsScore + impactScore) / 5);

        return {
            overallScore,
            details: [
                {
                    category: "Structure et Format",
                    score: structureScore,
                    description: "Évaluation de l'organisation, lisibilité et compatibilité ATS",
                    issues: this.getStructureIssues(structureScore, hasEmail, hasPhone, hasExperience, hasEducation),
                    strengths: this.getStructureStrengths(structureScore, hasEmail, hasPhone, hasExperience, hasEducation)
                },
                {
                    category: "Mots-clés et Optimisation ATS",
                    score: keywordScore,
                    description: "Présence de mots-clés pertinents pour les systèmes ATS",
                    issues: this.getKeywordIssues(keywordScore, jobDescription),
                    strengths: this.getKeywordStrengths(keywordScore, jobDescription)
                },
                {
                    category: "Contenu et Expérience",
                    score: contentScore,
                    description: "Qualité et pertinence des informations professionnelles",
                    issues: this.getContentIssues(contentScore, wordCount),
                    strengths: this.getContentStrengths(contentScore, wordCount)
                },
                {
                    category: "Compétences et Qualifications",
                    score: skillsScore,
                    description: "Présentation des compétences techniques et soft skills",
                    issues: this.getSkillsIssues(skillsScore, hasSkills),
                    strengths: this.getSkillsStrengths(skillsScore, hasSkills)
                },
                {
                    category: "Impact et Résultats",
                    score: impactScore,
                    description: "Quantification des réalisations et impact professionnel",
                    issues: this.getImpactIssues(impactScore, hasNumbers, hasActionVerbs),
                    strengths: this.getImpactStrengths(impactScore, hasNumbers, hasActionVerbs)
                }
            ],
            recommendations: this.generateDynamicRecommendations(overallScore, structureScore, keywordScore, contentScore, skillsScore, impactScore, jobDescription),
            atsCompatibility: this.calculateATSCompatibility(cvText, structureScore),
            keywordAnalysis: this.performKeywordAnalysis(cvText, jobDescription)
        };
    }

    calculateStructureScore(cvText, hasEmail, hasPhone, hasExperience, hasEducation) {
        let score = 40;
        
        if (hasEmail) score += 15;
        if (hasPhone) score += 15;
        if (hasExperience) score += 15;
        if (hasEducation) score += 15;
        
        return Math.min(score, 100);
    }

    calculateKeywordScore(cvText, jobDescription) {
        let score = 30;
        
        const commonKeywords = ['expérience', 'compétences', 'formation', 'projet', 'équipe', 'gestion', 'développement'];
        const techKeywords = ['javascript', 'python', 'java', 'react', 'angular', 'sql', 'git', 'agile'];
        
        commonKeywords.forEach(keyword => {
            if (cvText.includes(keyword)) score += 5;
        });
        
        techKeywords.forEach(keyword => {
            if (cvText.includes(keyword)) score += 3;
        });
        
        if (jobDescription) {
            const jobWords = jobDescription.split(/\s+/).filter(word => word.length > 4);
            const matchingWords = jobWords.filter(word => cvText.includes(word));
            score += Math.min(matchingWords.length * 2, 20);
        }
        
        return Math.min(score, 100);
    }

    calculateContentScore(cvText, wordCount, hasNumbers, hasActionVerbs) {
        let score = 20;
        
        if (wordCount > 100) score += 15;
        if (wordCount > 300) score += 15;
        if (wordCount > 500) score += 10;
        if (hasNumbers) score += 20;
        if (hasActionVerbs) score += 20;
        
        return Math.min(score, 100);
    }

    calculateSkillsScore(cvText, hasSkills) {
        let score = 30;
        
        if (hasSkills) score += 30;
        
        const skillKeywords = ['leadership', 'communication', 'analyse', 'créativité', 'organisation'];
        skillKeywords.forEach(skill => {
            if (cvText.includes(skill)) score += 8;
        });
        
        return Math.min(score, 100);
    }

    calculateImpactScore(cvText, hasNumbers, hasActionVerbs) {
        let score = 20;
        
        if (hasNumbers) score += 30;
        if (hasActionVerbs) score += 30;
        
        const impactWords = ['amélioration', 'augmentation', 'réduction', 'optimisation', 'succès'];
        impactWords.forEach(word => {
            if (cvText.includes(word)) score += 4;
        });
        
        return Math.min(score, 100);
    }

    getStructureIssues(score, hasEmail, hasPhone, hasExperience, hasEducation) {
        const issues = [];
        if (!hasEmail) issues.push("Adresse email manquante");
        if (!hasPhone) issues.push("Numéro de téléphone manquant");
        if (!hasExperience) issues.push("Section expérience peu claire");
        if (!hasEducation) issues.push("Formation non mentionnée");
        if (score < 60) issues.push("Structure générale à améliorer");
        return issues;
    }

    getStructureStrengths(score, hasEmail, hasPhone, hasExperience, hasEducation) {
        const strengths = [];
        if (hasEmail) strengths.push("Contact email présent");
        if (hasPhone) strengths.push("Numéro de téléphone fourni");
        if (hasExperience) strengths.push("Expérience professionnelle détaillée");
        if (hasEducation) strengths.push("Formation clairement indiquée");
        if (score >= 80) strengths.push("Excellente organisation générale");
        return strengths;
    }

    getKeywordIssues(score, jobDescription) {
        const issues = [];
        if (score < 50) issues.push("Mots-clés sectoriels insuffisants");
        if (score < 60) issues.push("Terminologie technique limitée");
        if (jobDescription && score < 70) issues.push("Faible correspondance avec l'offre d'emploi");
        return issues;
    }

    getKeywordStrengths(score, jobDescription) {
        const strengths = [];
        if (score >= 70) strengths.push("Bon usage de mots-clés pertinents");
        if (score >= 80) strengths.push("Terminologie professionnelle appropriée");
        if (jobDescription && score >= 75) strengths.push("Bonne adéquation avec l'offre");
        return strengths;
    }

    getContentIssues(score, wordCount) {
        const issues = [];
        if (wordCount < 200) issues.push("Contenu trop succinct");
        if (score < 60) issues.push("Manque de détails sur les réalisations");
        if (score < 50) issues.push("Descriptions d'expérience insuffisantes");
        return issues;
    }

    getContentStrengths(score, wordCount) {
        const strengths = [];
        if (wordCount >= 300) strengths.push("Contenu suffisamment détaillé");
        if (score >= 70) strengths.push("Bonnes descriptions d'expérience");
        if (score >= 80) strengths.push("Informations riches et pertinentes");
        return strengths;
    }

    getSkillsIssues(score, hasSkills) {
        const issues = [];
        if (!hasSkills) issues.push("Section compétences manquante");
        if (score < 60) issues.push("Compétences peu détaillées");
        if (score < 50) issues.push("Manque de diversité dans les compétences");
        return issues;
    }

    getSkillsStrengths(score, hasSkills) {
        const strengths = [];
        if (hasSkills) strengths.push("Section compétences présente");
        if (score >= 70) strengths.push("Bonne variété de compétences");
        if (score >= 80) strengths.push("Compétences bien structurées");
        return strengths;
    }

    getImpactIssues(score, hasNumbers, hasActionVerbs) {
        const issues = [];
        if (!hasNumbers) issues.push("Manque de quantification des résultats");
        if (!hasActionVerbs) issues.push("Peu de verbes d'action utilisés");
        if (score < 60) issues.push("Impact professionnel peu démontré");
        return issues;
    }

    getImpactStrengths(score, hasNumbers, hasActionVerbs) {
        const strengths = [];
        if (hasNumbers) strengths.push("Résultats quantifiés présents");
        if (hasActionVerbs) strengths.push("Bon usage de verbes d'action");
        if (score >= 70) strengths.push("Impact professionnel bien démontré");
        return strengths;
    }

    generateDynamicRecommendations(overallScore, structureScore, keywordScore, contentScore, skillsScore, impactScore, jobDescription) {
        const recommendations = [];

        if (structureScore < 70) {
            recommendations.push({
                priority: "high",
                title: "Améliorer la structure du CV",
                description: "Organisez votre CV avec des sections claires et ajoutez les informations de contact manquantes.",
                impact: "Meilleure lisibilité et compatibilité ATS"
            });
        }

        if (keywordScore < 60) {
            recommendations.push({
                priority: "high",
                title: "Optimiser les mots-clés",
                description: jobDescription ? 
                    "Intégrez plus de mots-clés de l'offre d'emploi dans votre CV." :
                    "Ajoutez des mots-clés pertinents de votre secteur d'activité.",
                impact: "Augmentation des chances de passage des filtres automatiques"
            });
        }

        if (impactScore < 60) {
            recommendations.push({
                priority: "medium",
                title: "Quantifier vos réalisations",
                description: "Ajoutez des chiffres, pourcentages et résultats concrets à vos expériences.",
                impact: "Démonstration claire de votre valeur ajoutée"
            });
        }

        if (contentScore < 60) {
            recommendations.push({
                priority: "medium",
                title: "Enrichir le contenu",
                description: "Développez davantage vos descriptions d'expérience avec des détails pertinents.",
                impact: "Meilleure compréhension de votre profil par les recruteurs"
            });
        }

        if (skillsScore < 60) {
            recommendations.push({
                priority: "low",
                title: "Détailler les compétences",
                description: "Créez une section compétences complète avec vos compétences techniques et interpersonnelles.",
                impact: "Meilleur matching avec les exigences des postes"
            });
        }

        return recommendations;
    }

    calculateATSCompatibility(cvText, structureScore) {
        let score = Math.max(structureScore - 10, 40);
        const issues = [];
        const recommendations = [];

        if (cvText.includes('tableau') || cvText.includes('image')) {
            score -= 15;
            issues.push("Présence possible d'éléments non compatibles ATS");
            recommendations.push("Évitez les tableaux complexes et les images");
        }

        if (cvText.length < 500) {
            score -= 10;
            issues.push("Contenu trop court pour une analyse ATS optimale");
            recommendations.push("Enrichissez le contenu de votre CV");
        }

        if (score >= 80) {
            recommendations.push("Votre CV est bien optimisé pour les ATS");
        }

        return {
            score: Math.max(score, 30),
            issues,
            recommendations
        };
    }

    performKeywordAnalysis(cvText, jobDescription) {
        const commonKeywords = ['expérience', 'compétences', 'formation', 'projet', 'équipe'];
        const techKeywords = ['javascript', 'python', 'java', 'react', 'sql'];
        
        const matchedKeywords = [];
        const missingKeywords = [];

        [...commonKeywords, ...techKeywords].forEach(keyword => {
            if (cvText.includes(keyword)) {
                matchedKeywords.push(keyword);
            } else {
                missingKeywords.push(keyword);
            }
        });

        const suggestions = [];
        if (jobDescription) {
            suggestions.push("Adaptez votre vocabulaire à l'offre d'emploi");
            suggestions.push("Utilisez les termes exacts mentionnés dans l'annonce");
        } else {
            suggestions.push("Ajoutez des mots-clés spécifiques à votre secteur");
            suggestions.push("Utilisez la terminologie professionnelle appropriée");
        }

        return {
            matchedKeywords: matchedKeywords.slice(0, 8),
            missingKeywords: missingKeywords.slice(0, 5),
            suggestions
        };
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