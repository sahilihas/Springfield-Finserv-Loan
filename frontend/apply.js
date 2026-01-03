// ===================================
// MULTI-STEP FORM LOGIC
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 5;
    
    const form = document.getElementById('loanApplicationForm');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const confirmationDiv = document.getElementById('confirmation');

    // Initialize submission date
    const submissionDateField = document.getElementById('submissionDate');
    if (submissionDateField) {
        const today = new Date().toLocaleDateString('en-GB');
        submissionDateField.value = `Submission Date: ${today}`;
    }

    // ===================================
    // STEP NAVIGATION
    // ===================================
    function showStep(step) {
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show current section
        const currentSection = document.querySelector(`[data-section="${step}"]`);
        if (currentSection) {
            currentSection.classList.remove('hidden');
        }

        // Update progress indicator
        document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
            if (index < step) {
                progressStep.classList.add('active');
                progressStep.classList.add('completed');
            } else if (index === step - 1) {
                progressStep.classList.add('active');
                progressStep.classList.remove('completed');
            } else {
                progressStep.classList.remove('active');
                progressStep.classList.remove('completed');
            }
        });

        // Update buttons
        prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
        nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';
        submitBtn.style.display = step === totalSteps ? 'inline-block' : 'none';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===================================
    // VALIDATE CURRENT STEP
    // ===================================
    function validateStep(step) {
        const currentSection = document.querySelector(`[data-section="${step}"]`);
        if (!currentSection) return true;

        const requiredInputs = currentSection.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim() && input.type !== 'file') {
                input.classList.add('error');
                isValid = false;
            } else if (input.type === 'file' && input.hasAttribute('required') && input.files.length === 0) {
                input.parentElement.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
                if (input.type === 'file') {
                    input.parentElement.classList.remove('error');
                }
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields before proceeding.');
        }

        return isValid;
    }

    // ===================================
    // BUTTON EVENT LISTENERS
    // ===================================
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    }

    // ===================================
    // FILE UPLOAD HANDLERS
    // ===================================
    const fileInputs = [
        { input: 'idDocument', display: 'idDocumentName' },
        { input: 'businessDocs', display: 'businessDocsName' },
        { input: 'bankStatements', display: 'bankStatementsName' },
        { input: 'ownerIds', display: 'ownerIdsName' }
    ];

    fileInputs.forEach(({ input, display }) => {
        const fileInput = document.getElementById(input);
        const fileDisplay = document.getElementById(display);

        if (fileInput && fileDisplay) {
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    const fileNames = Array.from(files).map(f => f.name).join(', ');
                    fileDisplay.textContent = `${files.length} file(s): ${fileNames}`;
                    fileDisplay.style.color = 'var(--primary)';
                    e.target.parentElement.classList.remove('error');
                } else {
                    fileDisplay.textContent = '';
                }
            });
        }
    });

    // ===================================
    // CONDITIONAL FIELDS
    // ===================================
    const existingLoansSelect = document.getElementById('existingLoans');
    const existingLoanDetails = document.getElementById('existingLoanDetails');

    if (existingLoansSelect && existingLoanDetails) {
        existingLoansSelect.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                existingLoanDetails.classList.remove('hidden');
                existingLoanDetails.querySelectorAll('input').forEach(input => {
                    input.setAttribute('required', 'required');
                });
            } else {
                existingLoanDetails.classList.add('hidden');
                existingLoanDetails.querySelectorAll('input').forEach(input => {
                    input.removeAttribute('required');
                    input.value = '';
                });
            }
        });
    }

    // ===================================
    // FORM SUBMISSION
    // ===================================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Check honeypot
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                return; // Bot detected
            }

            // Validate final step
            if (!validateStep(currentStep)) {
                return;
            }

            // Collect form data
            const formData = new FormData(form);
            const applicationData = {
                id: 'APP-' + Date.now(),
                submittedAt: new Date().toISOString(),
                status: 'Pending Review',
                
                // Applicant Information
                applicant: {
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    whatsapp: formData.get('whatsapp'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    nationality: formData.get('nationality'),
                    address: formData.get('address'),
                    idType: formData.get('idType'),
                    idNumber: formData.get('idNumber')
                },
                
                // Business Information
                business: {
                    name: formData.get('businessName'),
                    regNumber: formData.get('businessRegNumber'),
                    entity: formData.get('businessEntity'),
                    industry: formData.get('industry'),
                    address: formData.get('businessAddress'),
                    established: formData.get('businessEstablished'),
                    tin: formData.get('tin'),
                    website: formData.get('businessWebsite'),
                    ownerNames: formData.get('ownerNames'),
                    ownershipPercentage: formData.get('ownershipPercentage')
                },
                
                // Loan Details
                loan: {
                    amount: formData.get('loanAmount'),
                    purpose: formData.get('loanPurpose'),
                    term: formData.get('repaymentTerm'),
                    startDate: formData.get('proposedStartDate')
                },
                
                // Financial Details
                financial: {
                    annualRevenue: formData.get('annualRevenue'),
                    monthlySales: formData.get('monthlySales'),
                    monthlyExpenses: formData.get('monthlyExpenses'),
                    existingLoans: formData.get('existingLoans'),
                    lenderName: formData.get('lenderName') || null,
                    outstandingBalance: formData.get('outstandingBalance') || null,
                    monthlyRepayment: formData.get('monthlyRepayment') || null
                },
                
                // Declarations
                declarations: {
                    certifyInfo: formData.get('certifyInfo') === 'on',
                    authorizeVerification: formData.get('authorizeVerification') === 'on',
                    agreeTerms: formData.get('agreeTerms') === 'on',
                    digitalSignature: formData.get('digitalSignature'),
                    preferredContact: formData.get('preferredContact')
                },
                
                // File information
                documents: {
                    idDocument: formData.get('idDocument')?.name || null,
                    businessDocs: Array.from(formData.getAll('businessDocs')).map(f => f.name),
                    bankStatements: Array.from(formData.getAll('bankStatements')).map(f => f.name),
                    ownerIds: Array.from(formData.getAll('ownerIds')).map(f => f.name)
                }
            };

            // Store application data
            try {
                const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
                applications.push(applicationData);
                sessionStorage.setItem('loanApplications', JSON.stringify(applications));
                
                console.log('Application submitted:', applicationData);
                
                // Show confirmation
                form.classList.add('hidden');
                confirmationDiv.classList.remove('hidden');
                
                // Display application ID
                const appIdElement = document.getElementById('applicationId');
                if (appIdElement) {
                    appIdElement.textContent = applicationData.id;
                }
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            } catch (error) {
                console.error('Error saving application:', error);
                alert('There was an error submitting your application. Please try again.');
            }
        });
    }

    // ===================================
    // INPUT VALIDATION HELPERS
    // ===================================
    
    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (input.value && !emailRegex.test(input.value)) {
                input.classList.add('error');
                input.setCustomValidity('Please enter a valid email address');
            } else {
                input.classList.remove('error');
                input.setCustomValidity('');
            }
        });
    });

    // Phone validation (basic)
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // Allow only numbers, spaces, +, -, and ()
            e.target.value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
        });
    });

    // Number inputs - prevent negative values
    const numberInputs = form.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        });
    });

    // Remove error class on input
    const allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });

    // ===================================
    // INITIALIZE FORM
    // ===================================
    showStep(currentStep);
});