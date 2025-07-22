export function generateFormHTML(encodedState: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Openfort Authentication</title>
        <link rel="icon" type="image/x-icon" href="https://dashboard.openfort.io/favicon.ico">
        <style>
          body {
            font-family: var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: #fff;
            padding: 2rem 2.5rem;
            border-radius: 8px;
            box-shadow: 0 8px 36px 8px rgba(0, 0, 0, 0.06);
            max-width: 400px;
            width: 100%;
          }
          h1 {
            font-size: 1.25rem;
            margin-top: 0;
            margin-bottom: 2rem;
            text-align: center;
          }
          label {
            display: block;
            margin-bottom: 0.25rem;
            font-weight: 500;
          }
          input[type="email"],
          input[type="password"] {
            width: calc(100% - 2rem);
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
          }
          button {
            width: 100%;
            padding: 0.5rem 0.75rem;
            background: #f97316;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
          }
          .divider {
            margin: 1.5rem 0;
            display: flex;
            align-items: center;
            color: #6b7280;
            font-size: 0.875rem;
          }
          .divider::before,
          .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #e5e7eb;
          }
          .divider::before {
            margin-right: 0.75rem;
          }
          .divider::after {
            margin-left: 0.75rem;
          }
          .social {
            display: flex;
            justify-content: space-between;
            gap: 10px;
          }
          .social-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 5px;
            border: 1px solid #d1d5db;
            color: black;
            border-radius: 6px;
            background: #fff;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
          <svg viewBox="0 1 39 11" aria-hidden="true" style="display: block; height: 2rem; width: auto; opacity: 30%; padding-bottom: 1rem;"><path class="fill-zinc-400" transform="translate(0, 5) scale(0.04)" d="m75.9 72.3h18.2v32.4h-18.2zm94.8 32.3h-18.2v-87.1h-135v87.1h-18.2v-105.2h13.5v-0.1h157.9v0.1zm-36.5-50.7h-0.1v50.7h-18.2v-50.7h-61.9v50.7h-18.2v-66.5-2.4h98.4z"></path><path class="fill-zinc-400" transform="scale(0.04) translate(220, 90)" d="m48.4 137.1q-14.9 0-25.8-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6.1-27.3 6-11.7 16.9-18.3 10.9-6.5 25.5-6.5 14.8 0 25.7 6.6 10.9 6.7 16.9 18.5 5.9 11.7 5.9 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.6 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.9 4.4-6.2 4.3-9.2 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.6 59.3v-142.9h17v8.9q2.6-2.7 5.6-4.8 9.5-6.8 23.5-6.8 14 0 24.1 6.8 10.1 6.8 15.6 18.6 5.5 11.8 5.5 26.7 0 14.8-5.5 26.7-5.4 11.8-15.4 18.7-10.1 6.9-23.9 6.9-14.2 0-23.8-6.9-1.8-1.3-3.5-2.8v50.9c0 0-19.2 0-19.2 0zm43.9-58.5q9.1 0 15.1-4.7 6-4.7 9-12.6 3-7.9 3-17.7 0-9.7-3-17.6-3-7.9-9.1-12.5-6.1-4.7-15.7-4.7-8.9 0-14.8 4.4-5.8 4.4-8.6 12.3-2.8 7.8-2.8 18.1 0 10.3 2.8 18.1 2.7 7.9 8.7 12.4 5.9 4.5 15.4 4.5zm111.4 17.3q-14.7 0-25.8-6.5-11.2-6.4-17.4-18-6.1-11.6-6.1-26.9 0-16.2 6-28.1 6.1-11.9 17-18.4 10.9-6.5 25.4-6.5 15.1 0 25.7 7 10.7 7 15.9 19.9 5.3 12.9 4.2 30.7h-9.5v-0.3h-9.6v0.3h-54.1v0.7h-0.4q1.1 11.9 6.9 19.1 7.3 8.9 20.9 9 9 0 15.5-4.1 6.6-4.1 10.2-11.7l18.8 5.9q-5.8 13.3-17.5 20.6-11.7 7.3-26.1 7.3zm19.2-79.2q-6.4-8.3-19.4-8.3-14.3 0-21.6 9.1-4.9 6.2-6.5 16.2v0.5l53-0.1v-0.3h0.5q-1.3-11-6-17.1zm43.4 76.4v-98.9h17.1v11.9q4.1-5.2 9.9-8.8 9.5-5.7 22.8-5.7 10.3 0 17.3 3.3 6.9 3.3 11.3 8.6 4.3 5.4 6.6 11.7 2.3 6.3 3.1 12.4 0.8 6 0.8 10.6v55h-19.4v-48.7q0-5.8-0.9-11.9-1-6-3.7-11.3-2.7-5.2-7.6-8.4-4.9-3.2-12.8-3.2-5.1 0-9.7 1.7-4.6 1.7-8 5.4-3.4 3.8-5.4 9.9-2 6.2-2 15v51.4zm105.4-83.5v-15.4h16.4v-3.5q0-3.7 0.3-8 0.3-4.2 1.6-8.4 1.3-4.2 4.5-7.7 3.7-4.1 8.2-5.8 4.5-1.8 8.9-2 4.5-0.3 8.2-0.3h12.5v15.8h-11.5q-6.8-0.1-10.2 3.3-3.3 3.3-3.3 9.5v7.1h25v15.4h-25v83.5h-19.2v-83.5zm114.5 86.3q-14.8 0-25.7-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6-27.3 6.1-11.7 17-18.3 10.9-6.5 25.4-6.5 14.9 0 25.8 6.6 10.9 6.7 16.8 18.5 6 11.7 6 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.7 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.8 4.4-6.3 4.3-9.3 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.7-83.6h17.1v15.8q1.1-1.9 2.3-3.7 3-3.9 6.8-6.5 3.8-2.8 8.4-4.3 4.6-1.5 9.5-1.8 4.8-0.3 9.3 0.5v17.9q-4.8-1.2-10.7-0.7-5.9 0.6-10.9 3.8-4.7 3-7.4 7.3-2.7 4.3-3.9 9.6-1.2 5.2-1.2 11.1v49.9h-19.3zm17.1 15.8q-0.5 0.9-1 1.8h1zm42.7-0.4v-15.4h19v-27.5h19.2v27.5h29.4v15.4h-29.4v43.7q0 5.9 0.2 10.3 0.1 4.4 1.9 7.4 3.2 5.7 10.4 6.5 7.2 0.8 16.9-0.6v16.2q-9.3 1.9-18.3 1.6-9-0.3-16-3.5-7.1-3.2-10.7-10.1-3.2-6.1-3.4-12.5-0.2-6.3-0.2-14.4v-44.6z"></path></svg>
          <form class="card" method="POST" action="/authorize">
          <h1 style="text-align: left; width: 100%">Sign in to account</h1>
          <label for="email" style="text-align: left;">Email</label>
          <input id="email" name="email" type="email" required />
          <label for="password" style="text-align: left;">Password</label>
          <input id="password" name="password" type="password" required />
          <input type="hidden" name="state" value="${encodedState}" />
          <button type="submit">Sign in to account</button>
          <div class="divider"><span>Or continue with</span></div>
          <div class="social" style="display: flex; justify-content: space-between;">
            <a href="/oauth/google?state=${encodeURIComponent(encodedState)}" class="social-btn google" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px 5px; opacity: 0.4;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style="margin-left: 5px;"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"></path></svg>
            </a>
            <a href="/oauth/github?state=${encodeURIComponent(encodedState)}" class="social-btn github" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px 5px; opacity: 0.4;">
              <svg width="20" height="20" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" style="margin-left: 5px;"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path></svg>
            </a>
          </div>
        </form>
      </body>
    </html>`;
};

export function showErrorDialog(errorMessage: string): string {
  return `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.5); font-family: var(--default-font-family,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji');">
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%; text-align: center;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <button onclick="window.history.back()" style="background: none; border: none; cursor: pointer; padding: 8px; margin-right: 12px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 style="margin: 0; font-weight: 600; text-align: left; flex-grow: 1;">An error has occurred</h2>
        </div>
        <p style="text-align: left; margin-left: 44px; color: #4B5563;">${errorMessage}</p>
      </div>
    </div>
  `;
}
