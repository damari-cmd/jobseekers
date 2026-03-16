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

// Function to render job listings
async function renderJobListings(jobListings) {
    const jobsGrid = document.getElementById('jobs-grid');
    jobsGrid.innerHTML = '';

    jobListings.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job');
        jobElement.innerHTML = `<h3>${job.title}</h3>`;

        const applyUrl = job.applyUrl ? job.applyUrl : `application.html?jobId=${job.id}`;
        jobElement.innerHTML += `<a href='${applyUrl}' class='apply-now'>Apply Now</a>`;
        jobsGrid.appendChild(jobElement);
    });
}

// Load jobs from Supabase table and merge with local mock jobListings
async function loadJobs() {
    const { data: jobs, error } = await supabase.from('jobs').select('*');
    if (error) throw error;

    const localJobListings = [
        { id: 1, title: 'Local Job 1' },
        { id: 2, title: 'Local Job 2' }
    ];

    const mergedJobListings = [...localJobListings, ...jobs];
    renderJobListings(mergedJobListings);
}

// Keep filterJobs working with #job-search
document.getElementById('job-search').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredJobs = mergedJobListings.filter(job => job.title.toLowerCase().includes(searchTerm));
    renderJobListings(filteredJobs);
});

// Initialize the application by loading jobs from Supabase
loadJobs();
