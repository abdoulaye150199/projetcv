export const templates = {
    modern: {
        name: 'Moderne',
        description: 'Design contemporain avec en-tête coloré',
        generate: (data) => {
            const personal = data.personal || {};
            const experiences = data.experiences || [];
            const education = data.education || [];
            const skills = data.skills || {};
            
            return `
                <div class="max-w-4xl mx-auto bg-white shadow-lg" style="min-height: 297mm; font-family: 'Inter', sans-serif;">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
                        <div class="flex items-center space-x-6">
                            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-4xl text-blue-600"></i>
                            </div>
                            <div class="flex-1">
                                <h1 class="text-4xl font-bold mb-2">${personal.firstName || ''} ${personal.lastName || ''}</h1>
                                <h2 class="text-xl text-blue-100 mb-4">${personal.jobTitle || ''}</h2>
                                <div class="flex flex-wrap gap-4 text-sm">
                                    ${personal.email ? `<div class="flex items-center"><i class="fas fa-envelope mr-2"></i>${personal.email}</div>` : ''}
                                    ${personal.phone ? `<div class="flex items-center"><i class="fas fa-phone mr-2"></i>${personal.phone}</div>` : ''}
                                    ${personal.address ? `<div class="flex items-center"><i class="fas fa-map-marker-alt mr-2"></i>${personal.address}</div>` : ''}
                                    ${personal.linkedin ? `<div class="flex items-center"><i class="fab fa-linkedin mr-2"></i>LinkedIn</div>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-8">
                        <!-- Summary -->
                        ${personal.summary ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">PROFIL PROFESSIONNEL</h3>
                                <p class="text-gray-700 leading-relaxed">${personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience -->
                        ${experiences.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">EXPÉRIENCE PROFESSIONNELLE</h3>
                                <div class="space-y-6">
                                    ${experiences.map(exp => `
                                        <div class="border-l-4 border-blue-600 pl-6">
                                            <div class="flex justify-between items-start mb-2">
                                                <h4 class="text-xl font-semibold text-gray-800">${exp.position || ''}</h4>
                                                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">${exp.startDate || ''} - ${exp.endDate || 'Présent'}</span>
                                            </div>
                                            <p class="text-lg text-blue-600 font-medium mb-2">${exp.company || ''}</p>
                                            ${exp.description ? `<p class="text-gray-700 leading-relaxed">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education -->
                        ${education.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">FORMATION</h3>
                                <div class="space-y-4">
                                    ${education.map(edu => `
                                        <div class="border-l-4 border-green-500 pl-6">
                                            <div class="flex justify-between items-start mb-2">
                                                <h4 class="text-lg font-semibold text-gray-800">${edu.degree || ''}</h4>
                                                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">${edu.year || ''}</span>
                                            </div>
                                            <p class="text-green-600 font-medium">${edu.school || ''}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Skills -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            ${skills.technical ? `
                                <section>
                                    <h3 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">COMPÉTENCES TECHNIQUES</h3>
                                    <div class="space-y-2">
                                        ${skills.technical.split(',').map(skill => `
                                            <div class="flex items-center">
                                                <div class="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                                                <span class="text-gray-700">${skill.trim()}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            ` : ''}

                            ${skills.soft ? `
                                <section>
                                    <h3 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-orange-600 pb-2">COMPÉTENCES INTERPERSONNELLES</h3>
                                    <div class="space-y-2">
                                        ${skills.soft.split(',').map(skill => `
                                            <div class="flex items-center">
                                                <div class="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                                                <span class="text-gray-700">${skill.trim()}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            ` : ''}
                        </div>

                        <!-- Languages -->
                        ${data.languages ? `
                            <section class="mt-8">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-red-600 pb-2">LANGUES</h3>
                                <div class="flex flex-wrap gap-4">
                                    ${data.languages.split(',').map(lang => `
                                        <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">${lang.trim()}</span>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },

    classic: {
        name: 'Classique',
        description: 'Style traditionnel et professionnel',
        generate: (data) => {
            const personal = data.personal || {};
            const experiences = data.experiences || [];
            const education = data.education || [];
            const skills = data.skills || {};
            
            return `
                <div class="max-w-4xl mx-auto bg-white shadow-lg" style="min-height: 297mm; font-family: 'Times New Roman', serif;">
                    <div class="p-8">
                        <!-- Header -->
                        <div class="text-center border-b-2 border-gray-800 pb-6 mb-8">
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">${personal.firstName || ''} ${personal.lastName || ''}</h1>
                            <h2 class="text-xl text-gray-600 mb-4">${personal.jobTitle || ''}</h2>
                            <div class="flex justify-center space-x-6 text-sm text-gray-600">
                                ${personal.email ? `<span><i class="fas fa-envelope mr-1"></i>${personal.email}</span>` : ''}
                                ${personal.phone ? `<span><i class="fas fa-phone mr-1"></i>${personal.phone}</span>` : ''}
                                ${personal.address ? `<span><i class="fas fa-map-marker-alt mr-1"></i>${personal.address}</span>` : ''}
                            </div>
                        </div>

                        <!-- Summary -->
                        ${personal.summary ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Résumé Professionnel</h3>
                                <p class="text-gray-700 leading-relaxed text-justify">${personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience -->
                        ${experiences.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Expérience Professionnelle</h3>
                                <div class="space-y-6">
                                    ${experiences.map(exp => `
                                        <div>
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 class="text-lg font-bold text-gray-800">${exp.position || ''}</h4>
                                                    <p class="text-gray-600 font-medium">${exp.company || ''}</p>
                                                </div>
                                                <span class="text-sm text-gray-600 font-medium">${exp.startDate || ''} - ${exp.endDate || 'Présent'}</span>
                                            </div>
                                            ${exp.description ? `<p class="text-gray-700 leading-relaxed text-justify">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education -->
                        ${education.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Formation</h3>
                                <div class="space-y-4">
                                    ${education.map(edu => `
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-lg font-semibold text-gray-800">${edu.degree || ''}</h4>
                                                <p class="text-gray-600">${edu.school || ''}</p>
                                            </div>
                                            <span class="text-sm text-gray-600 font-medium">${edu.year || ''}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Skills -->
                        ${(skills.technical || skills.soft) ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Compétences</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    ${skills.technical ? `
                                        <div>
                                            <h4 class="font-semibold text-gray-800 mb-2">Techniques</h4>
                                            <ul class="list-disc list-inside space-y-1 text-gray-700">
                                                ${skills.technical.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                    ${skills.soft ? `
                                        <div>
                                            <h4 class="font-semibold text-gray-800 mb-2">Interpersonnelles</h4>
                                            <ul class="list-disc list-inside space-y-1 text-gray-700">
                                                ${skills.soft.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Languages -->
                        ${data.languages ? `
                            <section>
                                <h3 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Langues</h3>
                                <p class="text-gray-700">${data.languages}</p>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },

    professional: {
        name: 'Professionnel',
        description: 'Layout à deux colonnes élégant',
        generate: (data) => {
            const personal = data.personal || {};
            const experiences = data.experiences || [];
            const education = data.education || [];
            const skills = data.skills || {};
            
            return `
                <div class="max-w-4xl mx-auto bg-white shadow-lg flex" style="min-height: 297mm; font-family: 'Inter', sans-serif;">
                    <!-- Left Column -->
                    <div class="w-1/3 bg-gray-800 text-white p-6">
                        <!-- Profile -->
                        <div class="text-center mb-8">
                            <div class="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <i class="fas fa-user text-4xl text-gray-300"></i>
                            </div>
                            <h1 class="text-2xl font-bold mb-2">${personal.firstName || ''} ${personal.lastName || ''}</h1>
                            <p class="text-gray-300">${personal.jobTitle || ''}</p>
                        </div>

                        <!-- Contact -->
                        <section class="mb-8">
                            <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">CONTACT</h3>
                            <div class="space-y-3 text-sm">
                                ${personal.email ? `
                                    <div class="flex items-center">
                                        <i class="fas fa-envelope w-5 mr-3 text-gray-400"></i>
                                        <span class="break-all">${personal.email}</span>
                                    </div>
                                ` : ''}
                                ${personal.phone ? `
                                    <div class="flex items-center">
                                        <i class="fas fa-phone w-5 mr-3 text-gray-400"></i>
                                        <span>${personal.phone}</span>
                                    </div>
                                ` : ''}
                                ${personal.address ? `
                                    <div class="flex items-center">
                                        <i class="fas fa-map-marker-alt w-5 mr-3 text-gray-400"></i>
                                        <span>${personal.address}</span>
                                    </div>
                                ` : ''}
                                ${personal.linkedin ? `
                                    <div class="flex items-center">
                                        <i class="fab fa-linkedin w-5 mr-3 text-gray-400"></i>
                                        <span>LinkedIn</span>
                                    </div>
                                ` : ''}
                            </div>
                        </section>

                        <!-- Skills -->
                        ${skills.technical ? `
                            <section class="mb-8">
                                <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">COMPÉTENCES TECHNIQUES</h3>
                                <div class="space-y-2 text-sm">
                                    ${skills.technical.split(',').map(skill => `
                                        <div class="flex items-center">
                                            <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                            <span>${skill.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${skills.soft ? `
                            <section class="mb-8">
                                <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">SOFT SKILLS</h3>
                                <div class="space-y-2 text-sm">
                                    ${skills.soft.split(',').map(skill => `
                                        <div class="flex items-center">
                                            <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                            <span>${skill.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Languages -->
                        ${data.languages ? `
                            <section>
                                <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">LANGUES</h3>
                                <div class="space-y-2 text-sm">
                                    ${data.languages.split(',').map(lang => `
                                        <div class="flex items-center">
                                            <div class="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            <span>${lang.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}
                    </div>

                    <!-- Right Column -->
                    <div class="w-2/3 p-8">
                        <!-- Summary -->
                        ${personal.summary ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4">PROFIL PROFESSIONNEL</h3>
                                <p class="text-gray-700 leading-relaxed">${personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience -->
                        ${experiences.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-6">EXPÉRIENCE PROFESSIONNELLE</h3>
                                <div class="space-y-6">
                                    ${experiences.map(exp => `
                                        <div class="relative pl-6 border-l-2 border-blue-600">
                                            <div class="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-0"></div>
                                            <div class="mb-2">
                                                <h4 class="text-xl font-semibold text-gray-800">${exp.position || ''}</h4>
                                                <p class="text-blue-600 font-medium">${exp.company || ''}</p>
                                                <span class="text-sm text-gray-600">${exp.startDate || ''} - ${exp.endDate || 'Présent'}</span>
                                            </div>
                                            ${exp.description ? `<p class="text-gray-700 leading-relaxed">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education -->
                        ${education.length > 0 ? `
                            <section>
                                <h3 class="text-2xl font-bold text-gray-800 mb-6">FORMATION</h3>
                                <div class="space-y-4">
                                    ${education.map(edu => `
                                        <div class="relative pl-6 border-l-2 border-green-600">
                                            <div class="absolute w-4 h-4 bg-green-600 rounded-full -left-2 top-0"></div>
                                            <h4 class="text-lg font-semibold text-gray-800">${edu.degree || ''}</h4>
                                            <p class="text-green-600 font-medium">${edu.school || ''}</p>
                                            <span class="text-sm text-gray-600">${edu.year || ''}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },

    minimal: {
        name: 'Minimaliste',
        description: 'Design épuré et moderne',
        generate: (data) => {
            const personal = data.personal || {};
            const experiences = data.experiences || [];
            const education = data.education || [];
            const skills = data.skills || {};
            
            return `
                <div class="max-w-4xl mx-auto bg-white shadow-lg" style="min-height: 297mm; font-family: 'Inter', sans-serif;">
                    <div class="p-12">
                        <!-- Header -->
                        <div class="mb-12">
                            <h1 class="text-5xl font-light text-gray-900 mb-2">${personal.firstName || ''} ${personal.lastName || ''}</h1>
                            <h2 class="text-2xl text-gray-600 mb-6">${personal.jobTitle || ''}</h2>
                            <div class="flex space-x-8 text-sm text-gray-600">
                                ${personal.email ? `<span>${personal.email}</span>` : ''}
                                ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                                ${personal.address ? `<span>${personal.address}</span>` : ''}
                            </div>
                        </div>

                        <!-- Summary -->
                        ${personal.summary ? `
                            <section class="mb-12">
                                <p class="text-lg text-gray-700 leading-relaxed font-light">${personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience -->
                        ${experiences.length > 0 ? `
                            <section class="mb-12">
                                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-8 border-b border-gray-200 pb-2">Expérience</h3>
                                <div class="space-y-8">
                                    ${experiences.map(exp => `
                                        <div>
                                            <div class="flex justify-between items-baseline mb-2">
                                                <h4 class="text-xl font-medium text-gray-900">${exp.position || ''}</h4>
                                                <span class="text-sm text-gray-500">${exp.startDate || ''} — ${exp.endDate || 'Présent'}</span>
                                            </div>
                                            <p class="text-gray-600 mb-3">${exp.company || ''}</p>
                                            ${exp.description ? `<p class="text-gray-700 leading-relaxed font-light">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education -->
                        ${education.length > 0 ? `
                            <section class="mb-12">
                                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-8 border-b border-gray-200 pb-2">Formation</h3>
                                <div class="space-y-6">
                                    ${education.map(edu => `
                                        <div class="flex justify-between items-baseline">
                                            <div>
                                                <h4 class="text-lg font-medium text-gray-900">${edu.degree || ''}</h4>
                                                <p class="text-gray-600">${edu.school || ''}</p>
                                            </div>
                                            <span class="text-sm text-gray-500">${edu.year || ''}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Skills -->
                        ${(skills.technical || skills.soft) ? `
                            <section class="mb-12">
                                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-8 border-b border-gray-200 pb-2">Compétences</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    ${skills.technical ? `
                                        <div>
                                            <h4 class="text-lg font-medium text-gray-900 mb-4">Techniques</h4>
                                            <div class="flex flex-wrap gap-2">
                                                ${skills.technical.split(',').map(skill => `
                                                    <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">${skill.trim()}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${skills.soft ? `
                                        <div>
                                            <h4 class="text-lg font-medium text-gray-900 mb-4">Interpersonnelles</h4>
                                            <div class="flex flex-wrap gap-2">
                                                ${skills.soft.split(',').map(skill => `
                                                    <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">${skill.trim()}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Languages -->
                        ${data.languages ? `
                            <section>
                                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-8 border-b border-gray-200 pb-2">Langues</h3>
                                <div class="flex flex-wrap gap-2">
                                    ${data.languages.split(',').map(lang => `
                                        <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">${lang.trim()}</span>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }
};

export class PaymentService {
    constructor() {
        this.apiEndpoints = {
            orange: 'https://api.orange.com/orange-money-webpay/dev/v1',
            wave: 'https://api.wave.com/v1/checkout/sessions',
            moov: 'https://api.moov-africa.com/v1/collections/request-to-pay'
        };
    }

    async processPayment(method, amount, phoneNumber = null) {
        // Simulation du processus de paiement
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simuler une réponse de paiement
                const success = Math.random() > 0.1; // 90% de chance de succès
                
                if (success) {
                    resolve({
                        success: true,
                        transactionId: this.generateTransactionId(),
                        method: method,
                        amount: amount,
                        phoneNumber: phoneNumber,
                        message: 'Paiement effectué avec succès'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Échec du paiement. Veuillez réessayer.'
                    });
                }
            }, 3000); // Simuler un délai de traitement
        });
    }

    async initiateOrangeMoneyPayment(amount, phoneNumber) {
        try {
            // Dans un vrai projet, vous feriez un appel API ici
            console.log('Initiation paiement Orange Money:', { amount, phoneNumber });
            
            // Simulation d'une réponse API
            return {
                success: true,
                paymentUrl: `https://webpayment.orange.com/pay?order_id=${this.generateOrderId()}`,
                orderId: this.generateOrderId(),
                message: 'Paiement Orange Money initié'
            };
        } catch (error) {
            console.error('Erreur Orange Money:', error);
            throw new Error('Erreur lors de l\'initialisation du paiement Orange Money');
        }
    }

    async initiateWavePayment(amount) {
        try {
            console.log('Initiation paiement Wave:', { amount });
            
            return {
                success: true,
                paymentUrl: `https://checkout.wave.com/pay?session_id=${this.generateOrderId()}`,
                sessionId: this.generateOrderId(),
                message: 'Paiement Wave initié'
            };
        } catch (error) {
            console.error('Erreur Wave:', error);
            throw new Error('Erreur lors de l\'initialisation du paiement Wave');
        }
    }

    async initiateMoovMoneyPayment(amount, phoneNumber) {
        try {
            console.log('Initiation paiement Moov Money:', { amount, phoneNumber });
            
            return {
                success: true,
                referenceId: this.generateOrderId(),
                message: 'Paiement Moov Money initié'
            };
        } catch (error) {
            console.error('Erreur Moov Money:', error);
            throw new Error('Erreur lors de l\'initialisation du paiement Moov Money');
        }
    }

    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateOrderId() {
        return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    validatePayment(transactionId) {
        // Validation du paiement côté serveur
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    valid: true,
                    transactionId: transactionId,
                    status: 'completed'
                });
            }, 1000);
        });
    }

    // Gestion des erreurs de paiement
    getPaymentErrorMessage(errorCode) {
        const errorMessages = {
            'INSUFFICIENT_FUNDS': 'Solde insuffisant',
            'INVALID_PHONE': 'Numéro de téléphone invalide',
            'TRANSACTION_FAILED': 'Transaction échouée',
            'NETWORK_ERROR': 'Erreur de réseau',
            'TIMEOUT': 'Délai d\'attente dépassé',
            'CANCELLED': 'Paiement annulé par l\'utilisateur'
        };

        return errorMessages[errorCode] || 'Erreur de paiement inconnue';
    }

    // Historique des transactions
    saveTransaction(transactionData) {
        const transactions = this.getTransactionHistory();
        transactions.push({
            ...transactionData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('mycv_transactions', JSON.stringify(transactions));
    }

    getTransactionHistory() {
        const stored = localStorage.getItem('mycv_transactions');
        return stored ? JSON.parse(stored) : [];
    }

    // Vérification du statut de paiement
    async checkPaymentStatus(transactionId) {
        // Vérification du statut auprès du fournisseur de paiement
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    transactionId: transactionId,
                    status: 'completed',
                    amount: 500,
                    currency: 'XOF'
                });
            }, 500);
        });
    }
}