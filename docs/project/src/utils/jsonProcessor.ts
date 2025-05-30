import { extractFields } from './fieldExtractor';

/**
 * Process multiple JSON files and return an array of objects with extracted fields
 */
export const processJSONFiles = async (files: File[]): Promise<any[]> => {
  try {
    // Process all files and get their contents
    const fileContentsPromises = files.map(file => readFileAsJSON(file));
    const fileContents = await Promise.all(fileContentsPromises);
    
    // Process and combine data from all files
    let allData: any[] = [];
    
    fileContents.forEach(content => {
      // Handle different possible structures
      if (content.reports) {
        allData = [...allData, ...processContent(content.reports)];
      }
      if (content.summary) {
        allData = [...allData, ...processContent(content.summary)];
      }
      // Also try processing the content directly in case it's a flat array
      const directData = processContent(content);
      if (directData.length > 0) {
        allData = [...allData, ...directData];
      }
    });
    
    // Extract the specified fields from each item
    return allData.map(item => extractFields(item));
  } catch (error) {
    console.error("Error processing JSON files:", error);
    throw new Error("Failed to process JSON files. Please check if they contain valid JSON data.");
  }
};

/**
 * Recursively process content to extract all data items
 */
const processContent = (content: any): any[] => {
  if (!content) return [];
  
  if (Array.isArray(content)) {
    return content.reduce((acc: any[], item) => {
      return [...acc, ...processContent(item)];
    }, []);
  }
  
  if (typeof content === 'object') {
    // Check for both direct fields and nested structures
    const hasTargetFields = [
      'Documenttitle',
      'DocumentType',
      'Description',
      'IssueType',
      'Title'
    ].some(field => field in content);
    
    if (hasTargetFields) {
      return [content];
    }
    
    // Process all nested objects and arrays
    return Object.values(content).reduce((acc: any[], value) => {
      return [...acc, ...processContent(value)];
    }, []);
  }
  
  return [];
};

/**
 * Read a file and parse its contents as JSON
 */
const readFileAsJSON = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content);
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Invalid JSON in file ${file.name}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file ${file.name}`));
    };
    
    reader.readAsText(file);
  });
};