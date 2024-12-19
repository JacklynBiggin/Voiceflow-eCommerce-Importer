export function parseXML(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // Convert XML nodes to JavaScript object
    const parseNode = (node) => {
        const obj = {};
        
        // Handle attributes
        if (node.attributes) {
            for (let attr of node.attributes) {
                obj[`@${attr.name}`] = attr.value;
            }
        }
        
        // Handle child nodes
        for (let child of node.children) {
            const childResult = parseNode(child);
            if (obj[child.nodeName]) {
                if (!Array.isArray(obj[child.nodeName])) {
                    obj[child.nodeName] = [obj[child.nodeName]];
                }
                obj[child.nodeName].push(childResult);
            } else {
                obj[child.nodeName] = childResult;
            }
        }
        
        // Handle text content
        if (node.children.length === 0) {
            return node.textContent;
        }
        
        return obj;
    };

    return parseNode(xmlDoc.documentElement);
}

export function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = parseCSVLine(lines[0]);
    
    const products = lines.slice(1).map(line => {
        if (!line.trim()) return null; // Skip empty lines
        const values = parseCSVLine(line);
        
        // Skip if we don't have the right number of values
        if (values.length !== headers.length) return null;
        
        const product = {};
        headers.forEach((header, index) => {
            product[header] = values[index];
        });
        return product;
    }).filter(product => product !== null);
    
    return products;
}

function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                // Handle escaped quotes (two double quotes in a row)
                currentValue += '"';
                i++; // Skip the next quote
            } else {
                // Toggle insideQuotes flag
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // End of field
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    // Push the last value
    values.push(currentValue.trim());
    
    // Clean up any remaining quotes at the start/end of values
    return values.map(value => value.replace(/^"(.*)"$/, '$1'));
}
