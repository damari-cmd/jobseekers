const SB_URL = 'https://chemxkfqskspirippbnd.supabase.co';
const SB_KEY = 'sb_publishable_qLFnasO54KKmAbJN_kbMRA_zgIAot8h';
const supabase = supabase.createClient(SB_URL, SB_KEY);

// --- ROUTES ---
const routes = {
    home: `<h1>Welcome to JobBridge</h1><p>Connect with employers easily.</p>`,
    jobs: `<h1>Available Positions</h1><div class="card"><h3>Frontend Developer</h3></div>`,
    network: `<h1>Community Feed</h1><div id="user-list"></div>`,
    login: `
        <div class="card">
            <h2>Login / Sign Up</h2>
            <input type="email" id="email" placeholder="Email" style="display:block; margin: 10px 0; padding: 8px; width: 100%;">
            <input type="password" id="password" placeholder="Password" style="display:block; margin: 10px 0; padding: 8px; width: 100%;">
            <button onclick="signIn()" style="background: var(--primary); color: white;">Sign In</button>
            <button onclick="signUp()">Sign Up</button>
            <p id="auth-msg"></p>
        </div>
    `
};

// --- AUTH LOGIC ---
async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for the confirmation link!");
}

async function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('home');
}

async function signOut() {
    await supabase.auth.signOut();
    navigate('home');
}

function handleAuthNav() {
    supabase.auth.getSession().then(({ data }) => {
        if (data.session) signOut();
        else navigate('login');
    });
}

// Update Nav Button based on Auth State
supabase.auth.onAuthStateChange((event, session) => {
    const btn = document.getElementById('auth-btn');
    if (session) {
        btn.innerText = "Logout (" + session.user.email.split('@')[0] + ")";
    } else {
        btn.innerText = "Login";
    }
});

// --- NAVIGATION ---
function navigate(page) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = routes[page] || `<h1>404</h1>`;
    if (page === 'network') loadUsers();
}

function loadUsers() {
    const container = document.getElementById('user-list');
    if (!container) return;
    container.innerHTML = `<div class="card"><strong>Sarah Jenkins</strong> - Marketing</div>`;
}

navigate('home');
const loginForm = document.getElementById('login-form');
const loginPage = document.getElementById('login-page');
const searchPage = document.getElementById('search-page');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // 1. Simulate Authentication (In a real app, check this against a database)
  const isAuthorized = true; 

  if (isAuthorized) {
    // 2. "Navigate" by swapping display styles
    loginPage.style.display = 'none';
    searchPage.style.display = 'block';
    
    // 3. Focus the search bar automatically for better UX
    document.getElementById('search-input').focus();
  }
});
