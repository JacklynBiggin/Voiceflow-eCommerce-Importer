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
    // Don't split on newlines that are within quotes
    const records = [];
    let currentRecord = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvContent.length; i++) {
        const char = csvContent[i];
        
        if (char === '"') {
            insideQuotes = !insideQuotes;
        }
        
        if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (currentRecord.trim()) {
                records.push(currentRecord);
            }
            currentRecord = '';
            // Skip the \n if we just processed a \r
            if (char === '\r' && csvContent[i + 1] === '\n') {
                i++;
            }
        } else {
            currentRecord += char;
        }
    }
    // Don't forget the last record
    if (currentRecord.trim()) {
        records.push(currentRecord);
    }

    const headers = parseCSVLine(records[0]);
    
    const products = records.slice(1).map(record => {
        const values = parseCSVLine(record);
        
        if (values.length !== headers.length) {
            console.warn('Mismatched length:', { 
                headers, 
                headerLength: headers.length,
                values,
                valueLength: values.length,
                originalRecord: record
            });
            return null;
        }
        
        const product = {};
        headers.forEach((header, index) => {
            if (!header) return;
            const value = values[index];
            product[header] = value === '' ? null : value;
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
                currentValue += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
                // Add this character to preserve original quotes
                currentValue += char;
            }
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    values.push(currentValue);
    
    return values.map(value => {
        // Only clean up if the value starts and ends with quotes
        if (value.startsWith('"') && value.endsWith('"')) {
            // Remove only the enclosing quotes
            value = value.slice(1, -1);
            // Replace escaped quotes with single quotes
            value = value.replace(/""/g, '"');
        }
        return value.trim();
    });
}
