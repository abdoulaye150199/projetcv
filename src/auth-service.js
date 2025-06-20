export class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Inscription
    async register(userData) {
        try {
            const { email, password, firstName, lastName, phone } = userData;
            
            // Vérifier si l'utilisateur existe déjà
            const existingUsers = this.getUsers();
            if (existingUsers.find(user => user.email === email)) {
                throw new Error('Un compte avec cet email existe déjà');
            }

            // Créer le nouvel utilisateur
            const newUser = {
                id: this.generateUserId(),
                email,
                password: this.hashPassword(password), // En production, utiliser bcrypt
                firstName,
                lastName,
                phone,
                createdAt: new Date().toISOString(),
                isVerified: true, // Pour la démo, on considère l'email vérifié
                subscription: {
                    type: 'free',
                    expiresAt: null,
                    features: ['basic_cv', 'basic_analysis']
                }
            };

            // Sauvegarder l'utilisateur
            existingUsers.push(newUser);
            localStorage.setItem('mycv_users', JSON.stringify(existingUsers));

            // Connecter automatiquement l'utilisateur
            this.currentUser = { ...newUser };
            delete this.currentUser.password; // Ne pas stocker le mot de passe en mémoire
            localStorage.setItem('mycv_current_user', JSON.stringify(this.currentUser));

            return {
                success: true,
                user: this.currentUser,
                message: 'Inscription réussie ! Bienvenue sur MyCV Pro.'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Connexion
    async login(email, password) {
        try {
            const users = this.getUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                throw new Error('Aucun compte trouvé avec cet email');
            }

            if (!this.verifyPassword(password, user.password)) {
                throw new Error('Mot de passe incorrect');
            }

            // Connecter l'utilisateur
            this.currentUser = { ...user };
            delete this.currentUser.password;
            localStorage.setItem('mycv_current_user', JSON.stringify(this.currentUser));

            return {
                success: true,
                user: this.currentUser,
                message: 'Connexion réussie ! Bon retour sur MyCV Pro.'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Déconnexion
    logout() {
        this.currentUser = null;
        localStorage.removeItem('mycv_current_user');
        return {
            success: true,
            message: 'Déconnexion réussie'
        };
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obtenir l'utilisateur actuel
    getCurrentUser() {
        return this.currentUser;
    }

    // Charger l'utilisateur actuel depuis le localStorage
    loadCurrentUser() {
        const stored = localStorage.getItem('mycv_current_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    // Obtenir tous les utilisateurs
    getUsers() {
        const stored = localStorage.getItem('mycv_users');
        return stored ? JSON.parse(stored) : [];
    }

    // Générer un ID utilisateur
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Hash du mot de passe (version simplifiée pour la démo)
    hashPassword(password) {
        // En production, utiliser bcrypt ou une autre méthode sécurisée
        return btoa(password + 'mycv_salt_2024');
    }

    // Vérifier le mot de passe
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    // Mettre à jour le profil utilisateur
    async updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('Utilisateur non connecté');
        }

        try {
            const users = this.getUsers();
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex === -1) {
                throw new Error('Utilisateur non trouvé');
            }

            // Mettre à jour les données
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('mycv_users', JSON.stringify(users));

            // Mettre à jour l'utilisateur actuel
            this.currentUser = { ...users[userIndex] };
            delete this.currentUser.password;
            localStorage.setItem('mycv_current_user', JSON.stringify(this.currentUser));

            return {
                success: true,
                user: this.currentUser,
                message: 'Profil mis à jour avec succès'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Changer le mot de passe
    async changePassword(currentPassword, newPassword) {
        if (!this.currentUser) {
            throw new Error('Utilisateur non connecté');
        }

        try {
            const users = this.getUsers();
            const user = users.find(u => u.id === this.currentUser.id);

            if (!user || !this.verifyPassword(currentPassword, user.password)) {
                throw new Error('Mot de passe actuel incorrect');
            }

            // Mettre à jour le mot de passe
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            users[userIndex].password = this.hashPassword(newPassword);
            localStorage.setItem('mycv_users', JSON.stringify(users));

            return {
                success: true,
                message: 'Mot de passe modifié avec succès'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Vérifier les permissions utilisateur
    hasPermission(feature) {
        if (!this.currentUser) return false;
        
        const userFeatures = this.currentUser.subscription?.features || [];
        return userFeatures.includes(feature);
    }

    // Mettre à niveau l'abonnement
    async upgradeSubscription(plan) {
        if (!this.currentUser) {
            throw new Error('Utilisateur non connecté');
        }

        const plans = {
            premium: {
                type: 'premium',
                features: ['basic_cv', 'basic_analysis', 'premium_templates', 'advanced_analysis', 'unlimited_downloads'],
                price: 500
            },
            pro: {
                type: 'pro',
                features: ['basic_cv', 'basic_analysis', 'premium_templates', 'advanced_analysis', 'unlimited_downloads', 'ai_suggestions', 'priority_support'],
                price: 1000
            }
        };

        const selectedPlan = plans[plan];
        if (!selectedPlan) {
            throw new Error('Plan non valide');
        }

        try {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mois

            const updates = {
                subscription: {
                    ...selectedPlan,
                    expiresAt: expiresAt.toISOString(),
                    purchasedAt: new Date().toISOString()
                }
            };

            return await this.updateProfile(updates);
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}