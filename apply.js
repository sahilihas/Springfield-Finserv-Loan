console.log("apply.js loaded");

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

    // STEP NAVIGATION
    function showStep(step) {
        document.querySelectorAll('.form-section').forEach(section => { // Hide all sections
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

    // VALIDATE CURRENT STEP
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

    // BUTTON EVENT LISTENERS
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

    // FILE UPLOAD HANDLERS WITH PREVIEW
    const fileInputs = [
        { input: 'idDocument', display: 'idDocumentName', preview: 'idDocumentPreview' },
        { input: 'businessDocs', display: 'businessDocsName', preview: 'businessDocsPreview' },
        { input: 'bankStatements', display: 'bankStatementsName', preview: 'bankStatementsPreview' },
        { input: 'ownerIds', display: 'ownerIdsName', preview: 'ownerIdsPreview' }
    ];

    // Store files for each input
    const fileStorage = {};

    fileInputs.forEach(({ input, display, preview }) => {
        const fileInput = document.getElementById(input);
        const fileDisplay = document.getElementById(display);
        const previewContainer = document.getElementById(preview);

        if (fileInput && fileDisplay) {
            // Initialize storage for this input
            fileStorage[input] = [];

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                
                if (files.length > 0) {
                    // Store files
                    if (fileInput.multiple) {
                        fileStorage[input] = [...fileStorage[input], ...files];
                    } else {
                        fileStorage[input] = files;
                    }

                    // Update display
                    const totalFiles = fileStorage[input].length;
                    const fileNames = fileStorage[input].map(f => f.name).join(', ');
                    fileDisplay.textContent = `${totalFiles} file(s): ${fileNames}`;
                    fileDisplay.style.color = 'var(--primary)';
                    e.target.parentElement.classList.remove('error');

                    // Show preview
                    if (previewContainer) {
                        displayFilePreviews(fileStorage[input], previewContainer, input);
                    }
                }
            });
        }
    });

    // Function to display file previews
    function displayFilePreviews(files, container, inputId) {
        container.innerHTML = '';
        
        files.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';
            
            const fileIcon = getFileIcon(file.type);
            const fileSize = formatFileSize(file.size);
            
            previewItem.innerHTML = `
                <div class="file-preview-icon">${fileIcon}</div>
                <div class="file-preview-info">
                    <div class="file-preview-name">${file.name}</div>
                    <div class="file-preview-size">${fileSize}</div>
                </div>
                <div class="file-preview-actions">
                    <button type="button" class="file-preview-btn file-preview-view" data-index="${index}">
                        👁️ View
                    </button>
                    <button type="button" class="file-preview-btn file-preview-remove" data-index="${index}">
                        ✕ Remove
                    </button>
                </div>
            `;
            
            // Add event listeners
            const viewBtn = previewItem.querySelector('.file-preview-view');
            const removeBtn = previewItem.querySelector('.file-preview-remove');
            
            viewBtn.addEventListener('click', () => {
                previewFile(file);
            });
            
            removeBtn.addEventListener('click', () => {
                removeFile(inputId, index, container);
            });
            
            container.appendChild(previewItem);
        });
    }

    // Get file icon based on type
    function getFileIcon(type) {
        if (type === 'application/pdf') return '📄';
        if (type.startsWith('image/')) return '🖼️';
        return '📎';
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Preview file (PDF or Image)
    function previewFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const modal = createPreviewModal(file.name, e.target.result, file.type);
            document.body.appendChild(modal);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        };
        
        reader.readAsDataURL(file);
    }

    // Create preview modal
    function createPreviewModal(filename, dataUrl, fileType) {
        const modal = document.createElement('div');
        modal.className = 'preview-modal active';
        
        let previewContent = '';
        if (fileType === 'application/pdf') {
            previewContent = `<iframe class="preview-iframe" src="${dataUrl}" type="application/pdf"></iframe>`;
        } else if (fileType.startsWith('image/')) {
            previewContent = `<img class="preview-image" src="${dataUrl}" alt="Preview">`;
        }
        
        modal.innerHTML = `
            <div class="preview-modal-content">
                <div class="preview-modal-header">
                    <div class="preview-modal-title">${filename}</div>
                    <button class="preview-modal-close">&times;</button>
                </div>
                <div class="preview-modal-body">
                    ${previewContent}
                </div>
            </div>
        `;
        
        // Close button
        const closeBtn = modal.querySelector('.preview-modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
        
        // ESC function key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        return modal;
    }

    // Remove file from storage and update display
    function removeFile(inputId, index, container) {
        fileStorage[inputId].splice(index, 1);
        const fileDisplay = document.getElementById(inputId + 'Name');
        if (fileStorage[inputId].length > 0) {
            const fileNames = fileStorage[inputId].map(f => f.name).join(', ');
            fileDisplay.textContent = `${fileStorage[inputId].length} file(s): ${fileNames}`;
        } else {
            fileDisplay.textContent = '';
        }
        
        // Refresh preview container 
        displayFilePreviews(fileStorage[inputId], container, inputId);
        // Update the actual file input (create new FileList)
        const fileInput = document.getElementById(inputId);
        const dataTransfer = new DataTransfer();
        fileStorage[inputId].forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
    }

    // CONDITIONAL FIELDS
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

    // ⭐ FORM SUBMISSION WITH BACKEND API ⭐
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check honeypot
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                console.log('Bot detected');
                return;
            }

            // Validate final step
            if (!validateStep(currentStep)) return;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                // Create FormData object
                const formData = new FormData(form);
                
                // Submit to backend API
                const response = await window.api.submitApplication(formData);

                if (response.success) {
                    // Hide form and show confirmation
                    form.classList.add('hidden');
                    confirmationDiv.classList.remove('hidden');
                    
                    // Display application ID
                    document.getElementById('applicationId').textContent = 
                        response.applicationId;
                    
                    // Clear form
                    form.reset();
                    
                    // Reset step to 1
                    currentStep = 1;
                    showStep(currentStep);
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    console.log('✅ Application submitted successfully!');
                } else {
                    throw new Error(response.message || 'Submission failed');
                }

            } catch (error) {
                console.error('❌ Error submitting application:', error);
                alert('There was an error submitting your application. Please try again.\n\nError: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            }
        });
    }
    /*saves files from local storage to formData
                const applicationData = Object.fromEntries(formData.entries());
                applicationData.id = 'APP-' + Date.now();
                applicationData.status = 'Pending Review';
                applicationData.submittedAt = new Date().toISOString();

                const existingApps =
                    JSON.parse(sessionStorage.getItem('loanApplications')) || [];

                existingApps.push(applicationData);

                sessionStorage.setItem(
                    'loanApplications',
                    JSON.stringify(existingApps)
                );

                form.classList.add('hidden');
                confirmationDiv.classList.remove('hidden');
                
                document.getElementById('applicationId').textContent = 
                   applicationData.id;

                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
                
                window.scrollTo({ top: 0, behavior: 'smooth' });*/


    // INPUT VALIDATION HELPERS
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

    // INITIALIZE FORM
    showStep(currentStep);
});