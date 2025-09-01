// Constants for Passport Photo and Sheet Sizes
export const PASSPORT_WIDTH_MM = 35;
export const PASSPORT_HEIGHT_MM = 45;
export const DPI = 600;
export const MM_PER_INCH = 25.4;

export const PASSPORT_WIDTH_PX = Math.round((PASSPORT_WIDTH_MM / MM_PER_INCH) * DPI);
export const PASSPORT_HEIGHT_PX = Math.round((PASSPORT_HEIGHT_MM / MM_PER_INCH) * DPI);

export const MAX_GAP_PX_FOR_PRINT = 15;

export const SHEET_DIMENSIONS = {
  "4x6": { width: 6 * DPI, height: 4 * DPI, label: "4x6 inches (Landscape)" },
  A4: {
    width: Math.round((210 / MM_PER_INCH) * DPI),
    height: Math.round((297 / MM_PER_INCH) * DPI),
    label: "A4 (210x297 mm)",
  },
};

export const LAYOUTS = {
  "4x6-8": { sheet: "4x6", count: 8, rows: 2, cols: 4 },
  "4x6-10": { sheet: "4x6", count: 10, rows: 2, cols: 5 },
  "A4-36": { sheet: "A4", count: 36, rows: 6, cols: 6 },
  "A4-32": { sheet: "A4", count: 32, rows: 6, cols: 6 },
};
