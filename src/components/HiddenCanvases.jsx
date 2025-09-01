import React from "react";

const HiddenCanvases = ({ hiddenCanvasRef, sheetCanvasRef }) => {
  return (
    <>
      <canvas ref={hiddenCanvasRef} className="hidden"></canvas>
      <canvas ref={sheetCanvasRef} className="hidden"></canvas>
    </>
  );
};

export default HiddenCanvases;
