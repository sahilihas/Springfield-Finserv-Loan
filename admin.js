// ===================================
// ADMIN AUTHENTICATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn')) {
        showDashboard();
    }

    // Login handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simple authentication (in production, use proper backend authentication)
            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                showDashboard();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('adminLoggedIn');
            location.reload();
        });
    }

    function showDashboard() {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (dashboardContent) {
            dashboardContent.classList.remove('hidden');
            loadDashboardData();
        }
    }

    // ===================================
    // VIEW NAVIGATION
    // ===================================
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    window.switchView = function(view) {
        document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(`view-${view}`);
        if (targetView) {
            targetView.classList.add('active');
            
            // Load specific view data
            if (view === 'applications') {
                loadAllApplications();
            } else if (view === 'analytics') {
                loadAnalytics();
            }
        }
    };

    // ===================================
    // LOAD DASHBOARD DATA
    // ===================================
    function loadDashboardData() {
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        
        // Update stats
        document.getElementById('total-applications').textContent = applications.length;
        document.getElementById('app-count').textContent = applications.length;
        
        const pending = applications.filter(app => app.status === 'Pending Review').length;
        const approved = applications.filter(app => app.status === 'Approved').length;
        
        document.getElementById('pending-applications').textContent = pending;
        document.getElementById('approved-applications').textContent = approved;
        
        // Calculate total capital
        const totalCapital = applications.reduce((sum, app) => {
            return sum + (parseFloat(app.loan?.amount) || 0);
        }, 0);
        document.getElementById('total-capital').textContent = `$${(totalCapital / 1000000).toFixed(2)}M`;
        
        // Load recent applications (last 5)
        loadRecentApplications(applications.slice(-5).reverse());
    }

    // ===================================
    // LOAD RECENT APPLICATIONS
    // ===================================
    function loadRecentApplications(applications) {
        const tbody = document.getElementById('recent-applications-body');
        if (!tbody) return;

        if (applications.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No applications yet</td></tr>';
            return;
        }

        tbody.innerHTML = applications.map(app => `
            <tr onclick="viewApplication('${app.id}')" style="cursor: pointer;">
                <td><strong>${app.id}</strong></td>
                <td>${app.applicant?.fullName || 'N/A'}</td>
                <td>${app.business?.name || 'N/A'}</td>
                <td><strong>$${parseFloat(app.loan?.amount || 0).toLocaleString()}</strong></td>
                <td>${getStatusBadge(app.status)}</td>
                <td>${new Date(app.submittedAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    // ===================================
    // LOAD ALL APPLICATIONS
    // ===================================
    function loadAllApplications() {
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        const tbody = document.getElementById('applicationsBody');
        if (!tbody) return;

        if (applications.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No applications found</td></tr>';
            return;
        }

        tbody.innerHTML = applications.map(app => `
            <tr>
                <td><input type="checkbox" class="app-checkbox" data-id="${app.id}"></td>
                <td><strong>${app.id}</strong></td>
                <td>${app.applicant?.fullName || 'N/A'}</td>
                <td>${app.business?.name || 'N/A'}</td>
                <td><strong>$${parseFloat(app.loan?.amount || 0).toLocaleString()}</strong></td>
                <td class="capitalize">${app.loan?.purpose?.replace('_', ' ') || 'N/A'}</td>
                <td>${getStatusBadge(app.status)}</td>
                <td>${new Date(app.submittedAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn action-btn-primary" onclick="viewApplication('${app.id}')">View</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.loadAllApplications = loadAllApplications;

    // ===================================
    // STATUS BADGE
    // ===================================
    function getStatusBadge(status) {
        const statusClasses = {
            'Pending Review': 'status-pending',
            'Approved': 'status-approved',
            'Rejected': 'status-rejected',
            'Under Review': 'status-review'
        };
        const className = statusClasses[status] || 'status-pending';
        return `<span class="status-badge ${className}">${status}</span>`;
    }

    // ===================================
    // VIEW APPLICATION DETAILS
    // ===================================
    window.viewApplication = function(id) {
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        const app = applications.find(a => a.id === id);
        
        if (!app) return;

        // Store current app ID for status updates
        window.currentAppId = id;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="detail-section">
                <h3>Applicant Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <p class="detail-label">Full Name</p>
                        <p class="detail-value">${app.applicant?.fullName || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Email</p>
                        <p class="detail-value">${app.applicant?.email || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Phone</p>
                        <p class="detail-value">${app.applicant?.phone || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">WhatsApp</p>
                        <p class="detail-value">${app.applicant?.whatsapp || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Nationality</p>
                        <p class="detail-value">${app.applicant?.nationality || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Date of Birth</p>
                        <p class="detail-value">${app.applicant?.dateOfBirth || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Business Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <p class="detail-label">Business Name</p>
                        <p class="detail-value">${app.business?.name || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Registration Number</p>
                        <p class="detail-value">${app.business?.regNumber || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Entity Type</p>
                        <p class="detail-value">${app.business?.entity?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Industry</p>
                        <p class="detail-value">${app.business?.industry || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">TIN</p>
                        <p class="detail-value">${app.business?.tin || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Established</p>
                        <p class="detail-value">${app.business?.established || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Loan Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <p class="detail-label">Loan Amount</p>
                        <p class="detail-value">$${parseFloat(app.loan?.amount || 0).toLocaleString()}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Purpose</p>
                        <p class="detail-value">${app.loan?.purpose?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Term</p>
                        <p class="detail-value">${app.loan?.term || 'N/A'} months</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Start Date</p>
                        <p class="detail-value">${app.loan?.startDate || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Financial Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <p class="detail-label">Annual Revenue</p>
                        <p class="detail-value">$${parseFloat(app.financial?.annualRevenue || 0).toLocaleString()}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Monthly Sales</p>
                        <p class="detail-value">$${parseFloat(app.financial?.monthlySales || 0).toLocaleString()}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Monthly Expenses</p>
                        <p class="detail-value">$${parseFloat(app.financial?.monthlyExpenses || 0).toLocaleString()}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Existing Loans</p>
                        <p class="detail-value">${app.financial?.existingLoans || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Documents Uploaded</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <p class="detail-label">ID Document</p>
                        <p class="detail-value">${app.documents?.idDocument || 'Not uploaded'}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Business Docs</p>
                        <p class="detail-value">${app.documents?.businessDocs?.length || 0} file(s)</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Bank Statements</p>
                        <p class="detail-value">${app.documents?.bankStatements?.length || 0} file(s)</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('appModal').classList.remove('hidden');
    };

    window.closeModal = function() {
        document.getElementById('appModal').classList.add('hidden');
    };

    // ===================================
    // UPDATE APPLICATION STATUS
    // ===================================
    window.updateStatus = function(newStatus) {
        if (!window.currentAppId) return;

        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        const appIndex = applications.findIndex(a => a.id === window.currentAppId);
        
        if (appIndex !== -1) {
            applications[appIndex].status = newStatus;
            sessionStorage.setItem('loanApplications', JSON.stringify(applications));
            
            closeModal();
            loadDashboardData();
            loadAllApplications();
            
            alert(`Application ${newStatus.toLowerCase()} successfully!`);
        }
    };

    // ===================================
    // SEARCH & FILTER
    // ===================================
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterApplications);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterApplications);
    }

    function filterApplications() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const statusValue = statusFilter?.value || '';
        
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        
        const filtered = applications.filter(app => {
            const matchesSearch = !searchTerm || 
                app.applicant?.fullName?.toLowerCase().includes(searchTerm) ||
                app.business?.name?.toLowerCase().includes(searchTerm) ||
                app.id.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusValue || app.status === statusValue;
            
            return matchesSearch && matchesStatus;
        });

        const tbody = document.getElementById('applicationsBody');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No matching applications found</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(app => `
            <tr>
                <td><input type="checkbox" class="app-checkbox" data-id="${app.id}"></td>
                <td><strong>${app.id}</strong></td>
                <td>${app.applicant?.fullName || 'N/A'}</td>
                <td>${app.business?.name || 'N/A'}</td>
                <td><strong>$${parseFloat(app.loan?.amount || 0).toLocaleString()}</strong></td>
                <td class="capitalize">${app.loan?.purpose?.replace('_', ' ') || 'N/A'}</td>
                <td>${getStatusBadge(app.status)}</td>
                <td>${new Date(app.submittedAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn action-btn-primary" onclick="viewApplication('${app.id}')">View</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===================================
    // EXPORT FUNCTIONS
    // ===================================
    window.exportToCSV = function() {
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        
        const headers = ['Application ID', 'Name', 'Email', 'Business', 'Loan Amount', 'Purpose', 'Status', 'Date'];
        const rows = applications.map(app => [
            app.id,
            app.applicant?.fullName || '',
            app.applicant?.email || '',
            app.business?.name || '',
            app.loan?.amount || '',
            app.loan?.purpose || '',
            app.status,
            new Date(app.submittedAt).toLocaleDateString()
        ]);

        let csv = [headers.join(',')];
        rows.forEach(row => {
            csv.push(row.map(cell => `"${cell}"`).join(','));
        });

        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    window.exportToExcel = function() {
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        
        const data = applications.map(app => ({
            'Application ID': app.id,
            'Name': app.applicant?.fullName || '',
            'Email': app.applicant?.email || '',
            'Phone': app.applicant?.phone || '',
            'Business': app.business?.name || '',
            'Loan Amount': app.loan?.amount || '',
            'Purpose': app.loan?.purpose || '',
            'Term': app.loan?.term || '',
            'Status': app.status,
            'Date': new Date(app.submittedAt).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Applications');
        XLSX.writeFile(wb, `applications_${Date.now()}.xlsx`);
    };

    window.exportToPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        
        const tableData = applications.map(app => [
            app.id,
            app.applicant?.fullName || '',
            app.business?.name || '',
            `$${parseFloat(app.loan?.amount || 0).toLocaleString()}`,
            app.status,
            new Date(app.submittedAt).toLocaleDateString()
        ]);

        doc.setFontSize(18);
        doc.text('Loan Applications Report', 14, 20);
        
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

        doc.autoTable({
            head: [['ID', 'Name', 'Business', 'Amount', 'Status', 'Date']],
            body: tableData,
            startY: 40
        });

        doc.save(`applications_${Date.now()}.pdf`);
    };

    // ===================================
    // REFRESH DATA
    // ===================================
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardData();
            loadAllApplications();
            alert('Data refreshed successfully!');
        });
    }

    // ===================================
    // SETTINGS FUNCTIONS
    // ===================================
    window.clearAllData = function() {
        if (confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
            sessionStorage.removeItem('loanApplications');
            loadDashboardData();
            loadAllApplications();
            alert('All data has been cleared.');
        }
    };

    window.exportAllData = function() {
        const applications = JSON.parse(sessionStorage.getItem('loanApplications') || '[]');
        const dataStr = JSON.stringify(applications, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ===================================
    // ANALYTICS (PLACEHOLDER)
    // ===================================
    function loadAnalytics() {
        // This would typically load chart data
        // For now, just a placeholder
        console.log('Analytics loaded');
    }

    // ===================================
    // SELECT ALL CHECKBOX
    // ===================================
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            document.querySelectorAll('.app-checkbox').forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }

    // Initialize dashboard if logged in
    if (sessionStorage.getItem('adminLoggedIn')) {
        loadDashboardData();
    }
});