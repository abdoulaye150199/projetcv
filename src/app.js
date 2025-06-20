import { CVGenerator } from './cv-generator.js';
import { CVAnalyzer } from './cv-analyzer.js';
import { CVImprover } from './cv-improver.js';
import { PaymentService } from './templates.js';

class MyCVApp {
    constructor() {
        this.cvGenerator = new CVGenerator();
        this.cvAnalyzer = new CVAnalyzer();
        this.cvImprover = new CVImprover();
        this.paymentService = new PaymentService();
        
        this.currentStep = 1;
        this.selectedTemplate = 'modern';
        this.cvData = {
            personal: {},
            experiences: [],
            education: [],
            skills: {},
            languages: ''
        };
        this.experienceCount = 0;
        this.educationCount = 0;
        this.zoomLevel = 0.75;
        this.selectedPaymentMethod = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupPaymentModal();
        this.loadSavedData();
    }

    setupEventListeners() {
        // Navigation tabs
        document.getElementById('homeTab').addEventListener('click', () => this.showSection('home'));
        document.getElementById('createTab').addEventListener('click', () => this.showSection('create'));
        document.getElementById('analyzeTab').addEventListener('click', () => this.showSection('analyze'));
        document.getElementById('improveTab').addEventListener('click', () => this.showSection('improve'));

        // Home section buttons
        document.getElementById('createNewCV').addEventListener('click', () => this.showSection('create'));
        document.getElementById('improveExistingCV').addEventListener('click', () => this.showSection('improve'));

        // CV Creation steps
        document.getElementById('nextToTemplate').addEventListener('click', () => this.nextStep());
        document.getElementById('backToInfo').addEventListener('click', () => this.previousStep());
        document.getElementById('generateCV').addEventListener('click', () => this.generateCV());
        document.getElementById('backToTemplate').addEventListener('click', () => this.goToStep(2));
        document.getElementById('newCV').addEventListener('click', () => this.resetForm());

        // Experience and Education
        document.getElementById('addExperience').addEventListener('click', () => this.addExperience());
        document.getElementById('addEducation').addEventListener('click', () => this.addEducation());

        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', () => this.selectTemplate(option.dataset.template));
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
        document.getElementById('zoomIn2').addEventListener('click', () => this.zoomIn('cvPreviewFinal'));
        document.getElementById('zoomOut2').addEventListener('click', () => this.zoomOut('cvPreviewFinal'));

        // Actions
        document.getElementById('downloadPDF').addEventListener('click', () => this.showPaymentModal());
        document.getElementById('printCV').addEventListener('click', () => this.printCV());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCV());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadCV());

        // CV Analysis
        document.getElementById('cvFile').addEventListener('change', (e) => this.handleFileUpload(e, 'analyze'));
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeCV());

        // CV Improvement
        document.getElementById('improveCvFile').addEventListener('change', (e) => this.handleFileUpload(e, 'improve'));
        document.getElementById('improveBtn').addEventListener('click', () => this.improveCV());

        // Form inputs for live preview
        this.setupLivePreview();
    }

    setupPaymentModal() {
        const paymentModal = document.getElementById('paymentModal');
        const closePaymentModal = document.getElementById('closePaymentModal');
        const cancelPayment = document.getElementById('cancelPayment');
        const processPayment = document.getElementById('processPayment');
        const paymentMethods = document.querySelectorAll('.payment-method');
        const phoneNumberSection = document.getElementById('phoneNumberSection');

        closePaymentModal.addEventListener('click', () => this.hidePaymentModal());
        cancelPayment.addEventListener('click', () => this.hidePaymentModal());

        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove selection from all methods
                paymentMethods.forEach(m => {
                    m.classList.remove('border-blue-500', 'bg-blue-50');
                    m.querySelector('.payment-radio').classList.remove('bg-blue-500', 'border-blue-500');
                    m.querySelector('.payment-radio').classList.add('border-gray-300');
                });

                // Select current method
                method.classList.add('border-blue-500', 'bg-blue-50');
                const radio = method.querySelector('.payment-radio');
                radio.classList.remove('border-gray-300');
                radio.classList.add('bg-blue-500', 'border-blue-500');

                this.selectedPaymentMethod = method.dataset.method;

                // Show phone number input for mobile money
                if (['orange', 'moov'].includes(this.selectedPaymentMethod)) {
                    phoneNumberSection.classList.remove('hidden');
                } else {
                    phoneNumberSection.classList.add('hidden');
                }

                processPayment.disabled = false;
            });
        });

        processPayment.addEventListener('click', () => this.processPayment());
    }

    showPaymentModal() {
        document.getElementById('paymentModal').classList.remove('hidden');
    }

    hidePaymentModal() {
        document.getElementById('paymentModal').classList.add('hidden');
        this.selectedPaymentMethod = null;
        document.getElementById('processPayment').disabled = true;
        
        // Reset payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('border-blue-500', 'bg-blue-50');
            method.querySelector('.payment-radio').classList.remove('bg-blue-500', 'border-blue-500');
            method.querySelector('.payment-radio').classList.add('border-gray-300');
        });
        
        document.getElementById('phoneNumberSection').classList.add('hidden');
    }

    async processPayment() {
        if (!this.selectedPaymentMethod) {
            alert('Veuillez sélectionner une méthode de paiement');
            return;
        }

        const processBtn = document.getElementById('processPayment');
        const spinner = document.getElementById('paymentSpinner');
        const btnText = document.getElementById('paymentBtnText');

        // Show loading state
        processBtn.disabled = true;
        spinner.classList.remove('hidden');
        btnText.textContent = 'Traitement...';

        try {
            let phoneNumber = null;
            if (['orange', 'moov'].includes(this.selectedPaymentMethod)) {
                phoneNumber = document.getElementById('paymentPhone').value;
                if (!phoneNumber) {
                    alert('Veuillez saisir votre numéro de téléphone');
                    return;
                }
            }

            const result = await this.paymentService.processPayment(
                this.selectedPaymentMethod, 
                500, 
                phoneNumber
            );

            if (result.success) {
                // Save transaction
                this.paymentService.saveTransaction(result);
                
                // Hide modal
                this.hidePaymentModal();
                
                // Show success message
                alert('Paiement effectué avec succès ! Votre CV va être téléchargé.');
                
                // Download CV
                await this.downloadPDF();
            } else {
                alert(result.message || 'Erreur lors du paiement');
            }
        } catch (error) {
            console.error('Erreur de paiement:', error);
            alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
        } finally {
            // Reset button state
            processBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Payer 500 FCFA';
        }
    }

    setupLivePreview() {
        const inputs = [
            'firstName', 'lastName', 'jobTitle', 'email', 'phone', 
            'address', 'linkedin', 'summary', 'technicalSkills', 
            'softSkills', 'languages'
        ];

        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', () => this.updatePreview());
            }
        });
    }

    setupFormValidation() {
        const requiredFields = ['firstName', 'lastName', 'jobTitle', 'email', 'phone', 'summary'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;
        
        if (isValid) {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
        } else {
            field.classList.remove('border-green-500');
            field.classList.add('border-red-500');
        }
        
        return isValid;
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('[id$="Section"]').forEach(sec => {
            sec.classList.add('hidden');
        });
        
        // Show selected section
        document.getElementById(section + 'Section').classList.remove('hidden');
        
        // Update tab states
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('text-primary-700', 'border-b-2', 'border-primary-500');
            tab.classList.add('text-gray-600');
        });
        
        const activeTab = document.getElementById(section + 'Tab');
        activeTab.classList.remove('text-gray-600');
        activeTab.classList.add('text-primary-700', 'border-b-2', 'border-primary-500');
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.collectFormData();
            this.currentStep++;
            this.updateStepIndicators();
            this.showStep(this.currentStep);
        }
    }

    previousStep() {
        this.currentStep--;
        this.updateStepIndicators();
        this.showStep(this.currentStep);
    }

    goToStep(step) {
        this.currentStep = step;
        this.updateStepIndicators();
        this.showStep(this.currentStep);
    }

    validateCurrentStep() {
        if (this.currentStep === 1) {
            const requiredFields = ['firstName', 'lastName', 'jobTitle', 'email', 'phone', 'summary'];
            let isValid = true;
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires');
            }
            
            return isValid;
        }
        
        return true;
    }

    updateStepIndicators() {
        for (let i = 1; i <= 3; i++) {
            const indicator = document.querySelector(`.step-indicator:nth-child(${i * 2 - 1}) .w-10`);
            const label = document.querySelector(`.step-indicator:nth-child(${i * 2 - 1}) span`);
            
            if (i <= this.currentStep) {
                indicator.classList.remove('bg-gray-400', 'text-gray-300');
                indicator.classList.add('bg-blue-600', 'text-white');
                label.classList.remove('text-gray-500');
                label.classList.add('text-primary-700', 'font-medium');
            } else {
                indicator.classList.remove('bg-blue-600', 'text-white');
                indicator.classList.add('bg-gray-400', 'text-gray-300');
                label.classList.remove('text-primary-700', 'font-medium');
                label.classList.add('text-gray-500');
            }
        }
    }

    showStep(step) {
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        document.getElementById(`step${step}`).classList.remove('hidden');
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

        // Skills
        this.cvData.skills = {
            technical: document.getElementById('technicalSkills').value,
            soft: document.getElementById('softSkills').value
        };

        // Languages
        this.cvData.languages = document.getElementById('languages').value;

        // Experiences
        this.cvData.experiences = [];
        document.querySelectorAll('.experience-item').forEach(item => {
            const exp = {
                position: item.querySelector('.exp-position').value,
                company: item.querySelector('.exp-company').value,
                startDate: item.querySelector('.exp-start').value,
                endDate: item.querySelector('.exp-end').value,
                description: item.querySelector('.exp-description').value
            };
            this.cvData.experiences.push(exp);
        });

        // Education
        this.cvData.education = [];
        document.querySelectorAll('.education-item').forEach(item => {
            const edu = {
                degree: item.querySelector('.edu-degree').value,
                school: item.querySelector('.edu-school').value,
                year: item.querySelector('.edu-year').value
            };
            this.cvData.education.push(edu);
        });
    }

    addExperience() {
        this.experienceCount++;
        const container = document.getElementById('experienceContainer');
        const experienceHTML = `
            <div class="experience-item bg-gray-50 p-4 rounded-lg border">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold text-gray-800">Expérience ${this.experienceCount}</h4>
                    <button type="button" class="text-red-600 hover:text-red-800" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" class="exp-position px-3 py-2 border rounded-lg" placeholder="Poste">
                    <input type="text" class="exp-company px-3 py-2 border rounded-lg" placeholder="Entreprise">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" class="exp-start px-3 py-2 border rounded-lg" placeholder="Date de début">
                    <input type="text" class="exp-end px-3 py-2 border rounded-lg" placeholder="Date de fin">
                </div>
                <textarea class="exp-description w-full px-3 py-2 border rounded-lg resize-none" rows="3" placeholder="Description des responsabilités et réalisations"></textarea>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', experienceHTML);
    }

    addEducation() {
        this.educationCount++;
        const container = document.getElementById('educationContainer');
        const educationHTML = `
            <div class="education-item bg-gray-50 p-4 rounded-lg border">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold text-gray-800">Formation ${this.educationCount}</h4>
                    <button type="button" class="text-red-600 hover:text-red-800" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" class="edu-degree px-3 py-2 border rounded-lg" placeholder="Diplôme">
                    <input type="text" class="edu-year px-3 py-2 border rounded-lg" placeholder="Année">
                </div>
                <input type="text" class="edu-school w-full px-3 py-2 border rounded-lg" placeholder="École/Université">
            </div>
        `;
        container.insertAdjacentHTML('beforeend', educationHTML);
    }

    selectTemplate(templateName) {
        this.selectedTemplate = templateName;
        
        // Update visual selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.querySelector(`[data-template="${templateName}"]`).classList.add('selected');
    }

    generateCV() {
        this.collectFormData();
        const cvHTML = this.cvGenerator.generateHTML(this.cvData, this.selectedTemplate);
        document.getElementById('cvPreviewFinal').innerHTML = cvHTML;
        this.nextStep();
    }

    updatePreview() {
        this.collectFormData();
        const cvHTML = this.cvGenerator.generateHTML(this.cvData, this.selectedTemplate);
        document.getElementById('cvPreview').innerHTML = cvHTML;
    }

    zoomIn(previewId = 'cvPreview') {
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 1.5);
        this.applyZoom(previewId);
    }

    zoomOut(previewId = 'cvPreview') {
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.3);
        this.applyZoom(previewId);
    }

    applyZoom(previewId) {
        const preview = document.getElementById(previewId);
        const scale = this.zoomLevel;
        const inverseScale = 1 / scale;
        
        preview.style.transform = `scale(${scale})`;
        preview.style.transformOrigin = 'top left';
        preview.style.width = `${inverseScale * 100}%`;
        preview.style.height = `${inverseScale * 100}%`;
    }

    async downloadPDF() {
        try {
            const element = document.getElementById('cvPreviewFinal');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
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
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Erreur lors de la génération du PDF');
        }
    }

    printCV() {
        const printWindow = window.open('', '_blank');
        const cvContent = document.getElementById('cvPreviewFinal').innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>CV - ${this.cvData.personal.firstName} ${this.cvData.personal.lastName}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${cvContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    saveCV() {
        const cvDataToSave = {
            ...this.cvData,
            template: this.selectedTemplate,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('mycv_data', JSON.stringify(cvDataToSave));
        alert('CV sauvegardé avec succès !');
    }

    loadCV() {
        const savedData = localStorage.getItem('mycv_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.cvData = data;
            this.selectedTemplate = data.template || 'modern';
            this.populateForm();
            alert('CV chargé avec succès !');
        } else {
            alert('Aucun CV sauvegardé trouvé');
        }
    }

    loadSavedData() {
        const savedData = localStorage.getItem('mycv_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.cvData = data;
            this.selectedTemplate = data.template || 'modern';
        }
    }

    populateForm() {
        // Populate personal information
        Object.keys(this.cvData.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.cvData.personal[key] || '';
            }
        });

        // Populate skills
        if (this.cvData.skills) {
            document.getElementById('technicalSkills').value = this.cvData.skills.technical || '';
            document.getElementById('softSkills').value = this.cvData.skills.soft || '';
        }

        // Populate languages
        document.getElementById('languages').value = this.cvData.languages || '';

        // Populate experiences
        this.cvData.experiences.forEach(() => {
            this.addExperience();
        });

        // Populate education
        this.cvData.education.forEach(() => {
            this.addEducation();
        });

        this.updatePreview();
    }

    resetForm() {
        this.cvData = {
            personal: {},
            experiences: [],
            education: [],
            skills: {},
            languages: ''
        };
        this.currentStep = 1;
        this.experienceCount = 0;
        this.educationCount = 0;
        
        // Clear form
        document.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        
        // Clear dynamic sections
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        
        this.updateStepIndicators();
        this.showStep(1);
        this.updatePreview();
    }

    async handleFileUpload(event, section) {
        const file = event.target.files[0];
        if (!file) return;

        const previewId = section === 'analyze' ? 'analyzedCvPreview' : 'improveCvPreview';
        const btnId = section === 'analyze' ? 'analyzeBtn' : 'improveBtn';
        
        // Show file info
        document.getElementById(previewId).innerHTML = `
            <div class="text-center">
                <i class="fas fa-file-alt text-4xl text-blue-600 mb-4"></i>
                <h4 class="font-semibold text-gray-800">${file.name}</h4>
                <p class="text-sm text-gray-600">Taille: ${(file.size / 1024).toFixed(1)} KB</p>
                <p class="text-sm text-gray-600">Type: ${file.type || 'Non spécifié'}</p>
            </div>
        `;
        
        // Enable analyze/improve button
        document.getElementById(btnId).disabled = false;
    }

    async analyzeCV() {
        const fileInput = document.getElementById('cvFile');
        const jobDescription = document.getElementById('jobDescription').value;
        
        if (!fileInput.files[0]) {
            alert('Veuillez sélectionner un fichier CV');
            return;
        }

        const analyzeBtn = document.getElementById('analyzeBtn');
        const spinner = document.getElementById('analyzeSpinner');
        const btnText = document.getElementById('analyzeBtnText');

        // Show loading state
        analyzeBtn.disabled = true;
        spinner.classList.remove('hidden');
        btnText.textContent = 'Analyse en cours...';

        try {
            const analysis = await this.cvAnalyzer.analyzeCV(fileInput.files[0], jobDescription);
            this.displayAnalysisResults(analysis);
        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            alert('Erreur lors de l\'analyse du CV');
        } finally {
            // Reset button state
            analyzeBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Analyser avec l\'IA';
        }
    }

    displayAnalysisResults(analysis) {
        // Show results section
        document.getElementById('analysisResults').classList.remove('hidden');

        // Update overall score
        document.getElementById('overallScore').textContent = analysis.overallScore;
        
        // Animate score circle
        const circle = document.getElementById('scoreCircle');
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (analysis.overallScore / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        // Score description
        let scoreDescription = '';
        if (analysis.overallScore >= 80) {
            scoreDescription = 'Excellent CV ! Très bien optimisé pour les ATS.';
        } else if (analysis.overallScore >= 60) {
            scoreDescription = 'Bon CV avec quelques améliorations possibles.';
        } else if (analysis.overallScore >= 40) {
            scoreDescription = 'CV correct mais nécessite des améliorations.';
        } else {
            scoreDescription = 'CV à améliorer significativement.';
        }
        document.getElementById('scoreDescription').textContent = scoreDescription;

        // Display detailed analysis
        const detailsContainer = document.getElementById('analysisDetails');
        detailsContainer.innerHTML = analysis.details.map(detail => `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold text-gray-800">${detail.category}</h4>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${
                        detail.score >= 80 ? 'bg-green-100 text-green-800' :
                        detail.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }">${detail.score}/100</span>
                </div>
                <p class="text-gray-600 mb-3">${detail.description}</p>
                ${detail.strengths.length > 0 ? `
                    <div class="mb-3">
                        <h5 class="font-medium text-green-700 mb-2">Points forts:</h5>
                        <ul class="list-disc list-inside text-sm text-green-600">
                            ${detail.strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${detail.issues.length > 0 ? `
                    <div>
                        <h5 class="font-medium text-red-700 mb-2">À améliorer:</h5>
                        <ul class="list-disc list-inside text-sm text-red-600">
                            ${detail.issues.map(issue => `<li>${issue}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Display recommendations
        const recommendationsContainer = document.getElementById('recommendations');
        recommendationsContainer.innerHTML = analysis.recommendations.map(rec => `
            <div class="border-l-4 ${
                rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
            } p-4 rounded-r-lg">
                <div class="flex items-center mb-2">
                    <span class="px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                    }">${rec.priority.toUpperCase()}</span>
                    <h4 class="font-semibold text-gray-800 ml-3">${rec.title}</h4>
                </div>
                <p class="text-gray-700 mb-2">${rec.description}</p>
                <p class="text-sm text-gray-600 italic">${rec.impact}</p>
            </div>
        `).join('');
    }

    async improveCV() {
        const fileInput = document.getElementById('improveCvFile');
        const targetJob = document.getElementById('targetJobDescription').value;
        const focusAreas = Array.from(document.querySelectorAll('.improvement-focus:checked')).map(cb => cb.value);
        
        if (!fileInput.files[0]) {
            alert('Veuillez sélectionner un fichier CV');
            return;
        }

        const improveBtn = document.getElementById('improveBtn');
        const spinner = document.getElementById('improveSpinner');
        const btnText = document.getElementById('improveBtnText');

        // Show loading state
        improveBtn.disabled = true;
        spinner.classList.remove('hidden');
        btnText.textContent = 'Génération en cours...';

        try {
            const improvements = await this.cvImprover.improveCV(fileInput.files[0], targetJob, focusAreas);
            this.displayImprovementResults(improvements);
        } catch (error) {
            console.error('Erreur lors de l\'amélioration:', error);
            alert('Erreur lors de l\'amélioration du CV');
        } finally {
            // Reset button state
            improveBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Générer les améliorations';
        }
    }

    displayImprovementResults(improvements) {
        // Show results section
        document.getElementById('improvementResults').classList.remove('hidden');

        // Display improvement summary
        const summaryContainer = document.getElementById('improvementSummary');
        summaryContainer.innerHTML = `
            <div class="text-center p-6 bg-blue-50 rounded-lg">
                <div class="text-3xl font-bold text-blue-600 mb-2">${improvements.suggestions?.length || 0}</div>
                <div class="text-sm text-blue-800">Suggestions d'amélioration</div>
            </div>
            <div class="text-center p-6 bg-green-50 rounded-lg">
                <div class="text-3xl font-bold text-green-600 mb-2">${improvements.atsImprovement || 0}%</div>
                <div class="text-sm text-green-800">Amélioration ATS potentielle</div>
            </div>
            <div class="text-center p-6 bg-purple-50 rounded-lg">
                <div class="text-3xl font-bold text-purple-600 mb-2">${improvements.improvementScore || 0}%</div>
                <div class="text-sm text-purple-800">Score d'amélioration</div>
            </div>
        `;

        // Display detailed improvements
        const detailedContainer = document.getElementById('detailedImprovements');
        if (improvements.suggestions) {
            detailedContainer.innerHTML = improvements.suggestions.map(suggestion => `
                <div class="border rounded-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-lg font-semibold text-gray-800">${suggestion.title}</h4>
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }">${suggestion.priority}</span>
                    </div>
                    <p class="text-gray-700 mb-4">${suggestion.description}</p>
                    ${suggestion.example ? `
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h5 class="font-medium text-gray-800 mb-3">Exemple d'amélioration:</h5>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h6 class="text-sm font-medium text-red-700 mb-2">Avant:</h6>
                                    <p class="text-sm text-gray-600 italic">${suggestion.example.before}</p>
                                </div>
                                <div>
                                    <h6 class="text-sm font-medium text-green-700 mb-2">Après:</h6>
                                    <p class="text-sm text-gray-600 italic">${suggestion.example.after}</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }

        // Display before/after comparison
        const comparisonContainer = document.getElementById('beforeAfterComparison');
        if (improvements.comparison) {
            comparisonContainer.innerHTML = `
                <div>
                    <h4 class="text-lg font-semibold text-red-700 mb-4">Avant amélioration</h4>
                    <ul class="space-y-2">
                        ${improvements.comparison.before.map(item => `
                            <li class="flex items-center text-red-600">
                                <i class="fas fa-times-circle mr-3"></i>
                                <span>${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-green-700 mb-4">Après amélioration</h4>
                    <ul class="space-y-2">
                        ${improvements.comparison.after.map(item => `
                            <li class="flex items-center text-green-600">
                                <i class="fas fa-check-circle mr-3"></i>
                                <span>${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MyCVApp();
});