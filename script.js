// Initialization
const SB_URL = 'https://chemxkfqskspirippbnd.supabase.co';
const SB_KEY = 'sb_publishable_qLFnasO54KKmAbJN_kbMRA_zgIAot8h';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

/**
 * Helper to display errors to the user
 */
function showError(message) {
    console.error("JobBridge Error:", message);
    alert("⚠️ " + message);
}

// Sign Up
async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return showError("Please enter both an email and password.");
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });

        if (error) throw error;

        if (data.user) {
            alert("Success! Check your email for the confirmation link.");
        }
    } catch (err) {
        showError(err.message || "An unexpected error occurred during sign up.");
    }
}

// Email Login
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return showError("Email and password are required.");
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        console.log("User logged in:", data.user);
        window.location.href = "dashboard.html";
    } catch (err) {
        if (err.status === 400) {
            showError("Invalid login credentials. Please try again.");
        } else if (err.status === 429) {
            showError("Too many attempts. Please wait a moment.");
        } else {
            showError(err.message);
        }
    }
}

// Social Redirect (Google/Apple)
async function handleAuth(provider) {
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: provider.toLowerCase(),
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
    } catch (err) {
        showError(`Could not connect to ${provider}: ${err.message}`);
    }
}

function toggleSidebar() {
    const panel = document.getElementById('side-panel');
    const toggleBtn = document.getElementById('toggle-panel');
    
    panel.classList.toggle('hidden');

    // Update button text based on state
    if (panel.classList.contains('hidden')) {
        toggleBtn.innerText = "Show List";
    } else {
        toggleBtn.innerText = "Hide List";
    }
}

// Mock job data for demonstration
const jobListings = [
    {
        title: "Software Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        salary: "$120k – $160k",
        description: "Build scalable web applications using modern JavaScript frameworks. Collaborate with cross-functional teams to deliver high-quality software."
    },
    {
        title: "Product Manager",
        company: "InnovateCo",
        location: "New York, NY",
        salary: "$110k – $150k",
        description: "Define product vision and roadmap, work closely with engineering and design teams to deliver exceptional user experiences."
    },
    {
        title: "UX Designer",
        company: "DesignHub",
        location: "Austin, TX",
        salary: "$90k – $120k",
        description: "Create intuitive and beautiful user interfaces. Conduct user research and translate insights into compelling design solutions."
    },
    {
        title: "Data Analyst",
        company: "DataDriven Inc.",
        location: "Remote",
        salary: "$85k – $110k",
        description: "Analyze large datasets to uncover business insights. Build dashboards and reports to support data-driven decision making."
    },
    {
        title: "DevOps Engineer",
        company: "CloudOps",
        location: "Seattle, WA",
        salary: "$115k – $155k",
        description: "Manage CI/CD pipelines, cloud infrastructure, and automation to keep our systems reliable, scalable, and secure."
    },
    {
        title: "Marketing Specialist",
        company: "GrowthLab",
        location: "Chicago, IL",
        salary: "$65k – $85k",
        description: "Plan and execute digital marketing campaigns across multiple channels. Analyze performance metrics and optimize for growth."
    }
];

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderJobListings(jobs) {
    const grid = document.getElementById('jobs-grid');
    if (!grid) return;

    if (jobs.length === 0) {
        grid.innerHTML = '<p class="no-results">No jobs found matching your search.</p>';
        return;
    }

    grid.innerHTML = jobs.map((job, index) => `
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
    `).join('');

    grid.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const job = jobs[parseInt(this.dataset.index, 10)];
            alert('Applying for ' + job.title + ' at ' + job.company);
        });
    });
}

function filterJobs() {
    const query = document.getElementById('job-search').value.toLowerCase().trim();
    const filtered = jobListings.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
    );
    renderJobListings(filtered);
}

// Render all job listings on page load if the grid exists
if (document.getElementById('jobs-grid')) {
    renderJobListings(jobListings);

    // Filter jobs in real-time as user types
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterJobs);
    }
}
