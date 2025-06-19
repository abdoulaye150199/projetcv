import { templates } from './templates.js';

export class CVGenerator {
    generateHTML(data, templateName) {
        const template = templates[templateName];
        if (!template) {
            return this.generateErrorHTML('Modèle non trouvé');
        }

        try {
            return template.generate(data);
        } catch (error) {
            console.error('Erreur lors de la génération du CV:', error);
            return this.generateErrorHTML('Erreur lors de la génération du CV');
        }
    }

    generateErrorHTML(message) {
        return `
            <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-800">${message}</p>
            </div>
        `;
    }
}