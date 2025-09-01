import React from "react";
import ActionButton from "../ActionButton";

const GeneratedSheetPreview = ({ generatedSheetUrl, onPrint, onDownload }) => {
  if (!generatedSheetUrl) return null;

  return (
    <div className="mt-8 p-5 sm:p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
        Printable Sheet Preview 🖼️
      </h2>
      <div className="flex justify-center mb-6">
        <img
          src={generatedSheetUrl}
          alt="Generated Printable Sheet"
          className="max-w-full h-auto border border-gray-300 rounded-md shadow-md"
          style={{
            maxWidth: "min(100%, 400px)",
            maxHeight: "min(100%, 500px)",
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <ActionButton
          onClick={onPrint}
          variant="green"
          icon="print"
        >
          Print Sheet
        </ActionButton>
        <ActionButton
          onClick={onDownload}
          variant="purple"
          icon="download"
        >
          Download Sheet
        </ActionButton>
      </div>
    </div>
  );
};

export default GeneratedSheetPreview;
