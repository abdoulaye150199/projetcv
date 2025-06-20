export class PaymentServiceEnhanced {
    constructor() {
        this.apiEndpoints = {
            orange: 'https://api.orange.com/orange-money-webpay/dev/v1',
            wave: 'https://api.wave.com/v1/checkout/sessions',
            moov: 'https://api.moov-africa.com/v1/collections/request-to-pay'
        };
        
        this.paymentPlans = {
            download: {
                name: 'Téléchargement PDF',
                price: 500,
                currency: 'XOF',
                features: ['Téléchargement PDF haute qualité']
            },
            premium: {
                name: 'Plan Premium',
                price: 2500,
                currency: 'XOF',
                features: [
                    'Templates premium',
                    'Analyse avancée IA',
                    'Téléchargements illimités',
                    'Support prioritaire'
                ]
            },
            pro: {
                name: 'Plan Pro',
                price: 5000,
                currency: 'XOF',
                features: [
                    'Tous les templates',
                    'IA avancée',
                    'Suggestions personnalisées',
                    'Analyse comparative',
                    'Support 24/7'
                ]
            }
        };
    }

    async processPayment(method, planType, phoneNumber = null, userInfo = null) {
        const plan = this.paymentPlans[planType];
        if (!plan) {
            throw new Error('Plan de paiement non valide');
        }

        try {
            let result;
            
            switch (method) {
                case 'orange':
                    result = await this.processOrangeMoneyPayment(plan, phoneNumber, userInfo);
                    break;
                case 'wave':
                    result = await this.processWavePayment(plan, userInfo);
                    break;
                case 'moov':
                    result = await this.processMoovMoneyPayment(plan, phoneNumber, userInfo);
                    break;
                default:
                    throw new Error('Méthode de paiement non supportée');
            }

            if (result.success) {
                // Enregistrer la transaction
                this.saveTransaction({
                    ...result,
                    plan: planType,
                    userInfo
                });
            }

            return result;
        } catch (error) {
            console.error('Erreur de paiement:', error);
            return {
                success: false,
                message: error.message || 'Erreur lors du traitement du paiement'
            };
        }
    }

    async processOrangeMoneyPayment(plan, phoneNumber, userInfo) {
        return new Promise((resolve) => {
            // Simulation du processus Orange Money
            setTimeout(() => {
                const success = Math.random() > 0.15; // 85% de succès
                
                if (success) {
                    resolve({
                        success: true,
                        transactionId: this.generateTransactionId(),
                        method: 'orange',
                        amount: plan.price,
                        currency: plan.currency,
                        phoneNumber,
                        plan: plan.name,
                        message: 'Paiement Orange Money réussi',
                        paymentDetails: {
                            operator: 'Orange Money',
                            reference: this.generateReference('OM'),
                            timestamp: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Paiement Orange Money échoué. Vérifiez votre solde et réessayez.'
                    });
                }
            }, 3000);
        });
    }

    async processWavePayment(plan, userInfo) {
        return new Promise((resolve) => {
            // Simulation du processus Wave
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% de succès
                
                if (success) {
                    resolve({
                        success: true,
                        transactionId: this.generateTransactionId(),
                        method: 'wave',
                        amount: plan.price,
                        currency: plan.currency,
                        plan: plan.name,
                        message: 'Paiement Wave réussi',
                        paymentDetails: {
                            operator: 'Wave',
                            reference: this.generateReference('WV'),
                            timestamp: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Paiement Wave échoué. Veuillez réessayer.'
                    });
                }
            }, 2500);
        });
    }

    async processMoovMoneyPayment(plan, phoneNumber, userInfo) {
        return new Promise((resolve) => {
            // Simulation du processus Moov Money
            setTimeout(() => {
                const success = Math.random() > 0.2; // 80% de succès
                
                if (success) {
                    resolve({
                        success: true,
                        transactionId: this.generateTransactionId(),
                        method: 'moov',
                        amount: plan.price,
                        currency: plan.currency,
                        phoneNumber,
                        plan: plan.name,
                        message: 'Paiement Moov Money réussi',
                        paymentDetails: {
                            operator: 'Moov Money',
                            reference: this.generateReference('MM'),
                            timestamp: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Paiement Moov Money échoué. Vérifiez votre numéro et votre solde.'
                    });
                }
            }, 3500);
        });
    }

    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    generateReference(prefix) {
        return prefix + '_' + Date.now().toString().slice(-8) + '_' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    saveTransaction(transactionData) {
        const transactions = this.getTransactionHistory();
        transactions.push({
            ...transactionData,
            timestamp: new Date().toISOString(),
            status: 'completed'
        });
        localStorage.setItem('mycv_transactions', JSON.stringify(transactions));
    }

    getTransactionHistory() {
        const stored = localStorage.getItem('mycv_transactions');
        return stored ? JSON.parse(stored) : [];
    }

    getUserTransactions(userId) {
        const allTransactions = this.getTransactionHistory();
        return allTransactions.filter(t => t.userInfo?.id === userId);
    }

    async verifyPayment(transactionId) {
        // Simulation de vérification
        return new Promise((resolve) => {
            setTimeout(() => {
                const transactions = this.getTransactionHistory();
                const transaction = transactions.find(t => t.transactionId === transactionId);
                
                resolve({
                    valid: !!transaction,
                    transaction: transaction || null,
                    status: transaction ? 'verified' : 'not_found'
                });
            }, 1000);
        });
    }

    formatAmount(amount, currency = 'XOF') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    }

    getPaymentMethods() {
        return [
            {
                id: 'orange',
                name: 'Orange Money',
                logo: '🟠',
                description: 'Paiement sécurisé avec Orange Money',
                requiresPhone: true,
                countries: ['CI', 'SN', 'ML', 'BF']
            },
            {
                id: 'wave',
                name: 'Wave',
                logo: '🌊',
                description: 'Paiement rapide avec Wave',
                requiresPhone: false,
                countries: ['CI', 'SN']
            },
            {
                id: 'moov',
                name: 'Moov Money',
                logo: '🔵',
                description: 'Paiement mobile avec Moov Money',
                requiresPhone: true,
                countries: ['CI', 'BF', 'TG']
            }
        ];
    }
}