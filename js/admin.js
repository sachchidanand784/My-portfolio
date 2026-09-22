/* admin.js - Self-Serve Content Management System Logic */

document.addEventListener('DOMContentLoaded', () => {

  const loginSection = document.getElementById('admin-login-section');
  const dashboardSection = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('admin-login-form');
  const loginPassInput = document.getElementById('admin-password');
  const loginErr = document.getElementById('login-error');
  const logoutBtn = document.getElementById('admin-logout-btn');

  /* 1. Check Authentication Status */
  const isAuthenticated = sessionStorage.getItem('SY_ADMIN_AUTH') === 'true';

  if (isAuthenticated) {
    showDashboard();
  } else {
    showLogin();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = loginPassInput.value.trim();
      // Default admin password or session check
      if (pass === 'admin123' || pass === 'sachchidanand2026') {
        sessionStorage.setItem('SY_ADMIN_AUTH', 'true');
        showDashboard();
        loginErr.style.display = 'none';
      } else {
        loginErr.textContent = 'Invalid Admin Password! Please try again.';
        loginErr.style.display = 'block';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('SY_ADMIN_AUTH');
      showLogin();
    });
  }

  function showLogin() {
    if (loginSection) loginSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }

  function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    loadAdminCertificates();
    loadAdminResumeInfo();
    loadSupabaseSettings();
  }

  /* 2. Resume Upload & Archiving */
  const resumeForm = document.getElementById('admin-resume-form');
  const resumeFileInput = document.getElementById('resume-file-input');
  const resumeStatus = document.getElementById('resume-upload-status');
  const currentResumeLabel = document.getElementById('current-resume-name');

  if (resumeForm) {
    resumeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = resumeFileInput.files[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        showStatus(resumeStatus, 'Only PDF files are allowed for resume!', 'error');
        return;
      }

      showStatus(resumeStatus, 'Uploading resume PDF...', 'info');

      const today = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      // If Supabase is connected, upload to storage bucket
      if (window.supabaseClient) {
        try {
          const filePath = `resumes/${Date.now()}_${file.name}`;
          const { data: uploadData, error: uploadErr } = await window.supabaseClient.storage
            .from('portfolio-files')
            .upload(filePath, file);

          if (uploadErr) throw uploadErr;

          const { data: publicUrlData } = window.supabaseClient.storage
            .from('portfolio-files')
            .getPublicUrl(filePath);

          const publicUrl = publicUrlData.publicUrl;

          // Insert metadata to database table
          const { error: dbErr } = await window.supabaseClient
            .from('resumes')
            .insert([{ url: publicUrl, filename: file.name, lastUpdated: today }]);

          if (dbErr) throw dbErr;

          showStatus(resumeStatus, '✅ Resume uploaded successfully to Cloud Storage!', 'success');
          loadAdminResumeInfo();
          if (window.refreshPublicData) window.refreshPublicData();
          return;
        } catch (err) {
          console.warn("Supabase resume upload failed, saving locally:", err);
        }
      }

      // Local / DataURL Fallback
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileDataUrl = event.target.result;
        const resumeObj = {
          url: fileDataUrl,
          filename: file.name,
          lastUpdated: today
        };
        localStorage.setItem("SY_DYNAMIC_RESUME", JSON.stringify(resumeObj));
        showStatus(resumeStatus, '✅ Resume updated successfully in local storage!', 'success');
        loadAdminResumeInfo();
        if (window.refreshPublicData) window.refreshPublicData();
      };
      reader.readAsDataURL(file);
    });
  }

  function loadAdminResumeInfo() {
    let resumeData = null;
    const local = localStorage.getItem("SY_DYNAMIC_RESUME");
    if (local) {
      try { resumeData = JSON.parse(local); } catch(e){}
    }
    if (!resumeData) resumeData = SITE_CONFIG.initialResume;

    if (currentResumeLabel) {
      currentResumeLabel.textContent = `${resumeData.filename} (Last Updated: ${resumeData.lastUpdated})`;
    }
  }

  /* 3. Certificate Add & Delete Management */
  const certForm = document.getElementById('admin-cert-form');
  const certListContainer = document.getElementById('admin-cert-list');
  const certStatus = document.getElementById('cert-upload-status');

  if (certForm) {
    certForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('cert-title-input').value.trim();
      const issuer = document.getElementById('cert-issuer-input').value.trim();
      const date = document.getElementById('cert-date-input').value.trim();
      const desc = document.getElementById('cert-desc-input').value.trim();
      const fileInput = document.getElementById('cert-file-input');
      const file = fileInput.files[0];

      if (!title || !issuer || !date) {
        showStatus(certStatus, 'Please fill in required certificate fields.', 'error');
        return;
      }

      showStatus(certStatus, 'Saving certification...', 'info');
      let fileUrl = null;

      // Handle optional certificate file
      if (file && window.supabaseClient) {
        try {
          const filePath = `certs/${Date.now()}_${file.name}`;
          const { data, error } = await window.supabaseClient.storage
            .from('portfolio-files')
            .upload(filePath, file);

          if (!error) {
            const { data: publicUrlData } = window.supabaseClient.storage
              .from('portfolio-files')
              .getPublicUrl(filePath);
            fileUrl = publicUrlData.publicUrl;
          }
        } catch(e){}
      }

      const newCert = {
        id: "cert-" + Date.now(),
        title: title,
        issuer: issuer,
        date: date,
        description: desc || 'Verified skill accreditation.',
        file_url: fileUrl
      };

      // Try Supabase insert
      if (window.supabaseClient) {
        try {
          const { error } = await window.supabaseClient
            .from('certifications')
            .insert([newCert]);

          if (!error) {
            showStatus(certStatus, '✅ Certificate added live to cloud database!', 'success');
            certForm.reset();
            loadAdminCertificates();
            if (window.refreshPublicData) window.refreshPublicData();
            return;
          }
        } catch(e){}
      }

      // Local Fallback
      let localCerts = [];
      const localStr = localStorage.getItem("SY_DYNAMIC_CERTS");
      if (localStr) {
        try { localCerts = JSON.parse(localStr); } catch(e){ localCerts = SITE_CONFIG.initialCertificates; }
      } else {
        localCerts = [...SITE_CONFIG.initialCertificates];
      }

      localCerts.unshift(newCert);
      localStorage.setItem("SY_DYNAMIC_CERTS", JSON.stringify(localCerts));

      showStatus(certStatus, '✅ Certificate added live to storage!', 'success');
      certForm.reset();
      loadAdminCertificates();
      if (window.refreshPublicData) window.refreshPublicData();
    });
  }

  async function loadAdminCertificates() {
    if (!certListContainer) return;

    let certs = [];
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) certs = data;
      } catch(e){}
    }

    if (certs.length === 0) {
      const localStr = localStorage.getItem("SY_DYNAMIC_CERTS");
      if (localStr) {
        try { certs = JSON.parse(localStr); } catch(e){ certs = SITE_CONFIG.initialCertificates; }
      } else {
        certs = SITE_CONFIG.initialCertificates;
      }
    }

    certListContainer.innerHTML = certs.map(cert => `
      <div class="glass-card" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem; margin-bottom:0.75rem;">
        <div>
          <div style="font-weight:700; font-size:1rem;">${cert.title}</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">${cert.issuer || cert.organization} • ${cert.date}</div>
        </div>
        <button onclick="deleteCertificate('${cert.id}')" class="btn btn-outline" style="padding:0.4rem 0.8rem; border-color:#ff5252; color:#ff5252; font-size:0.85rem;">
          <i class="lucide-trash-2"></i> Delete
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  window.deleteCertificate = async function (id) {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('certifications').delete().eq('id', id);
      } catch(e){}
    }

    let localCerts = [];
    const localStr = localStorage.getItem("SY_DYNAMIC_CERTS");
    if (localStr) {
      try { localCerts = JSON.parse(localStr); } catch(e){ localCerts = [...SITE_CONFIG.initialCertificates]; }
    } else {
      localCerts = [...SITE_CONFIG.initialCertificates];
    }

    localCerts = localCerts.filter(c => c.id !== id);
    localStorage.setItem("SY_DYNAMIC_CERTS", JSON.stringify(localCerts));

    loadAdminCertificates();
    if (window.refreshPublicData) window.refreshPublicData();
  };

  /* 4. Supabase Credentials Management */
  const supabaseForm = document.getElementById('admin-supabase-form');
  const urlInput = document.getElementById('supabase-url-input');
  const keyInput = document.getElementById('supabase-key-input');
  const supabaseStatus = document.getElementById('supabase-status');

  if (supabaseForm) {
    supabaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = urlInput.value.trim();
      const key = keyInput.value.trim();

      localStorage.setItem("SY_SUPABASE_URL", url);
      localStorage.setItem("SY_SUPABASE_KEY", key);

      initSupabase();
      showStatus(supabaseStatus, '✅ Supabase credentials saved! Attempting live connection...', 'success');
      loadAdminCertificates();
      if (window.refreshPublicData) window.refreshPublicData();
    });
  }

  function loadSupabaseSettings() {
    if (urlInput) urlInput.value = localStorage.getItem("SY_SUPABASE_URL") || '';
    if (keyInput) keyInput.value = localStorage.getItem("SY_SUPABASE_KEY") || '';
  }

  function showStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.style.color = type === 'success' ? '#00e676' : type === 'error' ? '#ff5252' : '#4facfe';
    el.style.marginTop = '0.75rem';
    el.style.fontWeight = '600';
  }
});
