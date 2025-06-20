import { AIService } from './ai-service.js';

export class CVImprover {
    constructor() {
        this.aiService = new AIService();
        this.improvementAreas = {
            structure: 'Structure et format',
            keywords: 'Mots-clés et ATS',
            content: 'Contenu et descriptions',
            skills: 'Compétences',
            impact: 'Impact et résultats'
        };
    }

    async improveCV(file, targetJob = '', focusAreas = []) {
        try {
            const cvText = await this.extractTextFromFile(file);
            
            // Utiliser l'IA pour générer des améliorations si possible, sinon fallback sur l'analyse locale
            try {
                const aiImprovements = await this.aiService.generateCVSuggestions(cvText, targetJob);
                if (aiImprovements) {
                    return this.enhanceImprovementsWithLocalData(aiImprovements, cvText, focusAreas);
                }
            } catch (aiError) {
                console.warn('Amélioration IA échouée, utilisation de l\'amélioration locale:', aiError);
            }
            
            return this.performLocalImprovement(cvText, targetJob, focusAreas);
        } catch (error) {
            console.error('Erreur lors de l\'amélioration:', error);
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

    enhanceImprovementsWithLocalData(aiImprovements, cvText, focusAreas) {
        const localImprovements = this.performLocalImprovement(cvText, '', focusAreas);
        
        // Combiner les améliorations IA avec les améliorations locales
        return {
            ...aiImprovements,
            ...localImprovements,
            suggestions: [
                ...(aiImprovements.suggestions || []),
                ...localImprovements.suggestions
            ].slice(0, 15) // Limiter à 15 suggestions max
        };
    }

    performLocalImprovement(cvText, targetJob, focusAreas) {
        const improvements = {
            improvementScore: this.calculateImprovementPotential(cvText),
            suggestions: [],
            atsImprovement: 0,
            comparison: {
                before: [],
                after: []
            }
        };

        // Générer des suggestions basées sur les domaines d'amélioration sélectionnés
        if (focusAreas.length === 0 || focusAreas.includes('structure')) {
            improvements.suggestions.push(...this.generateStructureImprovements(cvText));
        }

        if (focusAreas.length === 0 || focusAreas.includes('keywords')) {
            improvements.suggestions.push(...this.generateKeywordImprovements(cvText, targetJob));
        }

        if (focusAreas.length === 0 || focusAreas.includes('content')) {
            improvements.suggestions.push(...this.generateContentImprovements(cvText));
        }

        if (focusAreas.length === 0 || focusAreas.includes('skills')) {
            improvements.suggestions.push(...this.generateSkillsImprovements(cvText));
        }

        if (focusAreas.length === 0 || focusAreas.includes('impact')) {
            improvements.suggestions.push(...this.generateImpactImprovements(cvText));
        }

        // Calculer l'amélioration ATS potentielle
        improvements.atsImprovement = this.calculateATSImprovement(improvements.suggestions);

        // Générer la comparaison avant/après
        improvements.comparison = this.generateComparison(cvText, improvements.suggestions);

        return improvements;
    }

    calculateImprovementPotential(cvText) {
        let potential = 0;
        const wordCount = cvText.split(/\s+/).length;

        // Facteurs qui indiquent un potentiel d'amélioration
        if (wordCount < 300) potential += 20; // CV trop court
        if (wordCount > 800) potential += 15; // CV trop long
        if (!cvText.includes('résultat') && !cvText.includes('réalisation')) potential += 25;
        if (!/\d+/.test(cvText)) potential += 20; // Pas de chiffres
        if (!cvText.includes('compétence')) potential += 15;
        if (!cvText.includes('expérience')) potential += 10;

        return Math.min(potential + 30, 95); // Score de base + facteurs
    }

    generateStructureImprovements(cvText) {
        const suggestions = [];

        if (!cvText.includes('résumé') && !cvText.includes('profil')) {
            suggestions.push({
                title: 'Ajouter un résumé professionnel',
                description: 'Ajoutez une section résumé en haut de votre CV pour présenter votre profil en 3-4 lignes.',
                priority: 'high',
                example: {
                    before: 'CV sans résumé professionnel',
                    after: 'Développeur Full Stack avec 5 ans d\'expérience en JavaScript et React, spécialisé dans le développement d\'applications web performantes.'
                }
            });
        }

        if (!cvText.includes('contact') && !cvText.includes('email')) {
            suggestions.push({
                title: 'Optimiser les informations de contact',
                description: 'Assurez-vous que vos informations de contact sont clairement visibles en haut du CV.',
                priority: 'high',
                example: {
                    before: 'Informations de contact dispersées',
                    after: 'Email, téléphone, LinkedIn et adresse regroupés dans un en-tête clair'
                }
            });
        }

        suggestions.push({
            title: 'Utiliser des sections claires',
            description: 'Organisez votre CV avec des sections bien définies : Expérience, Formation, Compétences, etc.',
            priority: 'medium',
            example: {
                before: 'Informations mélangées sans structure claire',
                after: 'Sections distinctes avec titres en gras et espacement cohérent'
            }
        });

        return suggestions;
    }

    generateKeywordImprovements(cvText, targetJob) {
        const suggestions = [];

        const commonKeywords = ['gestion', 'développement', 'analyse', 'communication', 'leadership'];
        const missingKeywords = commonKeywords.filter(keyword => !cvText.includes(keyword));

        if (missingKeywords.length > 0) {
            suggestions.push({
                title: 'Intégrer des mots-clés sectoriels',
                description: `Ajoutez des mots-clés pertinents comme : ${missingKeywords.slice(0, 3).join(', ')}`,
                priority: 'high',
                example: {
                    before: 'Responsable de projets',
                    after: 'Gestion de projets et leadership d\'équipes multidisciplinaires'
                }
            });
        }

        if (targetJob) {
            suggestions.push({
                title: 'Adapter au poste visé',
                description: 'Personnalisez votre vocabulaire en fonction du poste que vous visez.',
                priority: 'high',
                example: {
                    before: 'Expérience en informatique',
                    after: 'Expertise en développement web et technologies cloud'
                }
            });
        }

        suggestions.push({
            title: 'Optimiser pour les ATS',
            description: 'Utilisez des termes standards de votre secteur que les systèmes ATS reconnaissent facilement.',
            priority: 'medium',
            example: {
                before: 'Bon en programmation',
                after: 'Maîtrise des langages JavaScript, Python et frameworks React, Node.js'
            }
        });

        return suggestions;
    }

    generateContentImprovements(cvText) {
        const suggestions = [];

        if (!/\d+/.test(cvText)) {
            suggestions.push({
                title: 'Quantifier vos réalisations',
                description: 'Ajoutez des chiffres, pourcentages et résultats concrets à vos expériences.',
                priority: 'high',
                example: {
                    before: 'Amélioration des performances du site web',
                    after: 'Amélioration des performances du site web de 40%, réduisant le temps de chargement de 3s à 1.8s'
                }
            });
        }

        if (!cvText.includes('réalisation') && !cvText.includes('résultat')) {
            suggestions.push({
                title: 'Mettre en avant vos réalisations',
                description: 'Transformez vos responsabilités en réalisations concrètes avec des résultats mesurables.',
                priority: 'high',
                example: {
                    before: 'Responsable de la gestion d\'équipe',
                    after: 'Management d\'une équipe de 8 développeurs, livraison de 15 projets dans les délais'
                }
            });
        }

        suggestions.push({
            title: 'Utiliser des verbes d\'action',
            description: 'Commencez vos phrases par des verbes d\'action forts : dirigé, développé, optimisé, créé.',
            priority: 'medium',
            example: {
                before: 'J\'étais en charge du développement',
                after: 'Développé et déployé 5 applications web utilisées par 10 000+ utilisateurs'
            }
        });

        return suggestions;
    }

    generateSkillsImprovements(cvText) {
        const suggestions = [];

        if (!cvText.includes('compétence')) {
            suggestions.push({
                title: 'Créer une section compétences dédiée',
                description: 'Ajoutez une section claire listant vos compétences techniques et interpersonnelles.',
                priority: 'medium',
                example: {
                    before: 'Compétences mentionnées dans le texte',
                    after: 'Section "Compétences" avec catégories : Techniques, Langages, Outils, Soft Skills'
                }
            });
        }

        suggestions.push({
            title: 'Préciser votre niveau de maîtrise',
            description: 'Indiquez votre niveau pour chaque compétence : débutant, intermédiaire, avancé, expert.',
            priority: 'low',
            example: {
                before: 'JavaScript, Python',
                after: 'JavaScript (Expert - 5 ans), Python (Avancé - 3 ans)'
            }
        });

        suggestions.push({
            title: 'Équilibrer compétences techniques et soft skills',
            description: 'Incluez à la fois vos compétences techniques et vos qualités interpersonnelles.',
            priority: 'medium',
            example: {
                before: 'Uniquement compétences techniques',
                after: 'Techniques : React, Node.js | Soft Skills : Leadership, Communication, Résolution de problèmes'
            }
        });

        return suggestions;
    }

    generateImpactImprovements(cvText) {
        const suggestions = [];

        suggestions.push({
            title: 'Démontrer votre valeur ajoutée',
            description: 'Montrez comment vos actions ont bénéficié à l\'entreprise : économies, gains de temps, amélioration de processus.',
            priority: 'high',
            example: {
                before: 'Optimisation des processus',
                after: 'Optimisation des processus de déploiement, réduction de 60% du temps de mise en production'
            }
        });

        suggestions.push({
            title: 'Utiliser la méthode STAR',
            description: 'Structurez vos expériences avec Situation, Tâche, Action, Résultat pour plus d\'impact.',
            priority: 'medium',
            example: {
                before: 'Gestion de projet difficile',
                after: 'Face à un retard de 3 mois sur un projet critique, j\'ai restructuré l\'équipe et les processus, livrant le projet avec seulement 2 semaines de retard'
            }
        });

        suggestions.push({
            title: 'Inclure des témoignages ou reconnaissances',
            description: 'Mentionnez les prix, reconnaissances ou feedback positifs reçus.',
            priority: 'low',
            example: {
                before: 'Bon travail reconnu',
                after: 'Élu "Employé du mois" 3 fois, félicité par la direction pour l\'innovation apportée'
            }
        });

        return suggestions;
    }

    calculateATSImprovement(suggestions) {
        let improvement = 0;
        
        suggestions.forEach(suggestion => {
            if (suggestion.priority === 'high') improvement += 8;
            else if (suggestion.priority === 'medium') improvement += 5;
            else improvement += 2;
        });

        return Math.min(improvement, 50); // Maximum 50% d'amélioration
    }

    generateComparison(cvText, suggestions) {
        const before = [
            'CV sans structure claire',
            'Descriptions vagues sans chiffres',
            'Manque de mots-clés sectoriels',
            'Pas de quantification des résultats',
            'Compétences peu détaillées'
        ];

        const after = [
            'Structure professionnelle avec sections claires',
            'Réalisations quantifiées avec résultats mesurables',
            'Vocabulaire optimisé pour les ATS',
            'Impact démontré avec chiffres concrets',
            'Compétences détaillées par niveau de maîtrise'
        ];

        return { before, after };
    }
}