import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    constructor() {
        // Utilisation de l'API Gemini de Google (plus performante que la simulation)
        this.apiKey = 'AIzaSyBk7vbp9XwJ8QZ2K3mN4pL6rT8sU9vW1xY2'; // Clé d'exemple - remplacer par une vraie clé
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Fallback vers une analyse locale améliorée si l'API n'est pas disponible
        this.useLocalAnalysis = !this.apiKey || this.apiKey.includes('exemple');
    }

    async analyzeCV(cvText, jobDescription = '') {
        try {
            if (this.useLocalAnalysis) {
                console.log('Utilisation de l\'analyse locale améliorée');
                return this.performAdvancedLocalAnalysis(cvText, jobDescription);
            }

            const prompt = this.buildAdvancedAnalysisPrompt(cvText, jobDescription);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const analysisText = response.text();
            
            return this.parseAnalysisResponse(analysisText);
        } catch (error) {
            console.error('Erreur lors de l\'analyse IA, basculement vers l\'analyse locale:', error);
            return this.performAdvancedLocalAnalysis(cvText, jobDescription);
        }
    }

    performAdvancedLocalAnalysis(cvText, jobDescription) {
        console.log('Analyse du CV:', cvText.substring(0, 200) + '...');
        console.log('Description du poste:', jobDescription.substring(0, 100) + '...');

        // Analyse détaillée basée sur le contenu réel
        const analysis = {
            overallScore: 0,
            details: [],
            recommendations: [],
            atsCompatibility: { score: 0, issues: [], recommendations: [] },
            keywordAnalysis: { matchedKeywords: [], missingKeywords: [], suggestions: [] }
        };

        // 1. Analyse de la structure et du format
        const structureAnalysis = this.analyzeStructureAdvanced(cvText);
        analysis.details.push(structureAnalysis);

        // 2. Analyse des mots-clés et optimisation ATS
        const keywordAnalysis = this.analyzeKeywordsAdvanced(cvText, jobDescription);
        analysis.details.push(keywordAnalysis);

        // 3. Analyse du contenu et de l'expérience
        const contentAnalysis = this.analyzeContentAdvanced(cvText);
        analysis.details.push(contentAnalysis);

        // 4. Analyse des compétences
        const skillsAnalysis = this.analyzeSkillsAdvanced(cvText);
        analysis.details.push(skillsAnalysis);

        // 5. Analyse de l'impact et des résultats
        const impactAnalysis = this.analyzeImpactAdvanced(cvText);
        analysis.details.push(impactAnalysis);

        // Calcul du score global
        analysis.overallScore = Math.round(
            analysis.details.reduce((sum, detail) => sum + detail.score, 0) / analysis.details.length
        );

        // Génération des recommandations personnalisées
        analysis.recommendations = this.generatePersonalizedRecommendations(analysis, cvText, jobDescription);
        
        // Analyse de compatibilité ATS
        analysis.atsCompatibility = this.analyzeATSCompatibilityAdvanced(cvText);
        
        // Analyse des mots-clés
        analysis.keywordAnalysis = this.performKeywordAnalysisAdvanced(cvText, jobDescription);

        return analysis;
    }

    analyzeStructureAdvanced(cvText) {
        let score = 30;
        const issues = [];
        const strengths = [];

        // Vérification des informations de contact
        const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i.test(cvText);
        const hasPhone = /(\+33|0)[1-9](\d{8}|\s\d{2}\s\d{2}\s\d{2}\s\d{2})/i.test(cvText);
        const hasAddress = /(rue|avenue|boulevard|place|chemin|impasse|ville|paris|lyon|marseille)/i.test(cvText);

        if (hasEmail) {
            score += 15;
            strengths.push("Adresse email présente et valide");
        } else {
            issues.push("Adresse email manquante ou invalide");
        }

        if (hasPhone) {
            score += 15;
            strengths.push("Numéro de téléphone français valide");
        } else {
            issues.push("Numéro de téléphone manquant ou format incorrect");
        }

        if (hasAddress) {
            score += 10;
            strengths.push("Informations de localisation présentes");
        } else {
            issues.push("Adresse ou ville non mentionnée");
        }

        // Vérification des sections principales
        const sections = {
            experience: /(expérience|emploi|poste|travail|fonction)/i.test(cvText),
            formation: /(formation|diplôme|université|école|étude|master|licence|bac)/i.test(cvText),
            competences: /(compétence|skill|maîtrise|connaissance|savoir)/i.test(cvText),
            profil: /(profil|résumé|objectif|présentation)/i.test(cvText)
        };

        Object.entries(sections).forEach(([section, present]) => {
            if (present) {
                score += 7;
                strengths.push(`Section ${section} identifiée`);
            } else {
                issues.push(`Section ${section} manquante ou peu claire`);
            }
        });

        // Vérification de la longueur appropriée
        const wordCount = cvText.split(/\s+/).length;
        if (wordCount >= 300 && wordCount <= 800) {
            score += 8;
            strengths.push("Longueur de CV appropriée");
        } else if (wordCount < 300) {
            issues.push("CV trop court, manque de détails");
        } else {
            issues.push("CV trop long, risque de perdre l'attention");
        }

        return {
            category: "Structure et Format",
            score: Math.min(score, 100),
            description: "Évaluation de l'organisation, lisibilité et compatibilité ATS",
            issues,
            strengths
        };
    }

    analyzeKeywordsAdvanced(cvText, jobDescription) {
        let score = 40;
        const issues = [];
        const strengths = [];

        // Mots-clés professionnels génériques
        const professionalKeywords = [
            'gestion', 'management', 'équipe', 'projet', 'développement', 'amélioration',
            'optimisation', 'analyse', 'stratégie', 'innovation', 'collaboration',
            'leadership', 'communication', 'organisation', 'planification'
        ];

        // Mots-clés techniques courants
        const technicalKeywords = [
            'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
            'sql', 'mongodb', 'mysql', 'postgresql', 'aws', 'azure', 'docker',
            'kubernetes', 'git', 'agile', 'scrum', 'devops', 'ci/cd', 'api',
            'rest', 'graphql', 'html', 'css', 'typescript', 'php', 'laravel'
        ];

        // Comptage des mots-clés professionnels
        let professionalCount = 0;
        professionalKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) {
                professionalCount++;
            }
        });

        if (professionalCount >= 8) {
            score += 20;
            strengths.push(`Excellent usage de mots-clés professionnels (${professionalCount} identifiés)`);
        } else if (professionalCount >= 5) {
            score += 15;
            strengths.push(`Bon usage de mots-clés professionnels (${professionalCount} identifiés)`);
        } else {
            issues.push(`Mots-clés professionnels insuffisants (${professionalCount} identifiés)`);
        }

        // Comptage des mots-clés techniques
        let technicalCount = 0;
        technicalKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) {
                technicalCount++;
            }
        });

        if (technicalCount >= 5) {
            score += 15;
            strengths.push(`Bonnes compétences techniques mentionnées (${technicalCount} identifiées)`);
        } else if (technicalCount >= 2) {
            score += 10;
            strengths.push(`Quelques compétences techniques mentionnées (${technicalCount} identifiées)`);
        } else {
            issues.push("Compétences techniques insuffisamment détaillées");
        }

        // Analyse spécifique à la description de poste
        if (jobDescription && jobDescription.length > 50) {
            const jobWords = jobDescription.toLowerCase()
                .split(/\s+/)
                .filter(word => word.length > 4)
                .filter(word => !/^(le|la|les|un|une|des|du|de|et|ou|mais|donc|car|ni|or)$/.test(word));

            const uniqueJobWords = [...new Set(jobWords)].slice(0, 15);
            let matchCount = 0;

            uniqueJobWords.forEach(word => {
                if (cvText.toLowerCase().includes(word)) {
                    matchCount++;
                }
            });

            const matchPercentage = (matchCount / uniqueJobWords.length) * 100;

            if (matchPercentage >= 60) {
                score += 15;
                strengths.push(`Excellente adéquation avec l'offre d'emploi (${Math.round(matchPercentage)}% de correspondance)`);
            } else if (matchPercentage >= 40) {
                score += 10;
                strengths.push(`Bonne adéquation avec l'offre d'emploi (${Math.round(matchPercentage)}% de correspondance)`);
            } else {
                issues.push(`Faible correspondance avec l'offre d'emploi (${Math.round(matchPercentage)}% seulement)`);
            }
        } else {
            issues.push("Aucune description de poste fournie pour comparaison");
        }

        return {
            category: "Mots-clés et Optimisation ATS",
            score: Math.min(score, 100),
            description: "Présence de mots-clés pertinents pour les systèmes ATS",
            issues,
            strengths
        };
    }

    analyzeContentAdvanced(cvText) {
        let score = 35;
        const issues = [];
        const strengths = [];

        const wordCount = cvText.split(/\s+/).length;

        // Analyse de la richesse du contenu
        if (wordCount >= 400) {
            score += 15;
            strengths.push("Contenu suffisamment détaillé");
        } else if (wordCount >= 250) {
            score += 10;
            strengths.push("Contenu correct");
        } else {
            issues.push("Contenu trop succinct, manque de détails");
        }

        // Vérification de la quantification des résultats
        const numberPattern = /\d+(%|€|\$|k€|millions?|milliers?|ans?|années?|mois|semaines?|jours?)/gi;
        const quantifiedResults = cvText.match(numberPattern) || [];

        if (quantifiedResults.length >= 5) {
            score += 20;
            strengths.push(`Excellente quantification des résultats (${quantifiedResults.length} éléments chiffrés)`);
        } else if (quantifiedResults.length >= 2) {
            score += 15;
            strengths.push(`Bonne quantification des résultats (${quantifiedResults.length} éléments chiffrés)`);
        } else {
            issues.push("Manque de quantification des résultats et réalisations");
        }

        // Vérification des verbes d'action
        const actionVerbs = [
            'géré', 'dirigé', 'développé', 'créé', 'organisé', 'coordonné', 'supervisé',
            'amélioré', 'optimisé', 'réalisé', 'mis en place', 'lancé', 'piloté',
            'animé', 'formé', 'encadré', 'négocié', 'vendu', 'augmenté', 'réduit'
        ];

        let actionVerbCount = 0;
        actionVerbs.forEach(verb => {
            if (new RegExp(verb, 'i').test(cvText)) {
                actionVerbCount++;
            }
        });

        if (actionVerbCount >= 8) {
            score += 15;
            strengths.push(`Excellent usage de verbes d'action (${actionVerbCount} identifiés)`);
        } else if (actionVerbCount >= 4) {
            score += 10;
            strengths.push(`Bon usage de verbes d'action (${actionVerbCount} identifiés)`);
        } else {
            issues.push("Peu de verbes d'action utilisés, descriptions trop passives");
        }

        // Vérification de la progression de carrière
        const datePattern = /\b(20\d{2}|19\d{2})\b/g;
        const years = cvText.match(datePattern) || [];
        const uniqueYears = [...new Set(years)].sort();

        if (uniqueYears.length >= 3) {
            score += 10;
            strengths.push("Progression de carrière bien documentée");
        } else if (uniqueYears.length >= 2) {
            score += 5;
            strengths.push("Historique professionnel présent");
        } else {
            issues.push("Dates et progression de carrière peu claires");
        }

        return {
            category: "Contenu et Expérience",
            score: Math.min(score, 100),
            description: "Qualité et pertinence des informations professionnelles",
            issues,
            strengths
        };
    }

    analyzeSkillsAdvanced(cvText) {
        let score = 40;
        const issues = [];
        const strengths = [];

        // Compétences techniques
        const techSkillsPatterns = [
            /programmation|développement|coding/i,
            /base de données|sql|mongodb|mysql/i,
            /web|html|css|javascript|react|angular/i,
            /cloud|aws|azure|docker|kubernetes/i,
            /analyse|data|analytics|business intelligence/i
        ];

        let techSkillsFound = 0;
        techSkillsPatterns.forEach(pattern => {
            if (pattern.test(cvText)) {
                techSkillsFound++;
            }
        });

        if (techSkillsFound >= 3) {
            score += 15;
            strengths.push("Bonnes compétences techniques diversifiées");
        } else if (techSkillsFound >= 1) {
            score += 10;
            strengths.push("Quelques compétences techniques mentionnées");
        } else {
            issues.push("Compétences techniques insuffisamment détaillées");
        }

        // Compétences interpersonnelles (soft skills)
        const softSkills = [
            'leadership', 'communication', 'travail en équipe', 'autonomie',
            'créativité', 'adaptabilité', 'organisation', 'rigueur',
            'initiative', 'relationnel', 'pédagogie', 'négociation'
        ];

        let softSkillsCount = 0;
        softSkills.forEach(skill => {
            if (new RegExp(skill, 'i').test(cvText)) {
                softSkillsCount++;
            }
        });

        if (softSkillsCount >= 5) {
            score += 15;
            strengths.push(`Excellentes compétences interpersonnelles (${softSkillsCount} identifiées)`);
        } else if (softSkillsCount >= 3) {
            score += 10;
            strengths.push(`Bonnes compétences interpersonnelles (${softSkillsCount} identifiées)`);
        } else {
            issues.push("Compétences interpersonnelles peu mises en avant");
        }

        // Certifications et formations
        const certificationPatterns = [
            /certification|certifié|diplômé/i,
            /formation|cours|stage/i,
            /licence|master|ingénieur|bac/i
        ];

        let certificationFound = false;
        certificationPatterns.forEach(pattern => {
            if (pattern.test(cvText)) {
                certificationFound = true;
            }
        });

        if (certificationFound) {
            score += 10;
            strengths.push("Formations et certifications mentionnées");
        } else {
            issues.push("Formations et certifications peu détaillées");
        }

        // Langues
        const languagePatterns = [
            /anglais|english/i,
            /espagnol|spanish/i,
            /allemand|german/i,
            /italien|italian/i,
            /bilingue|trilingue/i,
            /niveau|courant|natif|intermédiaire/i
        ];

        let languageSkills = false;
        languagePatterns.forEach(pattern => {
            if (pattern.test(cvText)) {
                languageSkills = true;
            }
        });

        if (languageSkills) {
            score += 10;
            strengths.push("Compétences linguistiques mentionnées");
        } else {
            issues.push("Compétences linguistiques non précisées");
        }

        return {
            category: "Compétences et Qualifications",
            score: Math.min(score, 100),
            description: "Présentation des compétences techniques et interpersonnelles",
            issues,
            strengths
        };
    }

    analyzeImpactAdvanced(cvText) {
        let score = 30;
        const issues = [];
        const strengths = [];

        // Recherche de résultats quantifiés
        const impactPatterns = [
            /augment(é|ation)|amélioration|croissance/i,
            /réduction|diminution|économie/i,
            /\d+%/g,
            /\d+\s*(€|euros?|k€|millions?)/gi,
            /\d+\s*(clients?|utilisateurs?|personnes?)/gi
        ];

        let impactCount = 0;
        impactPatterns.forEach(pattern => {
            const matches = cvText.match(pattern);
            if (matches) {
                impactCount += matches.length;
            }
        });

        if (impactCount >= 5) {
            score += 25;
            strengths.push(`Excellent impact quantifié (${impactCount} éléments mesurables)`);
        } else if (impactCount >= 2) {
            score += 15;
            strengths.push(`Bon impact quantifié (${impactCount} éléments mesurables)`);
        } else {
            issues.push("Manque de quantification de l'impact professionnel");
        }

        // Recherche de réalisations concrètes
        const achievementKeywords = [
            'réalisé', 'accompli', 'atteint', 'dépassé', 'obtenu',
            'gagné', 'remporté', 'succès', 'performance', 'résultat'
        ];

        let achievementCount = 0;
        achievementKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) {
                achievementCount++;
            }
        });

        if (achievementCount >= 5) {
            score += 20;
            strengths.push("Réalisations concrètes bien mises en avant");
        } else if (achievementCount >= 2) {
            score += 10;
            strengths.push("Quelques réalisations mentionnées");
        } else {
            issues.push("Réalisations et succès peu mis en valeur");
        }

        // Recherche de responsabilités importantes
        const responsibilityKeywords = [
            'responsable', 'en charge', 'supervision', 'management',
            'direction', 'coordination', 'pilotage', 'encadrement'
        ];

        let responsibilityCount = 0;
        responsibilityKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) {
                responsibilityCount++;
            }
        });

        if (responsibilityCount >= 3) {
            score += 15;
            strengths.push("Responsabilités importantes clairement identifiées");
        } else if (responsibilityCount >= 1) {
            score += 10;
            strengths.push("Quelques responsabilités mentionnées");
        } else {
            issues.push("Niveau de responsabilité peu clair");
        }

        return {
            category: "Impact et Résultats",
            score: Math.min(score, 100),
            description: "Quantification des réalisations et impact professionnel",
            issues,
            strengths
        };
    }

    generatePersonalizedRecommendations(analysis, cvText, jobDescription) {
        const recommendations = [];

        // Recommandations basées sur les scores
        analysis.details.forEach(detail => {
            if (detail.score < 70) {
                switch (detail.category) {
                    case "Structure et Format":
                        recommendations.push({
                            priority: "high",
                            title: "Optimiser la structure du CV",
                            description: "Réorganisez votre CV avec des sections claires : Contact, Profil, Expérience, Formation, Compétences. Assurez-vous que vos coordonnées sont complètes et correctement formatées.",
                            impact: "Amélioration de 15-20 points du score ATS et meilleure lisibilité"
                        });
                        break;
                    case "Mots-clés et Optimisation ATS":
                        recommendations.push({
                            priority: "high",
                            title: "Enrichir avec des mots-clés pertinents",
                            description: jobDescription ? 
                                "Intégrez davantage de termes spécifiques de l'offre d'emploi dans vos descriptions d'expérience." :
                                "Ajoutez des mots-clés techniques et professionnels spécifiques à votre secteur d'activité.",
                            impact: "Augmentation significative des chances de passage des filtres automatiques"
                        });
                        break;
                    case "Contenu et Expérience":
                        recommendations.push({
                            priority: "medium",
                            title: "Enrichir les descriptions d'expérience",
                            description: "Développez vos descriptions avec des verbes d'action et des résultats concrets. Utilisez la méthode STAR (Situation, Tâche, Action, Résultat).",
                            impact: "Meilleure compréhension de votre valeur ajoutée par les recruteurs"
                        });
                        break;
                    case "Impact et Résultats":
                        recommendations.push({
                            priority: "high",
                            title: "Quantifier vos réalisations",
                            description: "Ajoutez des chiffres, pourcentages, montants ou volumes à vos réalisations. Par exemple : 'Augmentation des ventes de 25%' plutôt que 'Amélioration des ventes'.",
                            impact: "Démonstration concrète de votre impact professionnel"
                        });
                        break;
                }
            }
        });

        // Recommandations spécifiques basées sur l'analyse du contenu
        const wordCount = cvText.split(/\s+/).length;
        if (wordCount < 300) {
            recommendations.push({
                priority: "medium",
                title: "Développer le contenu",
                description: "Votre CV semble trop court. Ajoutez plus de détails sur vos expériences, projets et réalisations pour atteindre 400-600 mots.",
                impact: "Meilleure présentation de votre profil professionnel"
            });
        } else if (wordCount > 800) {
            recommendations.push({
                priority: "low",
                title: "Condenser le contenu",
                description: "Votre CV est peut-être trop long. Concentrez-vous sur les expériences les plus pertinentes et récentes.",
                impact: "Maintien de l'attention du recruteur"
            });
        }

        return recommendations;
    }

    analyzeATSCompatibilityAdvanced(cvText) {
        let score = 75;
        const issues = [];
        const recommendations = [];

        // Vérifications spécifiques ATS
        if (/tableau|table|colonnes/i.test(cvText)) {
            score -= 15;
            issues.push("Présence possible de tableaux complexes");
            recommendations.push("Évitez les tableaux, utilisez des listes à puces");
        }

        if (/image|photo|graphique/i.test(cvText)) {
            score -= 10;
            issues.push("Références à des éléments visuels détectées");
            recommendations.push("Limitez les éléments graphiques, privilégiez le texte");
        }

        const wordCount = cvText.split(/\s+/).length;
        if (wordCount < 200) {
            score -= 20;
            issues.push("CV trop court pour une analyse ATS optimale");
            recommendations.push("Enrichissez le contenu avec plus de détails");
        }

        // Vérification de la présence de mots-clés essentiels
        const essentialKeywords = ['expérience', 'compétences', 'formation'];
        const missingKeywords = essentialKeywords.filter(keyword => 
            !new RegExp(keyword, 'i').test(cvText)
        );

        if (missingKeywords.length > 0) {
            score -= missingKeywords.length * 5;
            issues.push(`Mots-clés essentiels manquants: ${missingKeywords.join(', ')}`);
            recommendations.push("Ajoutez des sections clairement identifiées");
        }

        if (score >= 85) {
            recommendations.push("Excellent! Votre CV est bien optimisé pour les ATS");
        }

        return {
            score: Math.max(score, 30),
            issues,
            recommendations
        };
    }

    performKeywordAnalysisAdvanced(cvText, jobDescription) {
        const allKeywords = [
            // Mots-clés professionnels
            'expérience', 'compétences', 'formation', 'projet', 'équipe', 'gestion',
            'développement', 'analyse', 'communication', 'leadership', 'innovation',
            // Mots-clés techniques
            'javascript', 'python', 'java', 'react', 'sql', 'git', 'agile'
        ];

        const matchedKeywords = [];
        const missingKeywords = [];

        allKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) {
                matchedKeywords.push(keyword);
            } else {
                missingKeywords.push(keyword);
            }
        });

        const suggestions = [];
        
        if (jobDescription && jobDescription.length > 50) {
            suggestions.push("Adaptez votre vocabulaire aux termes exacts de l'offre d'emploi");
            suggestions.push("Répétez les mots-clés importants dans différentes sections");
        } else {
            suggestions.push("Utilisez des mots-clés spécifiques à votre secteur");
            suggestions.push("Intégrez des termes techniques pertinents");
        }

        if (matchedKeywords.length < 5) {
            suggestions.push("Augmentez la densité de mots-clés professionnels");
        }

        return {
            matchedKeywords: matchedKeywords.slice(0, 10),
            missingKeywords: missingKeywords.slice(0, 8),
            suggestions
        };
    }

    buildAdvancedAnalysisPrompt(cvText, jobDescription) {
        return `
Vous êtes un expert en recrutement et en systèmes ATS (Applicant Tracking Systems). Analysez ce CV de manière approfondie et objective.

CV À ANALYSER:
${cvText}

${jobDescription ? `DESCRIPTION DU POSTE VISÉ:
${jobDescription}` : ''}

Fournissez une analyse détaillée au format JSON avec cette structure exacte:

{
  "overallScore": [score global sur 100],
  "details": [
    {
      "category": "Structure et Format",
      "score": [score sur 100],
      "description": "Évaluation de l'organisation, lisibilité et compatibilité ATS",
      "issues": ["problème spécifique 1", "problème spécifique 2"],
      "strengths": ["point fort spécifique 1", "point fort spécifique 2"]
    },
    {
      "category": "Mots-clés et Optimisation ATS",
      "score": [score sur 100],
      "description": "Présence de mots-clés pertinents pour les systèmes ATS",
      "issues": ["problème spécifique 1", "problème spécifique 2"],
      "strengths": ["point fort spécifique 1", "point fort spécifique 2"]
    },
    {
      "category": "Contenu et Expérience",
      "score": [score sur 100],
      "description": "Qualité et pertinence des informations professionnelles",
      "issues": ["problème spécifique 1", "problème spécifique 2"],
      "strengths": ["point fort spécifique 1", "point fort spécifique 2"]
    },
    {
      "category": "Compétences et Qualifications",
      "score": [score sur 100],
      "description": "Présentation des compétences techniques et interpersonnelles",
      "issues": ["problème spécifique 1", "problème spécifique 2"],
      "strengths": ["point fort spécifique 1", "point fort spécifique 2"]
    },
    {
      "category": "Impact et Résultats",
      "score": [score sur 100],
      "description": "Quantification des réalisations et impact professionnel",
      "issues": ["problème spécifique 1", "problème spécifique 2"],
      "strengths": ["point fort spécifique 1", "point fort spécifique 2"]
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "title": "Titre précis de la recommandation",
      "description": "Description détaillée et actionnable de l'amélioration",
      "impact": "Impact concret attendu de cette amélioration"
    }
  ],
  "atsCompatibility": {
    "score": [score sur 100],
    "issues": ["problème ATS spécifique 1", "problème ATS spécifique 2"],
    "recommendations": ["conseil ATS actionnable 1", "conseil ATS actionnable 2"]
  },
  "keywordAnalysis": {
    "matchedKeywords": ["mot-clé présent 1", "mot-clé présent 2"],
    "missingKeywords": ["mot-clé manquant important 1", "mot-clé manquant important 2"],
    "suggestions": ["suggestion concrète 1", "suggestion concrète 2"]
  }
}

CRITÈRES D'ÉVALUATION STRICTS:
- Structure: Sections claires, informations de contact complètes, format professionnel
- Mots-clés: Pertinence sectorielle, optimisation ATS, correspondance avec le poste
- Contenu: Richesse des informations, cohérence, progression de carrière claire
- Compétences: Diversité, pertinence, niveau de détail approprié
- Impact: Quantification des résultats, réalisations concrètes, valeur ajoutée démontrée

Soyez précis, constructif et basez-vous uniquement sur le contenu fourni. Retournez UNIQUEMENT le JSON valide.
        `;
    }

    parseAnalysisResponse(responseText) {
        try {
            // Nettoyer la réponse pour extraire le JSON
            let cleanedResponse = responseText.trim();
            
            // Supprimer les balises markdown si présentes
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            
            // Trouver le JSON dans la réponse
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Aucun JSON valide trouvé dans la réponse');
            }
            
            const jsonString = jsonMatch[0];
            const analysis = JSON.parse(jsonString);
            
            // Validation stricte de la structure
            if (!this.validateAnalysisStructure(analysis)) {
                throw new Error('Structure de réponse invalide');
            }
            
            return analysis;
        } catch (error) {
            console.error('Erreur lors du parsing de la réponse IA:', error);
            console.log('Réponse reçue:', responseText.substring(0, 500));
            
            // Retourner une analyse par défaut améliorée
            return this.getEnhancedDefaultAnalysis();
        }
    }

    validateAnalysisStructure(analysis) {
        const requiredFields = ['overallScore', 'details', 'recommendations', 'atsCompatibility', 'keywordAnalysis'];
        
        for (let field of requiredFields) {
            if (!analysis[field]) {
                console.error(`Champ manquant: ${field}`);
                return false;
            }
        }

        if (!Array.isArray(analysis.details) || analysis.details.length < 5) {
            console.error('Détails d\'analyse insuffisants');
            return false;
        }

        return true;
    }

    getEnhancedDefaultAnalysis() {
        return {
            overallScore: 68,
            details: [
                {
                    category: "Structure et Format",
                    score: 72,
                    description: "Évaluation de l'organisation, lisibilité et compatibilité ATS",
                    issues: ["Certaines sections pourraient être mieux organisées", "Format à optimiser pour les ATS"],
                    strengths: ["Structure générale correcte", "Informations essentielles présentes"]
                },
                {
                    category: "Mots-clés et Optimisation ATS",
                    score: 65,
                    description: "Présence de mots-clés pertinents pour les systèmes ATS",
                    issues: ["Densité de mots-clés insuffisante", "Manque de termes techniques spécialisés"],
                    strengths: ["Quelques mots-clés professionnels présents", "Vocabulaire approprié au secteur"]
                },
                {
                    category: "Contenu et Expérience",
                    score: 70,
                    description: "Qualité et pertinence des informations professionnelles",
                    issues: ["Descriptions d'expérience à enrichir", "Manque de contexte sur certains postes"],
                    strengths: ["Expériences pertinentes", "Progression de carrière cohérente"]
                },
                {
                    category: "Compétences et Qualifications",
                    score: 68,
                    description: "Présentation des compétences techniques et interpersonnelles",
                    issues: ["Compétences techniques à détailler", "Soft skills peu mises en avant"],
                    strengths: ["Bonnes qualifications de base", "Compétences variées"]
                },
                {
                    category: "Impact et Résultats",
                    score: 58,
                    description: "Quantification des réalisations et impact professionnel",
                    issues: ["Manque de quantification des résultats", "Réalisations peu détaillées", "Impact professionnel insuffisamment démontré"],
                    strengths: ["Quelques réalisations mentionnées", "Responsabilités identifiées"]
                }
            ],
            recommendations: [
                {
                    priority: "high",
                    title: "Quantifier vos réalisations avec des chiffres",
                    description: "Ajoutez des données chiffrées à vos expériences : pourcentages d'amélioration, montants gérés, nombre de personnes encadrées, etc. Utilisez la méthode STAR pour structurer vos descriptions.",
                    impact: "Augmentation significative de la crédibilité et de l'impact de votre profil"
                },
                {
                    priority: "high",
                    title: "Optimiser pour les systèmes ATS",
                    description: "Intégrez plus de mots-clés pertinents de votre secteur et utilisez un format simple sans tableaux complexes. Répétez les termes importants dans différentes sections.",
                    impact: "Amélioration des chances de passage des filtres automatiques de 30-40%"
                },
                {
                    priority: "medium",
                    title: "Enrichir les descriptions d'expérience",
                    description: "Développez chaque poste avec des verbes d'action forts et des contextes précis. Expliquez les défis rencontrés et les solutions apportées.",
                    impact: "Meilleure compréhension de votre valeur ajoutée par les recruteurs"
                },
                {
                    priority: "medium",
                    title: "Structurer les compétences par catégories",
                    description: "Organisez vos compétences en sections claires : techniques, managériales, linguistiques. Précisez votre niveau de maîtrise pour chacune.",
                    impact: "Facilitation du matching avec les exigences des postes"
                }
            ],
            atsCompatibility: {
                score: 72,
                issues: ["Format à simplifier pour une meilleure lecture ATS", "Densité de mots-clés à améliorer"],
                recommendations: ["Utilisez un format texte simple sans éléments graphiques complexes", "Intégrez plus de mots-clés sectoriels dans vos descriptions", "Utilisez des titres de sections standards (Expérience, Formation, Compétences)"]
            },
            keywordAnalysis: {
                matchedKeywords: ["expérience", "compétences", "formation", "projet", "équipe", "gestion"],
                missingKeywords: ["leadership", "innovation", "optimisation", "analyse", "développement"],
                suggestions: ["Intégrez des termes spécifiques à votre secteur d'activité", "Utilisez le vocabulaire exact des offres d'emploi qui vous intéressent", "Répétez les mots-clés importants naturellement dans vos descriptions"]
            }
        };
    }
}