document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const email = form?.querySelector('input[name="email"]');
  const password = form?.querySelector('input[name="password"]');

  if (!form || !email || !password) return;

  email.type = 'email';
  email.required = true;
  email.autocomplete = 'username';
  password.required = true;
  password.minLength = 6;
  password.autocomplete = 'current-password';

  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-labelledby', 'admin-login-progress-label');
  dialog.innerHTML = `
    <style>
      dialog.admin-login-progress {
        border: 0;
        border-radius: 8px;
        padding: 24px 32px;
        color: #17212b;
        font: 500 16px/1.4 system-ui, sans-serif;
        box-shadow: 0 12px 40px rgba(0, 0, 0, .2);
      }
      dialog.admin-login-progress::backdrop { background: rgba(15, 23, 32, .48); }
      .admin-login-progress-content { display: flex; align-items: center; gap: 12px; }
      .admin-login-progress-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid #c8d2dc;
        border-top-color: #167d68;
        border-radius: 50%;
        animation: admin-login-spin .8s linear infinite;
      }
      @keyframes admin-login-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .admin-login-progress-spinner { animation-duration: 2s; }
      }
    </style>
    <div class="admin-login-progress-content">
      <span class="admin-login-progress-spinner" aria-hidden="true"></span>
      <span id="admin-login-progress-label">Signing in...</span>
    </div>
  `;
  dialog.className = 'admin-login-progress';
  document.body.append(dialog);

  form.addEventListener('submit', () => {
    dialog.showModal();
    form.setAttribute('aria-busy', 'true');
    const submitButton = form.querySelector('button[type="submit"], button:not([type])');
    if (submitButton) submitButton.disabled = true;
  });
});