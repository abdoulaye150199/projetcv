export const templates = {
    modern: {
        name: 'Moderne',
        generate: (data) => {
            const fullName = `${data.personal.firstName} ${data.personal.lastName}`.trim();
            
            return `
                <div class="bg-white min-h-screen font-sans text-gray-800 leading-relaxed">
                    <!-- Header Section -->
                    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                        <div class="max-w-4xl mx-auto">
                            <h1 class="text-4xl font-bold mb-2">${fullName}</h1>
                            <h2 class="text-xl font-light mb-4">${data.personal.jobTitle || ''}</h2>
                            <div class="flex flex-wrap gap-4 text-sm">
                                ${data.personal.email ? `<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>${data.personal.email}</span>` : ''}
                                ${data.personal.phone ? `<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>${data.personal.phone}</span>` : ''}
                                ${data.personal.address ? `<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>${data.personal.address}</span>` : ''}
                                ${data.personal.linkedin ? `<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path></svg>LinkedIn</span>` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="max-w-4xl mx-auto p-8">
                        <!-- Summary Section -->
                        ${data.personal.summary ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">PROFIL PROFESSIONNEL</h3>
                                <p class="text-gray-700 leading-relaxed">${data.personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience Section -->
                        ${data.experience && data.experience.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">EXPÉRIENCE PROFESSIONNELLE</h3>
                                <div class="space-y-6">
                                    ${data.experience.map(exp => `
                                        <div class="border-l-4 border-blue-600 pl-4">
                                            <div class="flex justify-between items-start mb-2">
                                                <h4 class="text-lg font-semibold text-gray-800">${exp.position}</h4>
                                                <span class="text-sm text-gray-600 font-medium">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}</span>
                                            </div>
                                            <p class="text-blue-700 font-medium mb-2">${exp.company}</p>
                                            ${exp.description ? `<p class="text-gray-700 leading-relaxed">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education Section -->
                        ${data.education && data.education.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">FORMATION</h3>
                                <div class="space-y-4">
                                    ${data.education.map(edu => `
                                        <div class="border-l-4 border-blue-600 pl-4">
                                            <div class="flex justify-between items-start">
                                                <div>
                                                    <h4 class="text-lg font-semibold text-gray-800">${edu.degree}</h4>
                                                    <p class="text-blue-700 font-medium">${edu.institution}</p>
                                                    ${edu.location ? `<p class="text-gray-600 text-sm">${edu.location}</p>` : ''}
                                                </div>
                                                <span class="text-sm text-gray-600 font-medium">${edu.year}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Skills Section -->
                        ${(data.skills.technical || data.skills.soft) ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">COMPÉTENCES</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    ${data.skills.technical ? `
                                        <div>
                                            <h4 class="text-lg font-semibold text-gray-800 mb-2">Compétences techniques</h4>
                                            <p class="text-gray-700">${data.skills.technical}</p>
                                        </div>
                                    ` : ''}
                                    ${data.skills.soft ? `
                                        <div>
                                            <h4 class="text-lg font-semibold text-gray-800 mb-2">Compétences interpersonnelles</h4>
                                            <p class="text-gray-700">${data.skills.soft}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Languages Section -->
                        ${data.languages ? `
                            <section class="mb-8">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">LANGUES</h3>
                                <p class="text-gray-700">${data.languages}</p>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },

    classic: {
        name: 'Classique',
        generate: (data) => {
            const fullName = `${data.personal.firstName} ${data.personal.lastName}`.trim();
            
            return `
                <div class="bg-white min-h-screen font-serif text-gray-900 leading-relaxed p-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Header Section -->
                        <header class="text-center mb-8 border-b-2 border-gray-800 pb-6">
                            <h1 class="text-3xl font-bold mb-2 tracking-wide">${fullName}</h1>
                            <h2 class="text-lg text-gray-700 mb-4">${data.personal.jobTitle || ''}</h2>
                            <div class="flex justify-center flex-wrap gap-4 text-sm">
                                ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
                                ${data.personal.phone ? `<span>•</span><span>${data.personal.phone}</span>` : ''}
                                ${data.personal.address ? `<span>•</span><span>${data.personal.address}</span>` : ''}
                                ${data.personal.linkedin ? `<span>•</span><span>LinkedIn</span>` : ''}
                            </div>
                        </header>

                        <!-- Summary Section -->
                        ${data.personal.summary ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">Résumé Professionnel</h3>
                                <p class="text-gray-800 leading-relaxed text-justify">${data.personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience Section -->
                        ${data.experience && data.experience.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Expérience Professionnelle</h3>
                                <div class="space-y-6">
                                    ${data.experience.map(exp => `
                                        <div>
                                            <div class="flex justify-between items-start mb-1">
                                                <h4 class="text-lg font-semibold text-gray-900">${exp.position}</h4>
                                                <span class="text-sm text-gray-700">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}</span>
                                            </div>
                                            <p class="text-gray-800 font-medium mb-2 italic">${exp.company}</p>
                                            ${exp.description ? `<p class="text-gray-700 leading-relaxed text-justify">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education Section -->
                        ${data.education && data.education.length > 0 ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Formation</h3>
                                <div class="space-y-4">
                                    ${data.education.map(edu => `
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="text-lg font-semibold text-gray-900">${edu.degree}</h4>
                                                <p class="text-gray-800 italic">${edu.institution}</p>
                                                ${edu.location ? `<p class="text-gray-700 text-sm">${edu.location}</p>` : ''}
                                            </div>
                                            <span class="text-sm text-gray-700">${edu.year}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Skills Section -->
                        ${(data.skills.technical || data.skills.soft) ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Compétences</h3>
                                ${data.skills.technical ? `
                                    <div class="mb-4">
                                        <h4 class="font-semibold text-gray-900 mb-2">Compétences Techniques:</h4>
                                        <p class="text-gray-800">${data.skills.technical}</p>
                                    </div>
                                ` : ''}
                                ${data.skills.soft ? `
                                    <div>
                                        <h4 class="font-semibold text-gray-900 mb-2">Compétences Interpersonnelles:</h4>
                                        <p class="text-gray-800">${data.skills.soft}</p>
                                    </div>
                                ` : ''}
                            </section>
                        ` : ''}

                        <!-- Languages Section -->
                        ${data.languages ? `
                            <section class="mb-8">
                                <h3 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Langues</h3>
                                <p class="text-gray-800">${data.languages}</p>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },

    professional: {
        name: 'Professionnel',
        generate: (data) => {
            const fullName = `${data.personal.firstName} ${data.personal.lastName}`.trim();
            
            return `
                <div class="bg-white min-h-screen font-sans text-gray-800">
                    <div class="flex">
                        <!-- Left Sidebar -->
                        <div class="w-1/3 bg-gray-800 text-white p-6">
                            <!-- Profile Section -->
                            <div class="text-center mb-8">
                                <div class="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span class="text-2xl font-bold">${data.personal.firstName?.charAt(0) || ''}${data.personal.lastName?.charAt(0) || ''}</span>
                                </div>
                                <h1 class="text-xl font-bold mb-1">${fullName}</h1>
                                <p class="text-gray-300 text-sm">${data.personal.jobTitle || ''}</p>
                            </div>

                            <!-- Contact Information -->
                            <section class="mb-8">
                                <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">CONTACT</h3>
                                <div class="space-y-3 text-sm">
                                    ${data.personal.email ? `
                                        <div class="flex items-center">
                                            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                            <span>${data.personal.email}</span>
                                        </div>
                                    ` : ''}
                                    ${data.personal.phone ? `
                                        <div class="flex items-center">
                                            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                            </svg>
                                            <span>${data.personal.phone}</span>
                                        </div>
                                    ` : ''}
                                    ${data.personal.address ? `
                                        <div class="flex items-center">
                                            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span>${data.personal.address}</span>
                                        </div>
                                    ` : ''}
                                    ${data.personal.linkedin ? `
                                        <div class="flex items-center">
                                            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span>LinkedIn</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </section>

                            <!-- Skills Section -->
                            ${(data.skills.technical || data.skills.soft) ? `
                                <section class="mb-8">
                                    <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">COMPÉTENCES</h3>
                                    ${data.skills.technical ? `
                                        <div class="mb-4">
                                            <h4 class="font-semibold mb-2 text-gray-300">Techniques</h4>
                                            <p class="text-sm text-gray-200">${data.skills.technical}</p>
                                        </div>
                                    ` : ''}
                                    ${data.skills.soft ? `
                                        <div>
                                            <h4 class="font-semibold mb-2 text-gray-300">Interpersonnelles</h4>
                                            <p class="text-sm text-gray-200">${data.skills.soft}</p>
                                        </div>
                                    ` : ''}
                                </section>
                            ` : ''}

                            <!-- Languages Section -->
                            ${data.languages ? `
                                <section class="mb-8">
                                    <h3 class="text-lg font-bold mb-4 border-b border-gray-600 pb-2">LANGUES</h3>
                                    <p class="text-sm text-gray-200">${data.languages}</p>
                                </section>
                            ` : ''}
                        </div>

                        <!-- Right Content -->
                        <div class="w-2/3 p-8">
                            <!-- Summary Section -->
                            ${data.personal.summary ? `
                                <section class="mb-8">
                                    <h3 class="text-2xl font-bold text-gray-800 mb-4">PROFIL PROFESSIONNEL</h3>
                                    <p class="text-gray-700 leading-relaxed">${data.personal.summary}</p>
                                </section>
                            ` : ''}

                            <!-- Experience Section -->
                            ${data.experience && data.experience.length > 0 ? `
                                <section class="mb-8">
                                    <h3 class="text-2xl font-bold text-gray-800 mb-4">EXPÉRIENCE</h3>
                                    <div class="space-y-6">
                                        ${data.experience.map(exp => `
                                            <div class="relative">
                                                <div class="flex justify-between items-start mb-2">
                                                    <h4 class="text-lg font-semibold text-gray-800">${exp.position}</h4>
                                                    <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}</span>
                                                </div>
                                                <p class="text-gray-700 font-medium mb-2">${exp.company}</p>
                                                ${exp.description ? `<p class="text-gray-600 leading-relaxed">${exp.description}</p>` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            ` : ''}

                            <!-- Education Section -->
                            ${data.education && data.education.length > 0 ? `
                                <section class="mb-8">
                                    <h3 class="text-2xl font-bold text-gray-800 mb-4">FORMATION</h3>
                                    <div class="space-y-4">
                                        ${data.education.map(edu => `
                                            <div class="flex justify-between items-start">
                                                <div>
                                                    <h4 class="text-lg font-semibold text-gray-800">${edu.degree}</h4>
                                                    <p class="text-gray-700 font-medium">${edu.institution}</p>
                                                    ${edu.location ? `<p class="text-gray-600 text-sm">${edu.location}</p>` : ''}
                                                </div>
                                                <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">${edu.year}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    },

    minimal: {
        name: 'Minimaliste',
        generate: (data) => {
            const fullName = `${data.personal.firstName} ${data.personal.lastName}`.trim();
            
            return `
                <div class="bg-white min-h-screen font-sans text-gray-900 p-8">
                    <div class="max-w-3xl mx-auto">
                        <!-- Header Section -->
                        <header class="mb-10">
                            <h1 class="text-4xl font-light mb-2">${fullName}</h1>
                            <h2 class="text-lg text-gray-600 mb-4">${data.personal.jobTitle || ''}</h2>
                            <div class="text-sm text-gray-600 space-y-1">
                                ${data.personal.email ? `<div>${data.personal.email}</div>` : ''}
                                ${data.personal.phone ? `<div>${data.personal.phone}</div>` : ''}
                                ${data.personal.address ? `<div>${data.personal.address}</div>` : ''}
                                ${data.personal.linkedin ? `<div>LinkedIn Profile</div>` : ''}
                            </div>
                        </header>

                        <!-- Summary Section -->
                        ${data.personal.summary ? `
                            <section class="mb-10">
                                <p class="text-gray-800 leading-relaxed text-lg">${data.personal.summary}</p>
                            </section>
                        ` : ''}

                        <!-- Experience Section -->
                        ${data.experience && data.experience.length > 0 ? `
                            <section class="mb-10">
                                <h3 class="text-xl font-medium text-gray-900 mb-6">Experience</h3>
                                <div class="space-y-8">
                                    ${data.experience.map(exp => `
                                        <div>
                                            <div class="flex justify-between items-baseline mb-1">
                                                <h4 class="text-lg font-medium text-gray-900">${exp.position}</h4>
                                                <span class="text-sm text-gray-500">${exp.startDate}${exp.endDate ? ` — ${exp.endDate}` : ''}</span>
                                            </div>
                                            <p class="text-gray-700 mb-3">${exp.company}</p>
                                            ${exp.description ? `<p class="text-gray-600 leading-relaxed">${exp.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Education Section -->
                        ${data.education && data.education.length > 0 ? `
                            <section class="mb-10">
                                <h3 class="text-xl font-medium text-gray-900 mb-6">Education</h3>
                                <div class="space-y-4">
                                    ${data.education.map(edu => `
                                        <div class="flex justify-between items-baseline">
                                            <div>
                                                <h4 class="font-medium text-gray-900">${edu.degree}</h4>
                                                <p class="text-gray-700">${edu.institution}</p>
                                                ${edu.location ? `<p class="text-gray-600 text-sm">${edu.location}</p>` : ''}
                                            </div>
                                            <span class="text-sm text-gray-500">${edu.year}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Skills Section -->
                        ${(data.skills.technical || data.skills.soft) ? `
                            <section class="mb-10">
                                <h3 class="text-xl font-medium text-gray-900 mb-6">Skills</h3>
                                <div class="space-y-4">
                                    ${data.skills.technical ? `
                                        <div>
                                            <h4 class="font-medium text-gray-900 mb-2">Technical</h4>
                                            <p class="text-gray-700">${data.skills.technical}</p>
                                        </div>
                                    ` : ''}
                                    ${data.skills.soft ? `
                                        <div>
                                            <h4 class="font-medium text-gray-900 mb-2">Soft Skills</h4>
                                            <p class="text-gray-700">${data.skills.soft}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </section>
                        ` : ''}

                        <!-- Languages Section -->
                        ${data.languages ? `
                            <section>
                                <h3 class="text-xl font-medium text-gray-900 mb-6">Languages</h3>
                                <p class="text-gray-700">${data.languages}</p>
                            </section>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }
};