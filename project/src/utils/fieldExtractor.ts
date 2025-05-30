/**
 * Extract specified fields from a JSON object
 * Handles nested objects by flattening them
 */
export const extractFields = (data: any): any => {
  // Define the fields we want to extract
  const fieldsToExtract = [
    'Documenttitle', 
    'DocumentType', 
    'BorrowerItemType', 
    'Names', 
    'DateOrPeriod', 
    'AccountType', 
    'Assessment', 
    'IssueType',
    'Title',
    'Description', 
    'Severity', 
    'Recommendation'
  ];
  
  // Initialize result object with empty values for all fields
  const result: Record<string, any> = {};
  fieldsToExtract.forEach(field => {
    result[field] = undefined;
  });
  
  // Function to recursively search for fields in nested objects
  const findFields = (obj: any, prefix = ''): void => {
    if (!obj || typeof obj !== 'object') return;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      // For arrays, we'll join the values with a comma
      const values = obj.map(item => {
        if (typeof item === 'object') {
          return JSON.stringify(item);
        }
        return String(item);
      });
      if (fieldsToExtract.includes(prefix.slice(0, -1))) {
        result[prefix.slice(0, -1)] = values.join(', ');
      }
      obj.forEach(item => {
        if (typeof item === 'object') {
          findFields(item, prefix);
        }
      });
      return;
    }
    
    // Process each key in the object
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}${key}` : key;
      
      // If this key is one we're looking for, add it to result
      if (fieldsToExtract.includes(key)) {
        if (Array.isArray(value)) {
          result[key] = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          result[key] = JSON.stringify(value);
        } else {
          result[key] = value;
        }
      }
      
      // Recursively process nested objects
      if (value && typeof value === 'object') {
        findFields(value, `${fullKey}.`);
      }
    });
  };
  
  // Start the recursive search
  findFields(data);
  
  return result;
};