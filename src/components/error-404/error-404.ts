document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.querySelector('[data-action="go-back"]');

  backBtn?.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      const app = document.getElementById('app');
      if (app) {
        const token = localStorage.getItem('access_token');
        if (token) {
          import('../chat-page/chat-page.ts').catch(console.error);
        } else {
          import('../auth-form/auth-form.ts').catch(console.error);
        }
      }
    }
  });
});

export {};