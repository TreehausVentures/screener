import React, { useState } from "react";
import { Upload } from "lucide-react";
import { processJSONFiles } from "./utils/jsonProcessor";
import { downloadCSV } from "./utils/csvGenerator";

export default function App() {
  const [csvText, setCsvText] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    try {
      // 1) Normalize & flatten all items
      const data = await processJSONFiles(Array.from(files));
      // 2) Convert to CSV
      const csv = downloadCSV(data);
      setCsvText(csv);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "auto" }}>
      <h2>JSON → CSV Converter</h2>
      <p>
        <Upload size={18} style={{ verticalAlign: "middle" }} /> Select one or
        two JSON files (reports & summary).
      </p>
      <input
        type="file"
        accept=".json"
        multiple
        onChange={handleFiles}
        style={{ margin: "1rem 0" }}
      />
      {csvText && (
        <>
          <button
            onClick={() => {
              const blob = new Blob([csvText], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "output.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{ padding: "8px 12px", fontWeight: "bold" }}
          >
            Download CSV
          </button>
          <pre
            style={{
              marginTop: 16,
              maxHeight: 200,
              overflow: "auto",
              background: "#f5f5f5",
              padding: 12,
              fontSize: 12,
            }}
          >
            {csvText.split("\r\n").slice(0, 20).join("\n")}
          </pre>
        </>
      )}
    </div>
  );
}
