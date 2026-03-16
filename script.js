// Supabase initialization (browser/CDN version)
const SB_URL = 'https://chemxkfqskspirippbnd.supabase.co';
const SB_KEY = 'sb_publishable_qLFnasO54KKmAbJN_kbMRA_zgIAot8h';

// Guard: make sure the Supabase script is loaded
if (typeof supabase === 'undefined') {
  console.error('Supabase SDK not found. Include the Supabase CDN script before script.js.');
}

// Use 'supabaseClient' to avoid naming conflicts
const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SB_URL, SB_KEY)
  : null;

function showError(message) {
  console.error('JobBridge Error:', message);
  alert('⚠️ ' + message);
}

async function signUp() {
  if (!supabaseClient) return showError('Supabase client not initialized.');

  const email = document.getElementById('email')?.value || '';
  const password = document.getElementById('password')?.value || '';

  if (!email || !password) return showError('Please enter both an email and password.');

  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;

    alert('Success! Check your email for the confirmation link.');
    console.log('signUp result:', data);
  } catch (err) {
    showError(err?.message || 'An unexpected error occurred during sign up.');
  }
}

async function login() {
  if (!supabaseClient) return showError('Supabase client not initialized.');

  const email = document.getElementById('email')?.value || '';
  const password = document.getElementById('password')?.value || '';

  if (!email || !password) return showError('Email and password are required.');

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;

    console.log('User logged in:', data?.user);
    window.location.href = 'dashboard.html';
  } catch (err) {
    if (err?.status === 400) showError('Invalid login credentials. Please try again.');
    else if (err?.status === 429) showError('Too many attempts. Please wait a moment.');
    else showError(err?.message || 'Login failed.');
  }
}

async function handleAuth(provider) {
  if (!supabaseClient) return showError('Supabase client not initialized.');

  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: String(provider || '').toLowerCase(),
      options: { redirectTo: window.location.origin },
    });

    if (error) throw error;
  } catch (err) {
    showError(`Could not connect to ${provider}: ${err?.message || err}`);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function executeSearch() {
  const query = document.getElementById('search-input')?.value || '';
  const resultsArea = document.getElementById('results-area');
  if (!resultsArea) return;

  if (!query) {
    resultsArea.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  resultsArea.innerHTML = `
    <div class="card">
      <h4>Results for "${escapeHtml(query)}"</h4>
      <p>1. Software Engineer at TechCorp</p>
      <p>2. Product Designer at CreativeInc</p>
    </div>
  `;
}

// Simple routes object (placeholder)
const routes = {
  onboarding: `
    <div class="card">
      <h2>Complete Your Profile</h2>
      <p>Tell us a bit about yourself to get started.</p>
      <div class="input-group">
        <label>Full Name</label>
        <input type="text" id="prof-name" placeholder="John Doe" style="width:100%; margin-bottom:10px; padding:8px;">
      </div>
      <div class="input-group">
        <label>Job Title</label>
        <input type="text" id="prof-title" placeholder="Software Engineer" style="width:100%; margin-bottom:10px; padding:8px;">
      </div>
      <div class="input-group">
        <label>Bio</label>
        <textarea id="prof-bio" placeholder="Briefly describe your experience..." style="width:100%; height:80px; margin-bottom:10px; padding:8px;"></textarea>
      </div>
      <button class="connect-btn" onclick="saveProfile()">Save Profile & Continue</button>
    </div>
  `,
  search: `... (as defined in previous step)`,
};

function toggleSidebar() {
  const panel = document.getElementById('side-panel');
  const toggleBtn = document.getElementById('toggle-panel');
  if (!panel || !toggleBtn) return;

  panel.classList.toggle('hidden');
  toggleBtn.innerText = panel.classList.contains('hidden') ? 'Show List' : 'Hide List';
}

const jobListings = [
  {
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120k – $160k',
    description: 'Build scalable web applications using modern JavaScript frameworks. Collaborate with cross-functional teams to deliver high-quality software.',
  },
  {
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    salary: '$110k – $150k',
    description: 'Define product vision and roadmap, work closely with engineering and design teams to deliver exceptional user experiences.',
  },
  {
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Austin, TX',
    salary: '$90k – $120k',
    description: 'Create intuitive and beautiful user interfaces. Conduct user research and translate insights into compelling design solutions.',
  },
  {
    title: 'Data Analyst',
    company: 'DataDriven Inc.',
    location: 'Remote',
    salary: '$85k – $110k',
    description: 'Analyze large datasets to uncover business insights. Build dashboards and reports to support data-driven decision making.',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudOps',
    location: 'Seattle, WA',
    salary: '$115k – $155k',
    description: 'Manage CI/CD pipelines, cloud infrastructure, and automation to keep our systems reliable, scalable, and secure.',
  },
  {
    title: 'Marketing Specialist',
    company: 'GrowthLab',
    location: 'Chicago, IL',
    salary: '$65k – $85k',
    description: 'Plan and execute digital marketing campaigns across multiple channels. Analyze performance metrics and optimize for growth.',
  },
];

function renderJobListings(jobs) {
  const grid = document.getElementById('jobs-grid');
  if (!grid) return;

  if (!Array.isArray(jobs) || jobs.length === 0) {
    grid.innerHTML = '<p class="no-results">No jobs found matching your search.</p>';
    return;
  }

  grid.innerHTML = jobs
    .map(
      (job, index) => `
        <div class="job-card">
          <h3>${escapeHtml(job.title)}</h3>
          <span class="company">${escapeHtml(job.company)}</span>
          <div class="meta">
            <span>📍 ${escapeHtml(job.location)}</span>
            <span>💰 ${escapeHtml(job.salary)}</span>
          </div>
          <p class="description">${escapeHtml(job.description)}</p>
          <button class="apply-btn" data-index="${index}">Apply Now</button>
        </div>
      `,
    )
    .join('');

  grid.querySelectorAll('.apply-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const job = jobs[parseInt(this.dataset.index, 10)];
      alert('Applying for ' + job.title + ' at ' + job.company);
    });
  });
}

function filterJobs() {
  const query = (document.getElementById('job-search')?.value || '').toLowerCase().trim();
  const filtered = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query),
  );

  renderJobListings(filtered);
}

if (document.getElementById('jobs-grid')) {
  renderJobListings(jobListings);

  const searchInput = document.getElementById('job-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterJobs);
  }
}