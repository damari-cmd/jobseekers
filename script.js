// Initialization with your provided key
const SB_URL = 'https://chemxkfqskspirippbnd.supabase.co';
const SB_KEY = 'sb_publishable_qLFnasO54KKmAbJN_kbMRA_zgIAot8h';

// Use 'supabaseClient' instead of 'supabase' to avoid errors
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// Update your auth functions to use the new client name
async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabaseClient.auth.signUp({ email, password }); // Use supabaseClient
    if (error) alert(error.message);
    else alert("Check your email for the confirmation link!");
}
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Login Error: " + error.message);
    } else {
        alert("Login successful!");
        window.location.href = "index.html"; // Redirects to your main app
    }
}

// Social Redirect (Google/Apple)
async function handleAuth(provider) {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
            redirectTo: window.location.origin // Redirects back to your site
        }
    });

    if (error) alert("Authentication Error: " + error.message);
}
        alert(error.message);
    } else {
        // Redirect to the search page after successful login
        navigate('search'); 
    }
}function executeSearch() {
    const query = document.getElementById('search-input').value;
    const resultsArea = document.getElementById('results-area');
    
    if (!query) {
        resultsArea.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    // Mock results - in a real app, you'd fetch from Supabase here
    resultsArea.innerHTML = `
        <div class="card">
            <h4>Results for "${query}"</h4>
            <p>1. Software Engineer at TechCorp</p>
            <p>2. Product Designer at CreativeInc</p>
        </div>
    `;
}  
// Add this to your existing 'routes' object in script.js
const routes = {
    // ... your existing home, jobs, network, and login routes ...
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
    search: `... (as defined in previous step)`
};function login() {
    const email = document.getElementById('email').value;
    if(email) {
        alert("Logging in as " + email);
        // This MUST match the filename you created in Step 1
        window.location.href = "dashboard.html"; 
    } else {
        alert("Please enter an email");
    }
}
// Initialization
const SB_URL = 'https://chemxkfqskspirippbnd.supabase.co';
const SB_KEY = 'sb_publishable_qLFnasO54KKmAbJN_kbMRA_zgIAot8h';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

/**
 * Helper to display errors to the user
 * You can replace 'alert' with a custom UI toast/notification later
 */
function showError(message) {
    console.error("JobBridge Error:", message);
    alert("⚠️ " + message);
}

// Improved Sign Up
async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return showError("Please enter both an email and password.");
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        
        if (error) throw error; // Jump to catch block

        if (data.user) {
            alert("Success! Check your email for the confirmation link.");
        }
    } catch (err) {
        showError(err.message || "An unexpected error occurred during sign up.");
    }
}

// Improved Email Login
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

        // Success
        console.log("User logged in:", data.user);
        window.location.href = "dashboard.html"; 
    } catch (err) {
        // Handle specific Supabase error cases
        if (err.status === 400) {
            showError("Invalid login credentials. Please try again.");
        } else if (err.status === 429) {
            showError("Too many attempts. Please wait a moment.");
        } else {
            showError(err.message);
        }
    }
}

// Improved Social Redirect
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
