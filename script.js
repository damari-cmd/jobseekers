// Add the applyUrl field to job listings and update the Apply Now click handler

const jobListings = [
    // Example job listing
    {
        title: "Job Title",
        company: "Company Name",
        applyUrl: "http://example.com/apply" // Add applyUrl field
    }
];


const applyNowHandler = (job) => {
    const url = job.applyUrl || ("application.html?jobTitle=" + encodeURIComponent(job.title));
    window.open(url, '_blank');
};

// Assuming we have a button to apply for a job which will call the handler
jobListings.forEach(job => {
    const button = document.createElement('button');
    button.innerText = 'Apply Now';
    button.onclick = () => applyNowHandler(job);
    document.body.appendChild(button);
});
