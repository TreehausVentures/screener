/**
 * Convert an array of objects to a CSV string
 */
export const downloadCSV = (data: any[]): string => {
  if (!data || data.length === 0) {
    throw new Error('No data to convert to CSV');
  }
  
  // Define the fields we want in the CSV
  const fields = [
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
  
  // Create the header row
  const csvRows = [fields.join(',')];
  
  // Process each data row
  for (const item of data) {
    const values = fields.map(field => {
      const value = item[field];
      
      // Handle various data types
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'object') {
        // Stringify objects but escape quotes and commas
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = value.replace(/"/g, '""');
        return /[",\n]/.test(value) ? `"${escaped}"` : escaped;
      }
      
      return String(value);
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};