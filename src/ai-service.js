import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    constructor() {
        // Version simulée pour le développement avec analyse dynamique réelle
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
        console.log('Analyse du CV:', cvText.substring(0, 200) + '...');
        
        // Analyse approfondie du contenu réel
        const contentAnalysis = this.analyzeRealContent(cvText);
        const structureAnalysis = this.analyzeStructureDetailed(cvText);
        const keywordAnalysis = this.analyzeKeywordsDetailed(cvText, jobDescription);
        const skillsAnalysis = this.analyzeSkillsDetailed(cvText);
        const impactAnalysis = this.analyzeImpactDetailed(cvText);

        const overallScore = Math.round((
            structureAnalysis.score + 
            keywordAnalysis.score + 
            contentAnalysis.score + 
            skillsAnalysis.score + 
            impactAnalysis.score
        ) / 5);

        return {
            overallScore,
            details: [
                {
                    category: "Structure et Format",
                    score: structureAnalysis.score,
                    description: "Évaluation de l'organisation, lisibilité et compatibilité ATS",
                    issues: structureAnalysis.issues,
                    strengths: structureAnalysis.strengths
                },
                {
                    category: "Mots-clés et Optimisation ATS",
                    score: keywordAnalysis.score,
                    description: "Présence de mots-clés pertinents pour les systèmes ATS",
                    issues: keywordAnalysis.issues,
                    strengths: keywordAnalysis.strengths
                },
                {
                    category: "Contenu et Expérience",
                    score: contentAnalysis.score,
                    description: "Qualité et pertinence des informations professionnelles",
                    issues: contentAnalysis.issues,
                    strengths: contentAnalysis.strengths
                },
                {
                    category: "Compétences et Qualifications",
                    score: skillsAnalysis.score,
                    description: "Présentation des compétences techniques et soft skills",
                    issues: skillsAnalysis.issues,
                    strengths: skillsAnalysis.strengths
                },
                {
                    category: "Impact et Résultats",
                    score: impactAnalysis.score,
                    description: "Quantification des réalisations et impact professionnel",
                    issues: impactAnalysis.issues,
                    strengths: impactAnalysis.strengths
                }
            ],
            recommendations: this.generateDynamicRecommendations(overallScore, structureAnalysis, keywordAnalysis, contentAnalysis, skillsAnalysis, impactAnalysis, jobDescription),
            atsCompatibility: this.calculateATSCompatibility(cvText, structureAnalysis.score),
            keywordAnalysis: this.performKeywordAnalysis(cvText, jobDescription)
        };
    }

    analyzeRealContent(cvText) {
        const wordCount = cvText.split(/\s+/).filter(word => word.length > 0).length;
        const sentenceCount = cvText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
        
        // Détection de contenu spécifique
        const hasNumbers = /\d+/.test(cvText);
        const hasPercentages = /%|\bpourcent/.test(cvText);
        const hasActionVerbs = /(géré|développé|créé|dirigé|organisé|amélioré|optimisé|réalisé|conçu|mis en place|coordonné|supervisé|formé|analysé|planifié)/i.test(cvText);
        const hasQuantifiedResults = /(\d+%|\d+\s*(millions?|milliers?|k€|€|ans?|mois|personnes?|clients?|projets?))/i.test(cvText);
        
        let score = 30;
        const issues = [];
        const strengths = [];

        // Évaluation de la longueur
        if (wordCount < 150) {
            score -= 20;
            issues.push("CV trop court (moins de 150 mots)");
        } else if (wordCount < 300) {
            score -= 10;
            issues.push("Contenu insuffisant pour un CV complet");
        } else if (wordCount > 300 && wordCount < 800) {
            score += 20;
            strengths.push("Longueur appropriée pour un CV");
        } else if (wordCount > 1200) {
            score -= 15;
            issues.push("CV trop long, risque de perdre l'attention du recruteur");
        }

        // Évaluation de la structure des phrases
        if (avgWordsPerSentence > 25) {
            score -= 10;
            issues.push("Phrases trop longues, difficiles à lire");
        } else if (avgWordsPerSentence < 8) {
            score -= 5;
            issues.push("Phrases trop courtes, manque de détails");
        } else {
            score += 10;
            strengths.push("Structure de phrases équilibrée");
        }

        // Évaluation du contenu quantifié
        if (hasQuantifiedResults) {
            score += 25;
            strengths.push("Résultats quantifiés présents");
        } else if (hasNumbers) {
            score += 10;
            strengths.push("Quelques données chiffrées");
        } else {
            score -= 15;
            issues.push("Manque de quantification des résultats");
        }

        // Évaluation des verbes d'action
        if (hasActionVerbs) {
            score += 15;
            strengths.push("Bon usage de verbes d'action");
        } else {
            score -= 10;
            issues.push("Manque de verbes d'action dynamiques");
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            issues,
            strengths,
            wordCount,
            hasQuantifiedResults,
            hasActionVerbs
        };
    }

    analyzeStructureDetailed(cvText) {
        let score = 40;
        const issues = [];
        const strengths = [];

        // Détection des sections essentielles
        const sections = {
            contact: /(@|email|téléphone|phone|tel|contact)/i.test(cvText),
            experience: /(expérience|experience|poste|emploi|travail|fonction|career)/i.test(cvText),
            education: /(formation|education|diplôme|université|école|étude|degree)/i.test(cvText),
            skills: /(compétence|skill|maîtrise|connaissance|expertise)/i.test(cvText),
            summary: /(résumé|profil|objectif|summary|profile)/i.test(cvText)
        };

        // Vérification des informations de contact
        const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i.test(cvText);
        const hasPhone = /(\+33|0[1-9])[\s.-]?(\d{2}[\s.-]?){4}|\b\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/.test(cvText);

        // Évaluation des sections
        Object.entries(sections).forEach(([section, present]) => {
            if (present) {
                score += 8;
                strengths.push(`Section ${section} présente`);
            } else {
                issues.push(`Section ${section} manquante ou peu claire`);
            }
        });

        // Évaluation des contacts
        if (hasEmail) {
            score += 10;
            strengths.push("Adresse email présente");
        } else {
            score -= 15;
            issues.push("Adresse email manquante");
        }

        if (hasPhone) {
            score += 10;
            strengths.push("Numéro de téléphone présent");
        } else {
            score -= 10;
            issues.push("Numéro de téléphone manquant");
        }

        // Détection de problèmes de format
        const hasSpecialChars = /[^\w\s@.-]/g.test(cvText);
        if (hasSpecialChars) {
            score -= 5;
            issues.push("Caractères spéciaux détectés (peuvent poser problème aux ATS)");
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            issues,
            strengths,
            sections
        };
    }

    analyzeKeywordsDetailed(cvText, jobDescription) {
        let score = 30;
        const issues = [];
        const strengths = [];

        // Mots-clés techniques courants
        const techKeywords = [
            'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
            'sql', 'mongodb', 'mysql', 'postgresql', 'aws', 'azure', 'docker',
            'kubernetes', 'git', 'github', 'agile', 'scrum', 'devops', 'ci/cd',
            'api', 'rest', 'graphql', 'html', 'css', 'typescript', 'php',
            'c++', 'c#', '.net', 'spring', 'django', 'flask', 'laravel'
        ];

        // Mots-clés professionnels généraux
        const professionalKeywords = [
            'gestion', 'management', 'équipe', 'projet', 'leadership', 'communication',
            'analyse', 'stratégie', 'développement', 'innovation', 'amélioration',
            'optimisation', 'performance', 'résultats', 'objectifs', 'budget',
            'planification', 'coordination', 'supervision', 'formation', 'conseil'
        ];

        // Comptage des mots-clés techniques
        const foundTechKeywords = techKeywords.filter(keyword => 
            new RegExp(`\\b${keyword}\\b`, 'i').test(cvText)
        );

        // Comptage des mots-clés professionnels
        const foundProfKeywords = professionalKeywords.filter(keyword => 
            new RegExp(`\\b${keyword}\\b`, 'i').test(cvText)
        );

        // Évaluation des mots-clés techniques
        if (foundTechKeywords.length >= 8) {
            score += 25;
            strengths.push(`Excellente diversité technique (${foundTechKeywords.length} compétences)`);
        } else if (foundTechKeywords.length >= 5) {
            score += 15;
            strengths.push(`Bonne base technique (${foundTechKeywords.length} compétences)`);
        } else if (foundTechKeywords.length >= 2) {
            score += 5;
            strengths.push(`Quelques compétences techniques (${foundTechKeywords.length})`);
        } else {
            score -= 10;
            issues.push("Très peu de compétences techniques mentionnées");
        }

        // Évaluation des mots-clés professionnels
        if (foundProfKeywords.length >= 6) {
            score += 20;
            strengths.push(`Bon vocabulaire professionnel (${foundProfKeywords.length} termes)`);
        } else if (foundProfKeywords.length >= 3) {
            score += 10;
            strengths.push(`Vocabulaire professionnel correct (${foundProfKeywords.length} termes)`);
        } else {
            score -= 10;
            issues.push("Vocabulaire professionnel limité");
        }

        // Analyse spécifique à la description de poste
        if (jobDescription && jobDescription.length > 50) {
            const jobWords = jobDescription.split(/\s+/)
                .filter(word => word.length > 4)
                .map(word => word.toLowerCase())
                .filter((word, index, arr) => arr.indexOf(word) === index)
                .slice(0, 20);

            const matchingWords = jobWords.filter(word => 
                cvText.toLowerCase().includes(word)
            );

            const matchPercentage = (matchingWords.length / jobWords.length) * 100;

            if (matchPercentage >= 60) {
                score += 20;
                strengths.push(`Excellente correspondance avec l'offre (${Math.round(matchPercentage)}%)`);
            } else if (matchPercentage >= 40) {
                score += 10;
                strengths.push(`Bonne correspondance avec l'offre (${Math.round(matchPercentage)}%)`);
            } else if (matchPercentage >= 20) {
                score += 5;
                strengths.push(`Correspondance partielle avec l'offre (${Math.round(matchPercentage)}%)`);
            } else {
                score -= 15;
                issues.push(`Faible correspondance avec l'offre (${Math.round(matchPercentage)}%)`);
            }
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            issues,
            strengths,
            foundTechKeywords,
            foundProfKeywords
        };
    }

    analyzeSkillsDetailed(cvText) {
        let score = 25;
        const issues = [];
        const strengths = [];

        // Détection de sections compétences
        const hasSkillsSection = /(compétence|skill|expertise|maîtrise|connaissance)/i.test(cvText);
        
        // Soft skills courants
        const softSkills = [
            'leadership', 'communication', 'travail en équipe', 'autonomie',
            'créativité', 'organisation', 'rigueur', 'adaptabilité', 'initiative',
            'problem solving', 'analytical', 'teamwork', 'creativity', 'flexibility'
        ];

        // Niveaux de compétence
        const skillLevels = /(débutant|intermédiaire|avancé|expert|maîtrise|courant|bilingue|natif|beginner|intermediate|advanced|fluent)/i.test(cvText);

        const foundSoftSkills = softSkills.filter(skill => 
            new RegExp(`\\b${skill}\\b`, 'i').test(cvText)
        );

        if (hasSkillsSection) {
            score += 20;
            strengths.push("Section compétences identifiée");
        } else {
            score -= 15;
            issues.push("Aucune section compétences claire");
        }

        if (foundSoftSkills.length >= 4) {
            score += 20;
            strengths.push(`Bonnes soft skills (${foundSoftSkills.length} identifiées)`);
        } else if (foundSoftSkills.length >= 2) {
            score += 10;
            strengths.push(`Quelques soft skills (${foundSoftSkills.length} identifiées)`);
        } else {
            score -= 10;
            issues.push("Soft skills insuffisamment détaillées");
        }

        if (skillLevels) {
            score += 15;
            strengths.push("Niveaux de compétence précisés");
        } else {
            score -= 5;
            issues.push("Niveaux de compétence non précisés");
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            issues,
            strengths,
            foundSoftSkills
        };
    }

    analyzeImpactDetailed(cvText) {
        let score = 20;
        const issues = [];
        const strengths = [];

        // Détection de résultats quantifiés
        const quantifiedResults = cvText.match(/(\d+%|\d+\s*(millions?|milliers?|k€|€|ans?|mois|personnes?|clients?|projets?|heures?))/gi) || [];
        
        // Verbes d'impact
        const impactVerbs = [
            'augmenté', 'réduit', 'amélioré', 'optimisé', 'développé', 'créé',
            'dirigé', 'supervisé', 'coordonné', 'géré', 'réalisé', 'atteint',
            'dépassé', 'économisé', 'généré', 'lancé', 'mis en place'
        ];

        const foundImpactVerbs = impactVerbs.filter(verb => 
            new RegExp(`\\b${verb}\\b`, 'i').test(cvText)
        );

        // Mots indiquant des réalisations
        const achievementWords = [
            'succès', 'réussite', 'performance', 'résultat', 'objectif',
            'défi', 'innovation', 'amélioration', 'croissance', 'développement'
        ];

        const foundAchievements = achievementWords.filter(word => 
            new RegExp(`\\b${word}\\b`, 'i').test(cvText)
        );

        // Évaluation des résultats quantifiés
        if (quantifiedResults.length >= 5) {
            score += 30;
            strengths.push(`Excellente quantification (${quantifiedResults.length} résultats chiffrés)`);
        } else if (quantifiedResults.length >= 3) {
            score += 20;
            strengths.push(`Bonne quantification (${quantifiedResults.length} résultats chiffrés)`);
        } else if (quantifiedResults.length >= 1) {
            score += 10;
            strengths.push(`Quelques résultats quantifiés (${quantifiedResults.length})`);
        } else {
            score -= 20;
            issues.push("Aucun résultat quantifié détecté");
        }

        // Évaluation des verbes d'impact
        if (foundImpactVerbs.length >= 6) {
            score += 25;
            strengths.push(`Excellent usage de verbes d'action (${foundImpactVerbs.length})`);
        } else if (foundImpactVerbs.length >= 3) {
            score += 15;
            strengths.push(`Bon usage de verbes d'action (${foundImpactVerbs.length})`);
        } else if (foundImpactVerbs.length >= 1) {
            score += 5;
            strengths.push(`Quelques verbes d'action (${foundImpactVerbs.length})`);
        } else {
            score -= 15;
            issues.push("Manque de verbes d'action impactants");
        }

        // Évaluation des mots de réalisation
        if (foundAchievements.length >= 3) {
            score += 15;
            strengths.push("Vocabulaire orienté résultats");
        } else {
            score -= 5;
            issues.push("Peu de mise en avant des réalisations");
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            issues,
            strengths,
            quantifiedResults: quantifiedResults.length,
            impactVerbs: foundImpactVerbs.length
        };
    }

    generateDynamicRecommendations(overallScore, structureAnalysis, keywordAnalysis, contentAnalysis, skillsAnalysis, impactAnalysis, jobDescription) {
        const recommendations = [];

        // Recommandations basées sur l'analyse de structure
        if (structureAnalysis.score < 70) {
            recommendations.push({
                priority: "high",
                title: "Améliorer la structure du CV",
                description: "Organisez votre CV avec des sections claires : Contact, Résumé, Expérience, Formation, Compétences. Assurez-vous que vos informations de contact sont complètes.",
                impact: "Meilleure lisibilité et compatibilité ATS (+15-20 points)"
            });
        }

        // Recommandations basées sur l'analyse des mots-clés
        if (keywordAnalysis.score < 60) {
            if (jobDescription) {
                recommendations.push({
                    priority: "high",
                    title: "Optimiser les mots-clés pour l'offre",
                    description: "Intégrez plus de mots-clés spécifiques de la description de poste. Adaptez votre vocabulaire technique et professionnel.",
                    impact: "Augmentation significative des chances de passage des filtres ATS (+20-25 points)"
                });
            } else {
                recommendations.push({
                    priority: "high",
                    title: "Enrichir le vocabulaire technique",
                    description: "Ajoutez plus de compétences techniques et de termes professionnels pertinents à votre secteur.",
                    impact: "Meilleur matching avec les offres d'emploi (+15-20 points)"
                });
            }
        }

        // Recommandations basées sur l'analyse du contenu
        if (contentAnalysis.score < 60) {
            if (contentAnalysis.wordCount < 300) {
                recommendations.push({
                    priority: "medium",
                    title: "Enrichir le contenu",
                    description: "Développez davantage vos descriptions d'expérience. Ajoutez plus de détails sur vos responsabilités et réalisations.",
                    impact: "CV plus informatif et convaincant (+10-15 points)"
                });
            }
            
            if (!contentAnalysis.hasQuantifiedResults) {
                recommendations.push({
                    priority: "high",
                    title: "Quantifier vos réalisations",
                    description: "Ajoutez des chiffres, pourcentages et résultats concrets à vos expériences (ex: 'Augmenté les ventes de 25%', 'Géré une équipe de 8 personnes').",
                    impact: "Démonstration claire de votre valeur ajoutée (+20-25 points)"
                });
            }
        }

        // Recommandations basées sur l'analyse des compétences
        if (skillsAnalysis.score < 60) {
            recommendations.push({
                priority: "medium",
                title: "Détailler les compétences",
                description: "Créez une section compétences complète avec vos compétences techniques et soft skills. Précisez votre niveau de maîtrise.",
                impact: "Meilleur matching avec les exigences des postes (+10-15 points)"
            });
        }

        // Recommandations basées sur l'analyse d'impact
        if (impactAnalysis.score < 60) {
            if (impactAnalysis.quantifiedResults === 0) {
                recommendations.push({
                    priority: "high",
                    title: "Ajouter des résultats chiffrés",
                    description: "Quantifiez vos réalisations avec des chiffres précis : budgets gérés, pourcentages d'amélioration, nombre de projets, etc.",
                    impact: "Impact professionnel mieux démontré (+15-20 points)"
                });
            }
            
            if (impactAnalysis.impactVerbs < 3) {
                recommendations.push({
                    priority: "medium",
                    title: "Utiliser des verbes d'action",
                    description: "Commencez vos descriptions par des verbes d'action impactants : 'Développé', 'Optimisé', 'Dirigé', 'Amélioré', etc.",
                    impact: "CV plus dynamique et professionnel (+10-15 points)"
                });
            }
        }

        // Recommandation générale pour les scores faibles
        if (overallScore < 70) {
            recommendations.push({
                priority: "high",
                title: "Format ATS-friendly",
                description: "Utilisez un format simple et lisible. Évitez les tableaux complexes, les images dans le texte et les polices fantaisistes.",
                impact: "Garantie de lecture correcte par tous les systèmes ATS (+10-15 points)"
            });
        }

        return recommendations;
    }

    calculateATSCompatibility(cvText, structureScore) {
        let score = Math.max(structureScore - 5, 50);
        const issues = [];
        const recommendations = [];

        // Détection de problèmes ATS
        if (/tableau|table|image|photo|graphique/i.test(cvText)) {
            score -= 15;
            issues.push("Présence possible d'éléments non compatibles ATS (tableaux, images)");
            recommendations.push("Évitez les tableaux complexes et les images dans le CV");
        }

        if (cvText.length < 800) {
            score -= 10;
            issues.push("Contenu trop court pour une analyse ATS optimale");
            recommendations.push("Enrichissez le contenu de votre CV avec plus de détails");
        }

        if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i.test(cvText)) {
            score -= 20;
            issues.push("Email manquant ou mal formaté");
            recommendations.push("Ajoutez une adresse email valide");
        }

        if (score >= 85) {
            recommendations.push("Votre CV est excellemment optimisé pour les ATS");
        } else if (score >= 70) {
            recommendations.push("Votre CV est bien optimisé pour les ATS avec quelques améliorations possibles");
        }

        return {
            score: Math.max(score, 30),
            issues,
            recommendations
        };
    }

    performKeywordAnalysis(cvText, jobDescription) {
        // Mots-clés techniques détectés
        const techKeywords = [
            'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
            'sql', 'mongodb', 'aws', 'docker', 'git', 'agile', 'scrum'
        ];
        
        // Mots-clés professionnels détectés
        const profKeywords = [
            'gestion', 'management', 'équipe', 'projet', 'leadership',
            'communication', 'analyse', 'développement', 'amélioration'
        ];
        
        const matchedKeywords = [];
        const missingKeywords = [];

        [...techKeywords, ...profKeywords].forEach(keyword => {
            if (new RegExp(`\\b${keyword}\\b`, 'i').test(cvText)) {
                matchedKeywords.push(keyword);
            } else {
                missingKeywords.push(keyword);
            }
        });

        const suggestions = [];
        if (jobDescription && jobDescription.length > 50) {
            suggestions.push("Intégrez plus de mots-clés spécifiques de la description de poste");
            suggestions.push("Utilisez les termes exacts mentionnés dans l'annonce");
            suggestions.push("Adaptez votre vocabulaire au secteur d'activité visé");
        } else {
            suggestions.push("Ajoutez des mots-clés spécifiques à votre secteur");
            suggestions.push("Utilisez la terminologie professionnelle appropriée");
            suggestions.push("Incluez des compétences techniques recherchées");
        }

        return {
            matchedKeywords: matchedKeywords.slice(0, 10),
            missingKeywords: missingKeywords.slice(0, 8),
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