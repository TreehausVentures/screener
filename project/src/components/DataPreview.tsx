import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!data || data.length === 0) {
    return <div className="text-gray-500 italic">No data to preview</div>;
  }

  // Get field names from the first item
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

  // Only show first 3 items in collapsed view
  const displayData = expanded ? data : data.slice(0, 3);
  const totalItems = data.length;

  return (
    <div className="overflow-hidden">
      <div className="bg-gray-50 p-3 rounded-md mb-2 flex justify-between items-center">
        <span className="font-medium text-gray-700">Data Preview ({totalItems} items)</span>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-blue-500 flex items-center text-sm"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} className="mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" /> Show All
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {fields.map((field) => (
                <th
                  key={field}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {fields.map((field) => (
                  <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item[field] !== undefined ? 
                      (typeof item[field] === 'object' ? 
                        JSON.stringify(item[field]).substring(0, 30) + (JSON.stringify(item[field]).length > 30 ? '...' : '') : 
                        String(item[field]).substring(0, 30) + (String(item[field]).length > 30 ? '...' : '')) : 
                      '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!expanded && totalItems > 3 && (
        <div className="text-center mt-2 text-gray-500 text-sm">
          Showing 3 of {totalItems} items
        </div>
      )}
    </div>
  );
};

export default DataPreview;