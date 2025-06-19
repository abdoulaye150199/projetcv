import { AIService } from './ai-service.js';

export class CVAnalyzer {
    constructor() {
        this.aiService = new AIService();
        this.atsKeywords = [
            'experience', 'compétences', 'formation', 'diplôme', 'certification',
            'projet', 'réalisation', 'responsabilité', 'management', 'équipe',
            'résultat', 'objectif', 'amélioration', 'développement', 'innovation'
        ];
        
        this.technicalKeywords = [
            'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
            'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'agile',
            'scrum', 'devops', 'ci/cd', 'api', 'rest', 'graphql'
        ];
    }

    async analyzeCV(file, jobDescription = '') {
        try {
            const cvText = await this.extractTextFromFile(file);
            
            // Utiliser l'IA pour l'analyse si possible, sinon fallback sur l'analyse locale
            try {
                const aiAnalysis = await this.aiService.analyzeCV(cvText, jobDescription);
                return this.enhanceAnalysisWithLocalData(aiAnalysis, cvText, jobDescription);
            } catch (aiError) {
                console.warn('Analyse IA échouée, utilisation de l\'analyse locale:', aiError);
                return this.performLocalAnalysis(cvText, jobDescription);
            }
        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            throw error;
        }
    }

    async extractTextFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                let text = '';
                
                if (file.type === 'text/plain') {
                    text = e.target.result;
                } else if (file.type === 'application/pdf') {
                    // Pour une vraie application, utiliser une bibliothèque comme PDF.js
                    text = 'Contenu PDF simulé pour la démonstration - ' + file.name;
                } else {
                    // Simulation pour les autres types de fichiers
                    text = 'Contenu de fichier simulé pour la démonstration - ' + file.name;
                }
                
                resolve(text.toLowerCase());
            };
            
            reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
            
            if (file.type === 'text/plain') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    enhanceAnalysisWithLocalData(aiAnalysis, cvText, jobDescription) {
        // Enrichir l'analyse IA avec des données locales
        const localAnalysis = this.performLocalAnalysis(cvText, jobDescription);
        
        // Combiner les résultats
        return {
            ...aiAnalysis,
            localInsights: {
                wordCount: cvText.split(/\s+/).length,
                keywordDensity: this.calculateKeywordDensity(cvText),
                readabilityScore: this.calculateReadabilityScore(cvText),
                sectionAnalysis: this.analyzeSections(cvText)
            }
        };
    }

    performLocalAnalysis(cvText, jobDescription = '') {
        const analysis = {
            overallScore: 0,
            details: [],
            recommendations: [],
            atsCompatibility: {
                score: 0,
                issues: [],
                recommendations: []
            },
            keywordAnalysis: {
                matchedKeywords: [],
                missingKeywords: [],
                suggestions: []
            }
        };

        // Analyse de la structure
        const structureScore = this.analyzeStructure(cvText);
        analysis.details.push({
            category: 'Structure et Format',
            score: structureScore,
            description: 'Évaluation de l\'organisation et de la lisibilité du CV',
            issues: structureScore < 70 ? ['Structure à améliorer', 'Sections manquantes'] : [],
            strengths: structureScore >= 70 ? ['Bonne organisation', 'Sections présentes'] : []
        });

        // Analyse des mots-clés ATS
        const keywordScore = this.analyzeKeywords(cvText, jobDescription);
        analysis.details.push({
            category: 'Mots-clés et Optimisation ATS',
            score: keywordScore,
            description: 'Présence de mots-clés importants pour les systèmes ATS',
            issues: keywordScore < 70 ? ['Mots-clés insuffisants', 'Optimisation ATS faible'] : [],
            strengths: keywordScore >= 70 ? ['Bons mots-clés', 'Optimisation correcte'] : []
        });

        // Analyse du contenu
        const contentScore = this.analyzeContent(cvText);
        analysis.details.push({
            category: 'Contenu et Expérience',
            score: contentScore,
            description: 'Richesse et pertinence des informations fournies',
            issues: contentScore < 70 ? ['Contenu insuffisant', 'Manque de détails'] : [],
            strengths: contentScore >= 70 ? ['Contenu riche', 'Informations pertinentes'] : []
        });

        // Analyse de la longueur
        const lengthScore = this.analyzeLength(cvText);
        analysis.details.push({
            category: 'Longueur et Format',
            score: lengthScore,
            description: 'Respect de la longueur recommandée pour un CV',
            issues: lengthScore < 70 ? ['Longueur inadéquate'] : [],
            strengths: lengthScore >= 70 ? ['Longueur optimale'] : []
        });

        // Analyse des compétences techniques
        const techScore = this.analyzeTechnicalSkills(cvText);
        analysis.details.push({
            category: 'Compétences Techniques',
            score: techScore,
            description: 'Présence et pertinence des compétences techniques',
            issues: techScore < 70 ? ['Compétences techniques insuffisantes'] : [],
            strengths: techScore >= 70 ? ['Bonnes compétences techniques'] : []
        });

        // Calcul du score global
        analysis.overallScore = Math.round(
            analysis.details.reduce((sum, detail) => sum + detail.score, 0) / analysis.details.length
        );

        // Génération des recommandations
        analysis.recommendations = this.generateRecommendations(analysis);
        analysis.atsCompatibility = this.analyzeATSCompatibility(cvText);
        analysis.keywordAnalysis = this.analyzeKeywordMatch(cvText, jobDescription);

        return analysis;
    }

    analyzeStructure(cvText) {
        let score = 60; // Score de base

        // Vérification des sections essentielles
        const essentialSections = [
            'expérience', 'formation', 'compétences', 'contact'
        ];

        essentialSections.forEach(section => {
            if (cvText.includes(section)) {
                score += 8;
            }
        });

        // Bonus pour une bonne organisation
        if (cvText.includes('email') && cvText.includes('téléphone')) {
            score += 5;
        }

        return Math.min(score, 100);
    }

    analyzeKeywords(cvText, jobDescription) {
        let score = 50;
        let keywordCount = 0;

        // Analyse des mots-clés ATS génériques
        this.atsKeywords.forEach(keyword => {
            if (cvText.includes(keyword)) {
                keywordCount++;
                score += 3;
            }
        });

        // Analyse des mots-clés de la description de poste
        if (jobDescription) {
            const jobKeywords = jobDescription.toLowerCase().split(/\s+/)
                .filter(word => word.length > 3)
                .slice(0, 20);

            jobKeywords.forEach(keyword => {
                if (cvText.includes(keyword)) {
                    score += 2;
                }
            });
        }

        return Math.min(score, 100);
    }

    analyzeContent(cvText) {
        let score = 40;

        const wordCount = cvText.split(/\s+/).length;
        
        if (wordCount > 200) score += 20;
        if (wordCount > 400) score += 15;
        if (wordCount > 600) score += 10;

        // Vérification de la présence d'informations quantifiées
        const numberPattern = /\d+/g;
        const numbers = cvText.match(numberPattern);
        if (numbers && numbers.length > 5) {
            score += 15;
        }

        return Math.min(score, 100);
    }

    analyzeLength(cvText) {
        const wordCount = cvText.split(/\s+/).length;
        
        if (wordCount >= 300 && wordCount <= 800) {
            return 100;
        } else if (wordCount >= 200 && wordCount < 300) {
            return 75;
        } else if (wordCount > 800 && wordCount <= 1000) {
            return 80;
        } else if (wordCount < 200) {
            return 40;
        } else {
            return 60;
        }
    }

    analyzeTechnicalSkills(cvText) {
        let score = 30;
        let techKeywordCount = 0;

        this.technicalKeywords.forEach(keyword => {
            if (cvText.includes(keyword)) {
                techKeywordCount++;
                score += 4;
            }
        });

        if (techKeywordCount > 5) score += 10;
        if (techKeywordCount > 10) score += 10;

        return Math.min(score, 100);
    }

    analyzeATSCompatibility(cvText) {
        let score = 70;
        const issues = [];
        const recommendations = [];

        // Vérifications ATS
        if (cvText.includes('tableau') || cvText.includes('image')) {
            score -= 15;
            issues.push('Présence possible de tableaux ou images');
            recommendations.push('Éviter les tableaux complexes et images');
        }

        if (cvText.length < 500) {
            score -= 10;
            issues.push('CV trop court');
            recommendations.push('Enrichir le contenu du CV');
        }

        return {
            score: Math.max(score, 0),
            issues,
            recommendations
        };
    }

    analyzeKeywordMatch(cvText, jobDescription) {
        const matchedKeywords = [];
        const missingKeywords = [];
        const suggestions = [];

        // Analyse basique des mots-clés
        this.atsKeywords.forEach(keyword => {
            if (cvText.includes(keyword)) {
                matchedKeywords.push(keyword);
            } else {
                missingKeywords.push(keyword);
            }
        });

        if (jobDescription) {
            suggestions.push('Intégrer plus de mots-clés de la description de poste');
            suggestions.push('Adapter le vocabulaire au secteur d\'activité');
        }

        return {
            matchedKeywords: matchedKeywords.slice(0, 10),
            missingKeywords: missingKeywords.slice(0, 5),
            suggestions
        };
    }

    calculateKeywordDensity(cvText) {
        const words = cvText.split(/\s+/);
        const keywordCount = this.atsKeywords.filter(keyword => 
            cvText.includes(keyword)
        ).length;
        
        return Math.round((keywordCount / words.length) * 100 * 100) / 100;
    }

    calculateReadabilityScore(cvText) {
        // Score de lisibilité simplifié
        const sentences = cvText.split(/[.!?]+/).length;
        const words = cvText.split(/\s+/).length;
        const avgWordsPerSentence = words / sentences;
        
        // Score basé sur la longueur moyenne des phrases
        if (avgWordsPerSentence <= 15) return 90;
        if (avgWordsPerSentence <= 20) return 80;
        if (avgWordsPerSentence <= 25) return 70;
        return 60;
    }

    analyzeSections(cvText) {
        const sections = {
            contact: cvText.includes('email') || cvText.includes('téléphone'),
            experience: cvText.includes('expérience') || cvText.includes('poste'),
            education: cvText.includes('formation') || cvText.includes('diplôme'),
            skills: cvText.includes('compétences') || cvText.includes('skills'),
            summary: cvText.includes('résumé') || cvText.includes('profil')
        };

        return sections;
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        analysis.details.forEach(detail => {
            if (detail.score < 70) {
                switch (detail.category) {
                    case 'Structure et Format':
                        recommendations.push({
                            priority: 'high',
                            title: 'Améliorer la structure',
                            description: 'Organisez votre CV avec des sections claires : Contact, Résumé, Expérience, Formation, Compétences.',
                            impact: 'Meilleure lisibilité pour les recruteurs et les ATS'
                        });
                        break;
                    case 'Mots-clés et Optimisation ATS':
                        recommendations.push({
                            priority: 'high',
                            title: 'Optimiser les mots-clés',
                            description: 'Intégrez plus de mots-clés pertinents de votre secteur et de l\'offre d\'emploi visée.',
                            impact: 'Augmentation significative des chances de passage des filtres ATS'
                        });
                        break;
                    case 'Contenu et Expérience':
                        recommendations.push({
                            priority: 'medium',
                            title: 'Enrichir le contenu',
                            description: 'Ajoutez plus de détails sur vos réalisations avec des chiffres et des résultats concrets.',
                            impact: 'Meilleure démonstration de votre valeur ajoutée'
                        });
                        break;
                    case 'Compétences Techniques':
                        recommendations.push({
                            priority: 'medium',
                            title: 'Détailler les compétences techniques',
                            description: 'Listez clairement vos compétences techniques avec le niveau de maîtrise.',
                            impact: 'Meilleur matching avec les exigences techniques des postes'
                        });
                        break;
                }
            }
        });

        // Recommandations générales
        if (analysis.overallScore < 80) {
            recommendations.push({
                priority: 'high',
                title: 'Format ATS-friendly',
                description: 'Utilisez un format simple, évitez les tableaux complexes et les images dans le texte.',
                impact: 'Garantie de lecture correcte par tous les systèmes ATS'
            });
        }

        return recommendations;
    }
}