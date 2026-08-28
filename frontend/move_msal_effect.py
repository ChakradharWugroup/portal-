# -*- coding: utf-8 -*-
with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Extract the effect
effect_regex = r"  useEffect\(\(\) => \{\n    const checkMicrosoftLogin = async \(\) => \{.*?\n  \}, \[inProgress, accounts, isLoggedIn, instance\]\);\n"
effect_match = re.search(effect_regex, content, flags=re.DOTALL)

if effect_match:
    effect_code = effect_match.group(0)
    # Remove from top
    content = content.replace(effect_code, "")
    
    # Inject after isLoggedIn declaration
    state_decl = "const [isLoggedIn, setIsLoggedIn] = useState(false);\n"
    content = content.replace(state_decl, state_decl + "\n" + effect_code)
    
    with open('C:/Users/KalleChakradhar/Desktop/portal/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
