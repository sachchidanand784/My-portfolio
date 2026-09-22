/* dynamic-data.js - Handles public fetching & rendering of dynamic Certifications & Resume link */

async function loadPublicCertifications() {
  const container = document.getElementById('certifications-container');
  if (!container) return;

  let certs = [];

  // 1. Try Supabase first if configured
  if (window.supabaseClient) {
    try {
      const { data, error } = await window.supabaseClient
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        certs = data;
      }
    } catch (err) {
      console.warn("Supabase cert fetch failed, using fallback:", err);
    }
  }

  // 2. Fallback to localStorage or SITE_CONFIG
  if (certs.length === 0) {
    const local = localStorage.getItem("SY_DYNAMIC_CERTS");
    if (local) {
      try {
        certs = JSON.parse(local);
      } catch (e) {
        certs = SITE_CONFIG.initialCertificates;
      }
    } else {
      certs = SITE_CONFIG.initialCertificates;
    }
  }

  // Render Certifications Grid
  container.innerHTML = certs.map(cert => `
    <div class="glass-card cert-card float-anim">
      <div class="cert-icon">
        <i class="lucide-award"></i>
      </div>
      <div class="cert-meta">
        <h4 class="cert-title">${cert.title}</h4>
        <div class="cert-issuer">${cert.issuer || cert.organization} • <span style="color:var(--accent-cyan);">${cert.date}</span></div>
      </div>
      <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
        ${cert.description || 'Verified credential demonstrating domain capability and practical project application.'}
      </p>
      ${cert.file_url ? `<a href="${cert.file_url}" target="_blank" style="font-size:0.85rem; color:var(--accent-blue); display:inline-flex; align-items:center; gap:4px; font-weight:600;"><i class="lucide-external-link"></i> View Credential</a>` : ''}
    </div>
  `).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function loadPublicResume() {
  const downloadBtn = document.getElementById('hero-resume-btn');
  const dateBadge = document.getElementById('resume-updated-date');

  let resumeData = null;

  // 1. Try Supabase if configured
  if (window.supabaseClient) {
    try {
      const { data, error } = await window.supabaseClient
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        resumeData = data[0];
      }
    } catch (err) {
      console.warn("Supabase resume fetch error:", err);
    }
  }

  // 2. Fallback to localStorage or SITE_CONFIG
  if (!resumeData) {
    const local = localStorage.getItem("SY_DYNAMIC_RESUME");
    if (local) {
      try {
        resumeData = JSON.parse(local);
      } catch (e) {
        resumeData = SITE_CONFIG.initialResume;
      }
    } else {
      resumeData = SITE_CONFIG.initialResume;
    }
  }

  if (downloadBtn && resumeData.url) {
    downloadBtn.href = resumeData.url;
    downloadBtn.setAttribute('download', resumeData.filename || 'Sachchidanand_Yadav_Resume.pdf');
  }

  if (dateBadge && resumeData.lastUpdated) {
    dateBadge.textContent = `Last updated: ${resumeData.lastUpdated}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPublicCertifications();
  loadPublicResume();
});

// Expose refresh function for real-time updates after admin edits
window.refreshPublicData = function () {
  loadPublicCertifications();
  loadPublicResume();
};
