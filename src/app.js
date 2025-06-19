import { CVGenerator } from './cv-generator.js';
import { CVAnalyzer } from './cv-analyzer.js';
import { templates } from './templates.js';

class CVApp {
    constructor() {
        this.currentStep = 1;
        this.selectedTemplate = 'modern';
        this.currentTab = 'create';
        this.cvData = {
            personal: {},
            experience: [],
            education: [],
            skills: {},
            languages: ''
        };
        this.cvGenerator = new CVGenerator();
        this.cvAnalyzer = new CVAnalyzer();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFromStorage();
        this.addDefaultExperience();
        this.addDefaultEducation();
    }

    bindEvents() {
        // Tab navigation
        document.getElementById('createTab').addEventListener('click', () => this.switchTab('create'));
        document.getElementById('analyzeTab').addEventListener('click', () => this.switchTab('analyze'));

        // Create CV navigation
        document.getElementById('nextToTemplate').addEventListener('click', () => this.goToStep(2));
        document.getElementById('backToInfo').addEventListener('click', () => this.goToStep(1));
        document.getElementById('generateCV').addEventListener('click', () => this.generateCV());
        document.getElementById('backToTemplate').addEventListener('click', () => this.goToStep(2));
        document.getElementById('newCV').addEventListener('click', () => this.resetForm());

        // Experience and Education
        document.getElementById('addExperience').addEventListener('click', () => this.addExperience());
        document.getElementById('addEducation').addEventListener('click', () => this.addEducation());

        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectTemplate(e.currentTarget.dataset.template));
        });

        // Form inputs - live preview
        this.bindFormInputs();

        // Actions
        document.getElementById('downloadPDF').addEventListener('click', () => this.downloadPDF());
        document.getElementById('printCV').addEventListener('click', () => this.printCV());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveToStorage());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadFromStorage());

        // Zoom controls
        document.querySelectorAll('#zoomIn').forEach(btn => {
            btn.addEventListener('click', () => this.zoomPreview(1.1));
        });
        document.querySelectorAll('#zoomOut').forEach(btn => {
            btn.addEventListener('click', () => this.zoomPreview(0.9));
        });

        // CV Analysis
        document.getElementById('cvFile').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeCV());
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active', 'border-white', 'text-white');
            btn.classList.add('border-transparent', 'text-white/70');
        });
        
        const activeTab = document.getElementById(`${tab}Tab`);
        activeTab.classList.add('active', 'border-white', 'text-white');
        activeTab.classList.remove('border-transparent', 'text-white/70');

        // Show/hide sections
        document.getElementById('createSection').classList.toggle('hidden', tab !== 'create');
        document.getElementById('analyzeSection').classList.toggle('hidden', tab !== 'analyze');
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = false;

        // Show file info with clean styling
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(2);
        const fileInfo = document.createElement('div');
        fileInfo.className = 'mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-up';
        fileInfo.innerHTML = `
            <div class="flex items-center">
                <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                    <i class="fas fa-file-alt text-white"></i>
                </div>
                <div>
                    <p class="font-semibold text-green-800">Fichier sélectionné</p>
                    <p class="text-green-700">${fileName} (${fileSize} KB)</p>
                </div>
            </div>
        `;
        
        // Remove previous file info
        const existingInfo = event.target.closest('.bg-white').querySelector('.file-info');
        if (existingInfo) existingInfo.remove();
        
        fileInfo.classList.add('file-info');
        event.target.closest('.bg-white').appendChild(fileInfo);

        // Read file content for preview
        this.readFileContent(file);
    }

    readFileContent(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const content = e.target.result;
            
            let previewContent = '';
            if (file.type === 'text/plain') {
                previewContent = content;
            } else {
                previewContent = `📄 ${file.name}\n📊 Type: ${file.type}\n📏 Taille: ${(file.size / 1024).toFixed(2)} KB\n\n✨ Fichier prêt pour l'analyse IA`;
            }

            // Update preview with clean styling
            document.getElementById('analyzedCvPreview').innerHTML = `
                <div class="p-8 text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto bg-blue-50 rounded-xl">
                    <div class="mb-4 p-4 bg-white rounded-lg shadow-sm">
                        <h4 class="font-bold text-blue-900 mb-2 flex items-center">
                            <i class="fas fa-file-alt mr-2"></i>
                            Aperçu du fichier
                        </h4>
                        <div class="text-gray-800">${previewContent.substring(0, 2000)}${previewContent.length > 2000 ? '...' : ''}</div>
                    </div>
                </div>
            `;
        };

        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }

    async analyzeCV() {
        const fileInput = document.getElementById('cvFile');
        const jobDescription = document.getElementById('jobDescription').value;
        const analyzeBtn = document.getElementById('analyzeBtn');
        const spinner = document.getElementById('analyzeSpinner');
        const btnText = document.getElementById('analyzeBtnText');

        if (!fileInput.files[0]) {
            this.showError('Veuillez sélectionner un fichier CV');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        spinner.classList.remove('hidden');
        btnText.textContent = 'Analyse IA en cours...';
        analyzeBtn.classList.add('animate-pulse');

        try {
            // Show progress message
            this.showInfo('🤖 L\'IA analyse votre CV...');
            
            const file = fileInput.files[0];
            const analysisResult = await this.cvAnalyzer.analyzeCV(file, jobDescription);
            
            this.displayAnalysisResults(analysisResult);
            this.showSuccess('✨ Analyse terminée avec succès !');
            
        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            this.showError('❌ Erreur lors de l\'analyse du CV. Veuillez réessayer.');
        } finally {
            // Reset button state
            analyzeBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Analyser avec l\'IA';
            analyzeBtn.classList.remove('animate-pulse');
        }
    }

    displayAnalysisResults(results) {
        const resultsSection = document.getElementById('analysisResults');
        const scoreElement = document.getElementById('overallScore');
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreDescription = document.getElementById('scoreDescription');
        const analysisDetails = document.getElementById('analysisDetails');
        const recommendations = document.getElementById('recommendations');

        // Show results section with animation
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('animate-slide-up');

        // Animate score
        const targetScore = results.overallScore;
        const circumference = 2 * Math.PI * 70; // radius = 70
        const offset = circumference - (targetScore / 100) * circumference;
        
        setTimeout(() => {
            scoreCircle.style.strokeDashoffset = offset;
            this.animateNumber(scoreElement, 0, targetScore, 2000);
        }, 300);

        // Score description with color coding
        scoreDescription.textContent = this.getScoreDescription(targetScore);
        scoreDescription.className = `mt-2 text-lg font-medium ${this.getScoreTextColor(targetScore)}`;

        // Clean analysis details
        analysisDetails.innerHTML = results.details.map(detail => `
            <div class="analysis-item bg-gray-50 rounded-xl p-6 border-l-4 ${this.getScoreColor(detail.score, 'border')} card-hover">
                <div class="flex justify-between items-start mb-4">
                    <h5 class="text-xl font-bold text-gray-900 flex items-center">
                        <i class="${this.getCategoryIcon(detail.category)} mr-3 ${this.getScoreColor(detail.score, 'text')}"></i>
                        ${detail.category}
                    </h5>
                    <div class="text-right">
                        <span class="text-2xl font-bold ${this.getScoreColor(detail.score, 'text')}">${detail.score}</span>
                        <span class="text-gray-500">/100</span>
                    </div>
                </div>
                <p class="text-gray-700 mb-4">${detail.description}</p>
                
                ${detail.strengths && detail.strengths.length > 0 ? `
                    <div class="mb-3">
                        <h6 class="font-semibold text-green-800 mb-2 flex items-center">
                            <i class="fas fa-check-circle mr-2"></i>Points forts
                        </h6>
                        <ul class="text-sm text-green-700 space-y-1">
                            ${detail.strengths.map(strength => `<li class="flex items-start"><i class="fas fa-plus text-green-500 mr-2 mt-1"></i>${strength}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${detail.issues && detail.issues.length > 0 ? `
                    <div class="mb-4">
                        <h6 class="font-semibold text-orange-800 mb-2 flex items-center">
                            <i class="fas fa-exclamation-triangle mr-2"></i>À améliorer
                        </h6>
                        <ul class="text-sm text-orange-700 space-y-1">
                            ${detail.issues.map(issue => `<li class="flex items-start"><i class="fas fa-arrow-right text-orange-500 mr-2 mt-1"></i>${issue}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div class="h-3 rounded-full ${this.getScoreColor(detail.score, 'bg')} transition-all duration-1000 ease-out" style="width: ${detail.score}%"></div>
                </div>
            </div>
        `).join('');

        // Clean recommendations
        recommendations.innerHTML = results.recommendations.map(rec => `
            <div class="flex items-start space-x-4 p-6 ${this.getPriorityBg(rec.priority)} rounded-xl border-l-4 ${this.getPriorityBorder(rec.priority)} card-hover">
                <div class="w-12 h-12 ${this.getPriorityIconBg(rec.priority)} rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="${this.getPriorityIcon(rec.priority)} text-white"></i>
                </div>
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <h6 class="font-bold ${this.getPriorityTextColor(rec.priority)} text-lg">${rec.title}</h6>
                        <span class="ml-3 px-3 py-1 text-xs font-semibold ${this.getPriorityBadge(rec.priority)} rounded-full">
                            ${rec.priority === 'high' ? 'PRIORITÉ HAUTE' : rec.priority === 'medium' ? 'PRIORITÉ MOYENNE' : 'PRIORITÉ BASSE'}
                        </span>
                    </div>
                    <p class="text-gray-700 mb-2">${rec.description}</p>
                    ${rec.impact ? `
                        <p class="text-sm text-gray-600 italic flex items-center">
                            <i class="fas fa-chart-line mr-2"></i>
                            Impact: ${rec.impact}
                        </p>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Add ATS compatibility and keyword analysis if available
        if (results.atsCompatibility) {
            this.displayATSCompatibility(results.atsCompatibility);
        }

        if (results.keywordAnalysis) {
            this.displayKeywordAnalysis(results.keywordAnalysis);
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'Structure et Format': 'fas fa-sitemap',
            'Mots-clés et Optimisation ATS': 'fas fa-search',
            'Contenu et Expérience': 'fas fa-file-alt',
            'Compétences et Qualifications': 'fas fa-cogs',
            'Impact et Résultats': 'fas fa-chart-line',
            'Longueur et Format': 'fas fa-ruler',
            'Compétences Techniques': 'fas fa-code'
        };
        return icons[category] || 'fas fa-info-circle';
    }

    getScoreColor(score, type) {
        const colors = {
            high: { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-500' },
            medium: { border: 'border-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-500' },
            low: { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-500' }
        };

        const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
        return colors[level][type];
    }

    getScoreTextColor(score) {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-green-500';
        if (score >= 70) return 'text-yellow-600';
        if (score >= 60) return 'text-orange-600';
        return 'text-red-600';
    }

    getPriorityBg(priority) {
        const backgrounds = {
            high: 'bg-red-50',
            medium: 'bg-yellow-50',
            low: 'bg-blue-50'
        };
        return backgrounds[priority] || backgrounds.medium;
    }

    getPriorityBorder(priority) {
        const borders = {
            high: 'border-red-500',
            medium: 'border-yellow-500',
            low: 'border-blue-500'
        };
        return borders[priority] || borders.medium;
    }

    getPriorityIconBg(priority) {
        const backgrounds = {
            high: 'bg-red-500',
            medium: 'bg-yellow-500',
            low: 'bg-blue-500'
        };
        return backgrounds[priority] || backgrounds.medium;
    }

    getPriorityIcon(priority) {
        const icons = {
            high: 'fas fa-exclamation-triangle',
            medium: 'fas fa-info-circle',
            low: 'fas fa-lightbulb'
        };
        return icons[priority] || icons.medium;
    }

    getPriorityTextColor(priority) {
        const colors = {
            high: 'text-red-800',
            medium: 'text-yellow-800',
            low: 'text-blue-800'
        };
        return colors[priority] || colors.medium;
    }

    getPriorityBadge(priority) {
        const badges = {
            high: 'bg-red-200 text-red-800',
            medium: 'bg-yellow-200 text-yellow-800',
            low: 'bg-blue-200 text-blue-800'
        };
        return badges[priority] || badges.medium;
    }

    getScoreDescription(score) {
        if (score >= 90) return '🎉 Excellent - Votre CV est parfaitement optimisé pour les ATS';
        if (score >= 80) return '✅ Très bon - Quelques améliorations mineures possibles';
        if (score >= 70) return '👍 Bon - Votre CV nécessite quelques optimisations';
        if (score >= 60) return '⚠️ Moyen - Des améliorations importantes sont recommandées';
        return '❌ Faible - Votre CV nécessite une refonte majeure pour les ATS';
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    bindFormInputs() {
        const inputs = [
            'firstName', 'lastName', 'jobTitle', 'email', 'phone', 
            'address', 'linkedin', 'summary', 'technicalSkills', 
            'softSkills', 'languages'
        ];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updatePreview());
            }
        });
    }

    goToStep(step) {
        // Validate current step
        if (step > this.currentStep && !this.validateCurrentStep()) {
            return;
        }

        // Hide all steps
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show target step
        document.getElementById(`step${step}`).classList.remove('hidden');

        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNum = index + 1;
            const circle = indicator.querySelector('div');
            const text = indicator.querySelector('span');

            if (stepNum <= step) {
                circle.classList.remove('bg-gray-400');
                circle.classList.add('bg-blue-600', 'shadow-lg');
                text.classList.remove('text-gray-300');
                text.classList.add('text-white');
                indicator.classList.add('active');
            } else {
                circle.classList.remove('bg-blue-600', 'shadow-lg');
                circle.classList.add('bg-gray-400');
                text.classList.remove('text-white');
                text.classList.add('text-gray-300');
                indicator.classList.remove('active');
            }
        });

        this.currentStep = step;
        this.updatePreview();
    }

    validateCurrentStep() {
        if (this.currentStep === 1) {
            const required = ['firstName', 'lastName', 'jobTitle', 'email', 'phone', 'summary'];
            for (let field of required) {
                const element = document.getElementById(field);
                if (!element.value.trim()) {
                    element.focus();
                    element.classList.add('border-red-500', 'ring-2', 'ring-red-200');
                    this.showError(`Le champ ${this.getFieldLabel(field)} est requis`);
                    
                    // Remove error styling after 3 seconds
                    setTimeout(() => {
                        element.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
                    }, 3000);
                    
                    return false;
                }
            }
        }
        return true;
    }

    getFieldLabel(field) {
        const labels = {
            firstName: 'Prénom',
            lastName: 'Nom',
            jobTitle: 'Titre professionnel',
            email: 'Email',
            phone: 'Téléphone',
            summary: 'Résumé professionnel'
        };
        return labels[field] || field;
    }

    selectTemplate(template) {
        this.selectedTemplate = template;
        
        // Update visual selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('border-blue-500', 'bg-blue-50', 'shadow-xl', 'scale-105');
            option.classList.add('border-gray-200');
        });

        const selectedOption = document.querySelector(`[data-template="${template}"]`);
        selectedOption.classList.remove('border-gray-200');
        selectedOption.classList.add('border-blue-500', 'bg-blue-50', 'shadow-xl', 'scale-105');

        this.updatePreview();
    }

    addExperience() {
        const container = document.getElementById('experienceContainer');
        const index = container.children.length;
        
        const experienceHTML = `
            <div class="experience-item bg-blue-50 border border-blue-200 rounded-xl p-6 card-hover animate-slide-up">
                <div class="flex justify-between items-start mb-6">
                    <h4 class="text-xl font-bold text-gray-900 flex items-center">
                        <i class="fas fa-briefcase mr-3 text-blue-500"></i>
                        Expérience ${index + 1}
                    </h4>
                    <button class="remove-experience w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Poste</label>
                        <input type="text" class="exp-position w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300">
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Entreprise</label>
                        <input type="text" class="exp-company w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
                        <input type="text" class="exp-start-date w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300" placeholder="MM/YYYY">
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                        <input type="text" class="exp-end-date w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300" placeholder="MM/YYYY ou Présent">
                    </div>
                </div>
                <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea class="exp-description w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none" rows="4" placeholder="Décrivez vos responsabilités et réalisations avec des chiffres..."></textarea>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', experienceHTML);
        
        // Bind events for new item
        const newItem = container.lastElementChild;
        newItem.querySelector('.remove-experience').addEventListener('click', () => {
            newItem.style.transform = 'translateX(-100%)';
            newItem.style.opacity = '0';
            setTimeout(() => {
                newItem.remove();
                this.updatePreview();
            }, 300);
        });

        // Bind input events
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
    }

    addEducation() {
        const container = document.getElementById('educationContainer');
        const index = container.children.length;
        
        const educationHTML = `
            <div class="education-item bg-green-50 border border-green-200 rounded-xl p-6 card-hover animate-slide-up">
                <div class="flex justify-between items-start mb-6">
                    <h4 class="text-xl font-bold text-gray-900 flex items-center">
                        <i class="fas fa-graduation-cap mr-3 text-green-500"></i>
                        Formation ${index + 1}
                    </h4>
                    <button class="remove-education w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Diplôme</label>
                        <input type="text" class="edu-degree w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300">
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Établissement</label>
                        <input type="text" class="edu-institution w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Année</label>
                        <input type="text" class="edu-year w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300" placeholder="YYYY">
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Lieu</label>
                        <input type="text" class="edu-location w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300">
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', educationHTML);
        
        // Bind events for new item
        const newItem = container.lastElementChild;
        newItem.querySelector('.remove-education').addEventListener('click', () => {
            newItem.style.transform = 'translateX(-100%)';
            newItem.style.opacity = '0';
            setTimeout(() => {
                newItem.remove();
                this.updatePreview();
            }, 300);
        });

        // Bind input events
        newItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
    }

    addDefaultExperience() {
        this.addExperience();
    }

    addDefaultEducation() {
        this.addEducation();
    }

    collectFormData() {
        // Personal information
        this.cvData.personal = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            linkedin: document.getElementById('linkedin').value,
            summary: document.getElementById('summary').value
        };

        // Experience
        this.cvData.experience = [];
        document.querySelectorAll('.experience-item').forEach(item => {
            const exp = {
                position: item.querySelector('.exp-position').value,
                company: item.querySelector('.exp-company').value,
                startDate: item.querySelector('.exp-start-date').value,
                endDate: item.querySelector('.exp-end-date').value,
                description: item.querySelector('.exp-description').value
            };
            if (exp.position || exp.company) {
                this.cvData.experience.push(exp);
            }
        });

        // Education
        this.cvData.education = [];
        document.querySelectorAll('.education-item').forEach(item => {
            const edu = {
                degree: item.querySelector('.edu-degree').value,
                institution: item.querySelector('.edu-institution').value,
                year: item.querySelector('.edu-year').value,
                location: item.querySelector('.edu-location').value
            };
            if (edu.degree || edu.institution) {
                this.cvData.education.push(edu);
            }
        });

        // Skills
        this.cvData.skills = {
            technical: document.getElementById('technicalSkills').value,
            soft: document.getElementById('softSkills').value
        };

        // Languages
        this.cvData.languages = document.getElementById('languages').value;
    }

    updatePreview() {
        if (this.currentTab !== 'create') return;
        
        this.collectFormData();
        const html = this.cvGenerator.generateHTML(this.cvData, this.selectedTemplate);
        document.getElementById('cvPreview').innerHTML = html;
    }

    generateCV() {
        this.collectFormData();
        this.updatePreview();
        this.goToStep(3);
    }

    async downloadPDF() {
        const { jsPDF } = window.jspdf;
        const cvElement = document.getElementById('cvPreview');
        
        try {
            this.showInfo('📄 Génération du PDF en cours...');
            
            const canvas = await html2canvas(cvElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            const fileName = `CV_${this.cvData.personal.firstName}_${this.cvData.personal.lastName}.pdf`;
            pdf.save(fileName);
            
            this.showSuccess('✅ PDF téléchargé avec succès !');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            this.showError('❌ Erreur lors de la génération du PDF');
        }
    }

    printCV() {
        window.print();
    }

    saveToStorage() {
        const data = {
            cvData: this.cvData,
            selectedTemplate: this.selectedTemplate
        };
        localStorage.setItem('cvGenerator_data', JSON.stringify(data));
        this.showSuccess('💾 Données sauvegardées avec succès');
    }

    loadFromStorage() {
        const saved = localStorage.getItem('cvGenerator_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.cvData = data.cvData || this.cvData;
                this.selectedTemplate = data.selectedTemplate || this.selectedTemplate;
                this.fillFormFromData();
                this.showSuccess('📂 Données chargées avec succès');
            } catch (error) {
                this.showError('❌ Erreur lors du chargement des données');
            }
        } else {
            this.showInfo('ℹ️ Aucune donnée sauvegardée trouvée');
        }
    }

    fillFormFromData() {
        // Fill personal information
        Object.keys(this.cvData.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element && this.cvData.personal[key]) {
                element.value = this.cvData.personal[key];
            }
        });

        // Fill skills
        if (this.cvData.skills.technical) {
            document.getElementById('technicalSkills').value = this.cvData.skills.technical;
        }
        if (this.cvData.skills.soft) {
            document.getElementById('softSkills').value = this.cvData.skills.soft;
        }

        // Fill languages
        if (this.cvData.languages) {
            document.getElementById('languages').value = this.cvData.languages;
        }

        // Update template selection
        this.selectTemplate(this.selectedTemplate);
        this.updatePreview();
    }

    resetForm() {
        this.cvData = {
            personal: {},
            experience: [],
            education: [],
            skills: {},
            languages: ''
        };
        
        document.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        
        this.addDefaultExperience();
        this.addDefaultEducation();
        
        this.goToStep(1);
        this.updatePreview();
        
        this.showSuccess('🔄 Formulaire réinitialisé');
    }

    zoomPreview(factor) {
        const preview = document.getElementById('cvPreview');
        const currentScale = parseFloat(preview.style.transform.match(/scale\((.*?)\)/)?.[1] || '0.75');
        const newScale = Math.max(0.5, Math.min(1.2, currentScale * factor));
        preview.style.transform = `scale(${newScale})`;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        const colors = {
            error: 'bg-red-500 border-red-400',
            success: 'bg-green-500 border-green-400',
            info: 'bg-blue-500 border-blue-400'
        };
        
        notification.className = `fixed top-6 right-6 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl z-50 border animate-slide-up max-w-md`;
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="mr-3">
                    ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                      type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                      '<i class="fas fa-info-circle"></i>'}
                </div>
                <div class="flex-1">${message}</div>
                <button class="ml-3 text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    displayATSCompatibility(atsData) {
        const container = document.createElement('div');
        container.className = 'mt-8';
        container.innerHTML = `
            <h4 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-robot mr-3 text-purple-500"></i>
                Compatibilité ATS
            </h4>
            <div class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500 card-hover">
                <div class="flex justify-between items-center mb-4">
                    <h5 class="text-lg font-semibold text-purple-900">Score de compatibilité</h5>
                    <div class="text-right">
                        <span class="text-2xl font-bold text-purple-700">${atsData.score}</span>
                        <span class="text-gray-500">/100</span>
                    </div>
                </div>
                
                ${atsData.issues.length > 0 ? `
                    <div class="mb-4">
                        <h6 class="font-semibold text-purple-800 mb-2 flex items-center">
                            <i class="fas fa-exclamation-circle mr-2"></i>Problèmes détectés
                        </h6>
                        <ul class="text-sm text-purple-700 space-y-1">
                            ${atsData.issues.map(issue => `
                                <li class="flex items-start">
                                    <i class="fas fa-times-circle text-purple-500 mr-2 mt-1"></i>${issue}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${atsData.recommendations.length > 0 ? `
                    <div>
                        <h6 class="font-semibold text-purple-800 mb-2 flex items-center">
                            <i class="fas fa-lightbulb mr-2"></i>Recommandations
                        </h6>
                        <ul class="text-sm text-purple-700 space-y-1">
                            ${atsData.recommendations.map(rec => `
                                <li class="flex items-start">
                                    <i class="fas fa-arrow-right text-purple-500 mr-2 mt-1"></i>${rec}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('analysisDetails').appendChild(container);
    }

    displayKeywordAnalysis(keywordData) {
        const container = document.createElement('div');
        container.className = 'mt-8';
        container.innerHTML = `
            <h4 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-tags mr-3 text-blue-500"></i>
                Analyse des mots-clés
            </h4>
            <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 card-hover">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h6 class="font-semibold text-blue-800 mb-3 flex items-center">
                            <i class="fas fa-check-circle mr-2"></i>Mots-clés présents
                        </h6>
                        <div class="flex flex-wrap gap-2">
                            ${keywordData.matchedKeywords.map(keyword => `
                                <span class="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                                    ${keyword}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h6 class="font-semibold text-blue-800 mb-3 flex items-center">
                            <i class="fas fa-plus-circle mr-2"></i>Mots-clés suggérés
                        </h6>
                        <div class="flex flex-wrap gap-2">
                            ${keywordData.missingKeywords.map(keyword => `
                                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-300">
                                    ${keyword}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                ${keywordData.suggestions.length > 0 ? `
                    <div class="mt-6">
                        <h6 class="font-semibold text-blue-800 mb-3 flex items-center">
                            <i class="fas fa-lightbulb mr-2"></i>Suggestions d'amélioration
                        </h6>
                        <ul class="text-sm text-blue-700 space-y-1">
                            ${keywordData.suggestions.map(suggestion => `
                                <li class="flex items-start">
                                    <i class="fas fa-arrow-right text-blue-500 mr-2 mt-1"></i>${suggestion}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('analysisDetails').appendChild(container);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new CVApp();
});