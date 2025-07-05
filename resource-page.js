// resource-page.js
window.addEventListener('DOMContentLoaded', () => {
  // Force dark mode by default on all resource pages
  document.body.classList.add('dark-mode');

  const logoutBtn = document.getElementById('logout');
  const userNameSpan = document.getElementById('user-name');
  const resourcesList = document.getElementById('resources-list');

  // Auth check
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userNameSpan.textContent = user.displayName;
      loadResources();
    } else {
      window.location.href = 'login.html';
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.location.href = 'login.html';
    });
  });

  // Determine resource type from page name
  const typeMap = {
    'notes.html': 'notes',
    'papers.html': 'papers',
    'cheatsheet.html': 'cheatsheet',
    'guide.html': 'guide'
  };
  const page = window.location.pathname.split('/').pop();
  const resourceType = typeMap[page];

  async function loadResources() {
    resourcesList.innerHTML = 'Loading...';
    let query = firebase.firestore().collection('resources').orderBy('created', 'desc');
    if (resourceType) {
      query = query.where('type', '==', resourceType);
    }
    const snap = await query.get();
    resourcesList.innerHTML = '';
    if (snap.empty) {
      resourcesList.innerHTML = '<div>No resources found.</div>';
      return;
    }
    snap.forEach(doc => {
      const data = doc.data();
      const fileIcon = data.url.endsWith('.pdf') ? '📄' : '📁';
      const fileName = decodeURIComponent(data.url.split('/').pop().split('?')[0]);
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${data.title}</strong><br>
        <span style="font-size:1.2em;">${fileIcon}</span> <a href="${data.url}" target="_blank">${fileName}</a><br>
        <small>Uploaded by: ${data.user.name}</small>`;
      resourcesList.appendChild(div);
    });
  }
});
