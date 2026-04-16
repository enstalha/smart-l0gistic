const fs = require('fs');
const path = require('path');

const files = [
    'backend/server.js',
    'ai-service/index.js',
    'ai-service/utils/heuristic.js',
    'frontend/src/App.jsx',
    'frontend/src/components/Navbar.jsx',
    'frontend/src/components/KPIWidgets.jsx',
    'frontend/src/components/FleetFilter.jsx',
    'frontend/src/components/LogisticsMap.jsx',
    'frontend/src/components/Timeline.jsx'
];

files.forEach(f => {
    const filePath = path.join(__dirname, f);
    if (fs.existsSync(filePath)) {
        let raw = fs.readFileSync(filePath, 'utf8');
        
        // Remove line comments: // ...
        let cleaned = raw.replace(/^\s*\/\/.*$/gm, '');
        
        // Remove inline JSX block comments: {/* ... */}
        cleaned = cleaned.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
        
        // Collapse triple+ newlines into double newlines
        cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(filePath, cleaned, 'utf8');
        console.log(`Cleaned: ${f}`);
    }
});
