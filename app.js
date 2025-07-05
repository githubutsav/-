// Firebase Auth and UI logic
window.addEventListener('DOMContentLoaded', () => {
  // Force dark mode by default on all pages
  document.body.classList.add('dark-mode');

  const logoutBtn = document.getElementById('logout');
  const userNameSpan = document.getElementById('user-name');

  // Auth check: redirect to login.html if not logged in
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.replace('login.html');
    } else {
      userNameSpan.textContent = user.displayName;
      loadResources();
    }
  });

  // Remove login logic, only handle logout and main page
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      firebase.auth().signOut().then(function() {
        // Use both replace and reload to ensure redirect
        window.location.replace('login.html');
        setTimeout(() => window.location.href = 'login.html', 200);
      });
    });
  }

  // Firestore and Storage references
  const db = firebase.firestore();
  const storage = firebase.storage();
  const uploadForm = document.getElementById('upload-form');
  const resourcesList = document.getElementById('resources-list');

  // Upload resource
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;
    const file = document.getElementById('file').files[0];
    if (!file) return;
    const user = firebase.auth().currentUser;
    if (!user) return;
    const storageRef = storage.ref(`resources/${Date.now()}_${file.name}`);
    const snapshot = await storageRef.put(file);
    const url = await snapshot.ref.getDownloadURL();
    await db.collection('resources').add({
      title,
      type,
      url,
      user: { name: user.displayName, uid: user.uid },
      created: firebase.firestore.FieldValue.serverTimestamp()
    });
    uploadForm.reset();
    loadResources();
  });

  const tabBtns = document.querySelectorAll('.tab-btn');
  let currentFilter = 'all';

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-type');
      loadResources();
    });
  });

  // Load and display resources
  async function loadResources() {
    resourcesList.innerHTML = 'Loading...';
    let query = db.collection('resources').orderBy('created', 'desc');
    if (currentFilter !== 'all') {
      query = query.where('type', '==', currentFilter);
    }
    const snap = await query.get();
    resourcesList.innerHTML = '';
    if (snap.empty) {
      resourcesList.innerHTML = '<div>No resources found.</div>';
      return;
    }
    snap.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      // Show file type icon and file name for PDFs and other files
      const fileIcon = data.url.endsWith('.pdf') ? '📄' : '📁';
      const fileName = decodeURIComponent(data.url.split('/').pop().split('?')[0]);
      div.innerHTML = `
        <strong>${data.title}</strong> [${data.type}]<br>
        <span style="font-size:1.2em;">${fileIcon}</span> <a href="${data.url}" target="_blank">${fileName}</a><br>
        <small>Uploaded by: ${data.user.name}</small>`;
      resourcesList.appendChild(div);
    });
  }
});
