import sys
import re

filepath = 'C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import React, { useState, useEffect, useRef } from 'react';",
    "import { useMsal } from '@azure/msal-react';\nimport React, { useState, useEffect, useRef } from 'react';"
)
content = content.replace(
    "import { \n",
    "import { Bot, Megaphone, \n"
)
# just in case it's on one line:
content = content.replace(
    "import { LayoutDashboard",
    "import { Bot, Megaphone, LayoutDashboard"
)

# 2. useMsal hook
content = content.replace(
    "export default function App() {",
    "export default function App() {\n  const { instance, accounts } = useMsal();"
)

# 3. Add handleMicrosoftLogin, MSAL auto-login, and update handleLogout
logout_target = """  const handleLogout = () => {
    setIsLoggedIn(false);
  };"""

msal_logic = """  const handleMicrosoftLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await instance.loginRedirect({ scopes: ["User.Read"] });
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Microsoft Login failed');
    }
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch(() => setIsLoggedIn(false));
  };

  useEffect(() => {
    if (accounts && accounts.length > 0 && !isLoggedIn) {
      const profile = {
          name: accounts[0].name || 'Microsoft User',
          email: accounts[0].username,
          role: 'Employee',
          department: 'General'
      };
      // Note: setUserProfile is called safely if we are in the effect
      setIsLoggedIn(true);
    }
  }, [accounts, isLoggedIn]);"""

content = content.replace(logout_target, msal_logic)

# 4. Iframes
content = content.replace(
    "'real-data': 'PostgreSQL Raw Row Viewer'",
    "'real-data': 'PostgreSQL Raw Row Viewer',\n    'nextchat': 'NextChat (Dify)',\n    'meeting-ai': 'Meeting AI'"
)

content = content.replace(
    "{ id: 'real-data', label: TRANSLATIONS[lang]?.realData || 'Real Data', desc: 'Inspect raw PostgreSQL data rows', icon: Info, color: '#c084fc' }",
    "{ id: 'real-data', label: TRANSLATIONS[lang]?.realData || 'Real Data', desc: 'Inspect raw PostgreSQL data rows', icon: Info, color: '#c084fc' },\n      { id: 'nextchat', label: 'NextChat (Dify)', desc: 'Enterprise AI NextChat Gateway', icon: Bot, color: '#f59e0b' },\n      { id: 'meeting-ai', label: 'Meeting AI', desc: 'Transcriber and Meeting Summarization', icon: Megaphone, color: '#10b981' }"
)

iframes_html = """
        {activeSubView === 'nextchat' && (
          <div style={{ height: '80vh', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe src="http://localhost:3001" style={{ width: '100%', height: '100%', border: 'none' }} title="NextChat" />
          </div>
        )}
        {activeSubView === 'meeting-ai' && (
          <div style={{ height: '80vh', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe src="http://localhost:3000" style={{ width: '100%', height: '100%', border: 'none' }} title="Meeting AI" />
          </div>
        )}
        {activeSubView === 'real-data' && ("""
content = content.replace("{activeSubView === 'real-data' && (", iframes_html)


# 5. Fix Login Form! (Strip username/password, use exact string slicing to be 100% safe)
pattern = re.compile(
    r'\{\/\* Form \*\/\}.*?\{\/\* Demo Helper Card \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>',
    re.DOTALL
)

replacement = """{/* Form */}
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <button 
                type="button"
                onClick={handleMicrosoftLogin}
                style={{
                  backgroundColor: '#0078D4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.8rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
                  transition: 'opacity 0.2s',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21"><path fill="#f35325" d="M0 0h10v10H0z"/><path fill="#81bc06" d="M11 0h10v10H11z"/><path fill="#05a6f0" d="M0 11h10v10H0z"/><path fill="#ffba08" d="M11 11h10v10H11z"/></svg>
                {lang === 'en' ? 'Sign In with Microsoft' : '使用 Microsoft 登入'}
              </button>
            </form>

            {/* MSAL Status Display */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                MSAL Status: {accounts && accounts.length > 0 ? (
                  <strong style={{ color: '#10b981' }}>Connected ({accounts[0].username})</strong>
                ) : (
                  <strong style={{ color: '#f59e0b' }}>Not Connected</strong>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>"""

content = pattern.sub(replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied successfully!")
