// supabase initialization/auth functions
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function login(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    return user;
}

async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return user;
}

// Track all loaded jobs for filtering
let allJobListings = [];

// Function to render job listings
function renderJobListings(jobListings) {
    const jobsGrid = document.getElementById('jobs-grid');
    jobsGrid.innerHTML = '';

    jobListings.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job-card');
        jobElement.innerHTML = `<h3>${job.title}</h3>`;
        if (job.company) {
            jobElement.innerHTML += `<p class="company">${job.company}</p>`;
        }
        if (job.location || job.salary) {
            jobElement.innerHTML += `<p class="meta">${[job.location, job.salary].filter(Boolean).join(' \u2022 ')}</p>`;
        }
        if (job.description) {
            jobElement.innerHTML += `<p class="description">${job.description}</p>`;
        }

        const params = new URLSearchParams({
            jobId: job.id,
            title: job.title,
            company: job.company || '',
            location: job.location || '',
            salary: job.salary || '',
            description: job.description || ''
        });

        const applyUrl = job.applyUrl ? job.applyUrl : `application.html?${params.toString()}`;
        jobElement.innerHTML += `<a href='${applyUrl}' class='apply-btn'>Apply Now</a>`;
        jobsGrid.appendChild(jobElement);
    });
}

// Load jobs from Supabase table and merge with local mock jobListings
async function loadJobs() {
    const { data: jobs, error } = await supabase.from('jobs').select('*');
    if (error) throw error;

    const localJobListings = [
        { id: 1, title: 'Local Job 1', company: 'Company A', location: 'New York', salary: '$80k-$100k', description: 'An exciting opportunity at Company A.' },
        { id: 2, title: 'Local Job 2', company: 'Company B', location: 'San Francisco', salary: '$90k-$110k', description: 'Join the team at Company B in San Francisco.' }
    ];

    allJobListings = [...localJobListings, ...jobs];
    renderJobListings(allJobListings);
}

// Keep filterJobs working with #job-search
document.getElementById('job-search').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredJobs = allJobListings.filter(job => job.title.toLowerCase().includes(searchTerm));
    renderJobListings(filteredJobs);
});

// Initialize the application by loading jobs from Supabase
loadJobs();
