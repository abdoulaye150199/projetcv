import { AIService } from './ai-service.js';

export class CVAnalyzer {
    constructor() {
        this.aiService = new AIService();
        
        // Mots-clés professionnels français
        this.professionalKeywords = [
            'gestion', 'management', 'équipe', 'projet', 'développement', 'amélioration',
            'optimisation', 'analyse', 'stratégie', 'innovation', 'collaboration',
            'leadership', 'communication', 'organisation', 'planification', 'coordination',
            'supervision', 'encadrement', 'formation', 'conseil', 'expertise'
        ];
        
        // Mots-clés techniques modernes
        this.technicalKeywords = [
            'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
            'node.js', 'express', 'sql', 'mongodb', 'postgresql', 'mysql', 'redis',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'gitlab', 'github',
            'agile', 'scrum', 'devops', 'ci/cd', 'jenkins', 'api', 'rest', 'graphql',
            'microservices', 'cloud', 'serverless', 'terraform', 'ansible'
        ];

        // Secteurs d'activité
        this.sectorKeywords = {
            'tech': ['développement', 'programmation', 'software', 'digital', 'it', 'informatique'],
            'marketing': ['marketing', 'communication', 'digital', 'seo', 'sem', 'social media'],
            'finance': ['finance', 'comptabilité', 'audit', 'contrôle de gestion', 'budget'],
            'rh': ['ressources humaines', 'recrutement', 'formation', 'paie', 'social'],
            'commercial': ['vente', 'commercial', 'business development', 'négociation', 'client']
        };
    }

    async analyzeCV(file, jobDescription = '') {
        try {
            console.log('🔍 Début de l\'analyse du CV...');
            const cvText = await this.extractTextFromFile(file);
            console.log('📄 Texte extrait du CV:', cvText.substring(0, 200) + '...');
            
            // Utiliser l'IA améliorée pour l'analyse
            const analysis = await this.aiService.analyzeCV(cvText, jobDescription);
            
            // Enrichir avec des données locales spécifiques
            return this.enrichAnalysisWithLocalInsights(analysis, cvText, jobDescription, file);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'analyse:', error);
            throw new Error(`Erreur lors de l'analyse du CV: ${error.message}`);
        }
    }

    async extractTextFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    let text = '';
                    
                    if (file.type === 'text/plain') {
                        text = e.target.result;
                    } else if (file.type === 'application/pdf') {
                        // Simulation d'extraction PDF - dans un vrai projet, utiliser PDF.js
                        text = `CV PDF de ${file.name}. 
                        
                        PROFIL PROFESSIONNEL
                        Développeur Full Stack avec 5 ans d'expérience dans le développement d'applications web modernes. 
                        Spécialisé en JavaScript, React, Node.js et bases de données SQL/NoSQL.
                        
                        EXPÉRIENCE PROFESSIONNELLE
                        
                        Développeur Senior - TechCorp (2021-2024)
                        • Développement d'applications React avec TypeScript
                        • Gestion d'équipe de 3 développeurs junior
                        • Amélioration des performances de 40%
                        • Migration vers architecture microservices
                        
                        Développeur Full Stack - StartupXYZ (2019-2021)
                        • Création d'API REST avec Node.js et Express
                        • Intégration de bases de données MongoDB
                        • Développement frontend avec React et Redux
                        • Mise en place de tests automatisés
                        
                        FORMATION
                        Master Informatique - Université Paris Diderot (2019)
                        Licence Informatique - Université Paris Diderot (2017)
                        
                        COMPÉTENCES TECHNIQUES
                        • Langages: JavaScript, TypeScript, Python, Java
                        • Frontend: React, Angular, Vue.js, HTML5, CSS3
                        • Backend: Node.js, Express, Django, Spring Boot
                        • Bases de données: MongoDB, PostgreSQL, MySQL, Redis
                        • Cloud: AWS, Docker, Kubernetes
                        • Outils: Git, Jenkins, Jira, Confluence
                        
                        COMPÉTENCES INTERPERSONNELLES
                        • Leadership et management d'équipe
                        • Communication et présentation
                        • Résolution de problèmes complexes
                        • Adaptabilité et apprentissage continu
                        
                        LANGUES
                        • Français (natif)
                        • Anglais (courant - TOEIC 850)
                        • Espagnol (intermédiaire)
                        
                        CONTACT
                        Email: john.doe@email.com
                        Téléphone: +33 6 12 34 56 78
                        LinkedIn: linkedin.com/in/johndoe
                        Adresse: Paris, France`;
                    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                        // Simulation d'extraction Word
                        text = `CV Word de ${file.name}.
                        
                        Marie Dupont
                        Chef de Projet Marketing Digital
                        
                        CONTACT
                        Email: marie.dupont@email.com
                        Téléphone: 01 23 45 67 89
                        LinkedIn: linkedin.com/in/mariedupont
                        Adresse: Lyon, France
                        
                        PROFIL PROFESSIONNEL
                        Chef de projet marketing digital avec 7 ans d'expérience dans la gestion de campagnes multi-canaux. 
                        Expertise en SEO/SEA, social media marketing et analyse de performance. 
                        Passionnée par l'innovation digitale et la transformation des entreprises.
                        
                        EXPÉRIENCE PROFESSIONNELLE
                        
                        Chef de Projet Marketing Digital - AgenceWeb (2020-2024)
                        • Gestion de portefeuille clients (15 comptes, CA 2M€)
                        • Augmentation du trafic organique de 150% en moyenne
                        • Management d'équipe de 5 personnes
                        • Mise en place de stratégies omnicanales
                        • ROI moyen des campagnes: +85%
                        
                        Responsable Marketing Digital - E-commerce Plus (2018-2020)
                        • Développement de la stratégie digitale
                        • Gestion budget marketing 500k€/an
                        • Croissance du CA en ligne de 200%
                        • Optimisation du tunnel de conversion (+45%)
                        
                        Chargée de Marketing Digital - StartupMode (2017-2018)
                        • Création et gestion des campagnes Google Ads
                        • Community management (Instagram, Facebook)
                        • Analyse des performances et reporting
                        • Collaboration avec les équipes créatives
                        
                        FORMATION
                        Master Marketing Digital - ESCP Business School (2017)
                        Licence Communication - Université Lyon 2 (2015)
                        
                        CERTIFICATIONS
                        • Google Ads (Search, Display, Shopping)
                        • Google Analytics 4
                        • Facebook Blueprint
                        • HubSpot Content Marketing
                        
                        COMPÉTENCES TECHNIQUES
                        • SEO/SEA: Google Ads, Bing Ads, SEMrush, Ahrefs
                        • Analytics: Google Analytics, Adobe Analytics, Hotjar
                        • Social Media: Facebook Ads, Instagram, LinkedIn Ads
                        • Email Marketing: Mailchimp, Sendinblue, Klaviyo
                        • CMS: WordPress, Shopify, Magento
                        • Design: Photoshop, Canva, Figma (bases)
                        
                        COMPÉTENCES INTERPERSONNELLES
                        • Leadership et management d'équipe
                        • Négociation et relation client
                        • Créativité et innovation
                        • Analyse et esprit critique
                        • Gestion de projet et organisation
                        
                        LANGUES
                        • Français (natif)
                        • Anglais (courant - Cambridge C1)
                        • Italien (intermédiaire)`;
                    } else {
                        // Fallback pour autres types de fichiers
                        text = `Contenu simulé pour ${file.name}. 
                        
                        CV de candidat avec expérience professionnelle variée.
                        Compétences en gestion de projet, communication et leadership.
                        Formation supérieure et certifications professionnelles.
                        Maîtrise de plusieurs langues et outils informatiques.
                        Expérience en management d'équipe et développement commercial.`;
                    }
                    
                    resolve(text);
                } catch (error) {
                    reject(new Error(`Erreur lors de l'extraction du texte: ${error.message}`));
                }
            };
            
            reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
            
            if (file.type === 'text/plain') {
                reader.readAsText(file, 'UTF-8');
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    enrichAnalysisWithLocalInsights(analysis, cvText, jobDescription, file) {
        // Ajouter des insights spécifiques au contexte français
        const enrichedAnalysis = {
            ...analysis,
            fileInfo: {
                name: file.name,
                size: file.size,
                type: file.type,
                wordCount: cvText.split(/\s+/).length
            },
            localInsights: this.generateLocalInsights(cvText, jobDescription),
            sectorAnalysis: this.analyzeSector(cvText),
            frenchSpecificTips: this.getFrenchSpecificTips(cvText)
        };

        // Ajuster les recommandations pour le marché français
        enrichedAnalysis.recommendations = this.adaptRecommendationsForFrance(
            enrichedAnalysis.recommendations, 
            cvText
        );

        return enrichedAnalysis;
    }

    generateLocalInsights(cvText, jobDescription) {
        const insights = {
            keywordDensity: this.calculateKeywordDensity(cvText),
            readabilityScore: this.calculateReadabilityScore(cvText),
            professionalLevel: this.assessProfessionalLevel(cvText),
            geographicRelevance: this.assessGeographicRelevance(cvText),
            industryAlignment: this.assessIndustryAlignment(cvText, jobDescription)
        };

        return insights;
    }

    calculateKeywordDensity(cvText) {
        const words = cvText.toLowerCase().split(/\s+/);
        const totalWords = words.length;
        
        let professionalKeywordCount = 0;
        let technicalKeywordCount = 0;

        this.professionalKeywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'gi');
            const matches = cvText.match(regex);
            if (matches) professionalKeywordCount += matches.length;
        });

        this.technicalKeywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'gi');
            const matches = cvText.match(regex);
            if (matches) technicalKeywordCount += matches.length;
        });

        return {
            professional: Math.round((professionalKeywordCount / totalWords) * 100 * 100) / 100,
            technical: Math.round((technicalKeywordCount / totalWords) * 100 * 100) / 100,
            total: Math.round(((professionalKeywordCount + technicalKeywordCount) / totalWords) * 100 * 100) / 100
        };
    }

    calculateReadabilityScore(cvText) {
        const sentences = cvText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = cvText.split(/\s+/);
        const avgWordsPerSentence = words.length / sentences.length;
        
        // Score basé sur la complexité des phrases (adapté au français)
        let score = 100;
        if (avgWordsPerSentence > 25) score -= 20;
        else if (avgWordsPerSentence > 20) score -= 10;
        else if (avgWordsPerSentence > 15) score -= 5;

        // Pénalité pour les phrases trop courtes (manque de détail)
        if (avgWordsPerSentence < 8) score -= 15;

        return Math.max(score, 0);
    }

    assessProfessionalLevel(cvText) {
        const seniorKeywords = ['senior', 'lead', 'chef', 'directeur', 'manager', 'responsable', 'expert'];
        const managementKeywords = ['équipe', 'management', 'encadrement', 'supervision', 'direction'];
        const experienceYears = this.extractExperienceYears(cvText);

        let level = 'junior';
        let score = 0;

        seniorKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) score += 2;
        });

        managementKeywords.forEach(keyword => {
            if (new RegExp(keyword, 'i').test(cvText)) score += 1;
        });

        if (experienceYears >= 8 || score >= 6) level = 'senior';
        else if (experienceYears >= 4 || score >= 3) level = 'confirmé';
        else if (experienceYears >= 2 || score >= 1) level = 'junior+';

        return {
            level,
            score,
            estimatedYears: experienceYears
        };
    }

    extractExperienceYears(cvText) {
        // Recherche de patterns d'années d'expérience
        const yearPatterns = [
            /(\d+)\s*ans?\s*(d'|de\s+)?expérience/gi,
            /expérience\s*de\s*(\d+)\s*ans?/gi,
            /(\d+)\s*années?\s*(d'|de\s+)?expérience/gi
        ];

        for (let pattern of yearPatterns) {
            const matches = cvText.match(pattern);
            if (matches) {
                const numbers = matches[0].match(/\d+/);
                if (numbers) return parseInt(numbers[0]);
            }
        }

        // Estimation basée sur les dates
        const years = this.extractYearsFromDates(cvText);
        if (years.length >= 2) {
            return Math.max(...years) - Math.min(...years);
        }

        return 0;
    }

    extractYearsFromDates(cvText) {
        const yearPattern = /\b(20\d{2}|19\d{2})\b/g;
        const matches = cvText.match(yearPattern);
        return matches ? matches.map(year => parseInt(year)) : [];
    }

    assessGeographicRelevance(cvText) {
        const frenchCities = [
            'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'montpellier',
            'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon', 'grenoble'
        ];

        const frenchRegions = [
            'île-de-france', 'auvergne-rhône-alpes', 'nouvelle-aquitaine', 'occitanie',
            'hauts-de-france', 'grand est', 'provence-alpes-côte d\'azur', 'pays de la loire'
        ];

        let relevanceScore = 0;
        let location = 'non spécifiée';

        frenchCities.forEach(city => {
            if (new RegExp(city, 'i').test(cvText)) {
                relevanceScore += 10;
                location = city;
            }
        });

        frenchRegions.forEach(region => {
            if (new RegExp(region, 'i').test(cvText)) {
                relevanceScore += 5;
            }
        });

        if (new RegExp('france', 'i').test(cvText)) {
            relevanceScore += 5;
        }

        return {
            score: Math.min(relevanceScore, 100),
            location,
            isRelevant: relevanceScore > 0
        };
    }

    assessIndustryAlignment(cvText, jobDescription) {
        let bestMatch = { sector: 'généraliste', score: 0, keywords: [] };

        Object.entries(this.sectorKeywords).forEach(([sector, keywords]) => {
            let sectorScore = 0;
            const matchedKeywords = [];

            keywords.forEach(keyword => {
                const cvMatches = (cvText.match(new RegExp(keyword, 'gi')) || []).length;
                const jobMatches = jobDescription ? 
                    (jobDescription.match(new RegExp(keyword, 'gi')) || []).length : 0;

                if (cvMatches > 0) {
                    sectorScore += cvMatches * (jobMatches > 0 ? 2 : 1);
                    matchedKeywords.push(keyword);
                }
            });

            if (sectorScore > bestMatch.score) {
                bestMatch = { sector, score: sectorScore, keywords: matchedKeywords };
            }
        });

        return bestMatch;
    }

    analyzeSector(cvText) {
        const sectorAnalysis = this.assessIndustryAlignment(cvText, '');
        
        return {
            identifiedSector: sectorAnalysis.sector,
            confidence: Math.min((sectorAnalysis.score / 10) * 100, 100),
            relevantKeywords: sectorAnalysis.keywords,
            recommendations: this.getSectorSpecificRecommendations(sectorAnalysis.sector)
        };
    }

    getSectorSpecificRecommendations(sector) {
        const recommendations = {
            'tech': [
                'Mentionnez vos contributions open source',
                'Détaillez vos projets techniques avec les technologies utilisées',
                'Quantifiez les performances et optimisations réalisées'
            ],
            'marketing': [
                'Quantifiez vos résultats (ROI, taux de conversion, croissance)',
                'Mentionnez vos certifications (Google, Facebook, HubSpot)',
                'Détaillez vos campagnes les plus réussies'
            ],
            'finance': [
                'Précisez les montants et budgets gérés',
                'Mentionnez vos certifications professionnelles',
                'Détaillez votre expertise réglementaire'
            ],
            'rh': [
                'Quantifiez vos recrutements et formations',
                'Mentionnez votre connaissance du droit social',
                'Détaillez vos projets de transformation RH'
            ],
            'commercial': [
                'Quantifiez vos résultats de vente (CA, objectifs)',
                'Mentionnez la taille de votre portefeuille client',
                'Détaillez vos techniques de négociation'
            ]
        };

        return recommendations[sector] || [
            'Quantifiez vos réalisations avec des chiffres précis',
            'Utilisez des verbes d\'action forts',
            'Adaptez votre vocabulaire au secteur visé'
        ];
    }

    getFrenchSpecificTips(cvText) {
        const tips = [];

        // Vérification de la photo (déconseillée en France sauf exceptions)
        if (/photo|image/i.test(cvText)) {
            tips.push({
                type: 'warning',
                title: 'Photo sur le CV',
                description: 'En France, la photo n\'est généralement pas recommandée sauf pour certains métiers spécifiques (commercial, accueil).'
            });
        }

        // Longueur du CV
        const wordCount = cvText.split(/\s+/).length;
        if (wordCount > 800) {
            tips.push({
                type: 'info',
                title: 'Longueur du CV',
                description: 'En France, un CV d\'une page est souvent préféré, sauf pour les profils très expérimentés.'
            });
        }

        // Informations personnelles
        if (!/âge|né|naissance/i.test(cvText)) {
            tips.push({
                type: 'success',
                title: 'Informations personnelles',
                description: 'Bien ! Vous n\'avez pas mentionné votre âge, ce qui est recommandé pour éviter les discriminations.'
            });
        }

        return tips;
    }

    adaptRecommendationsForFrance(recommendations, cvText) {
        // Ajouter des recommandations spécifiques au marché français
        const frenchRecommendations = [...recommendations];

        // Vérifier la présence de certifications françaises
        if (!/cqp|rncp|titre professionnel/i.test(cvText)) {
            frenchRecommendations.push({
                priority: 'low',
                title: 'Certifications françaises',
                description: 'Considérez l\'ajout de certifications reconnues en France (RNCP, CQP, titres professionnels) pour renforcer votre profil.',
                impact: 'Meilleure reconnaissance de vos qualifications par les recruteurs français'
            });
        }

        // Recommandation sur les soft skills à la française
        frenchRecommendations.push({
            priority: 'low',
            title: 'Adaptation culturelle',
            description: 'Mettez en avant des qualités appréciées en France : rigueur, esprit d\'analyse, capacité d\'adaptation et sens du collectif.',
            impact: 'Meilleure adéquation avec les attentes culturelles des entreprises françaises'
        });

        return frenchRecommendations;
    }
}