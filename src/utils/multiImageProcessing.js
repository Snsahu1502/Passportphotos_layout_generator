import { 
  PASSPORT_WIDTH_PX, 
  PASSPORT_HEIGHT_PX, 
  MAX_GAP_PX_FOR_PRINT 
} from '../constants/printLayouts';

export const calculatePhotoDistribution = (totalImages, totalSlots) => {
  const photosPerImage = Math.floor(totalSlots / totalImages);
  const remainder = totalSlots % totalImages;
  
  const distribution = [];
  for (let i = 0; i < totalImages; i++) {
    distribution.push(photosPerImage + (i < remainder ? 1 : 0));
  }
  return distribution;
};

export const createPhotoSequence = (images, distribution) => {
  const sequence = [];
  
  for (let i = 0; i < distribution.length; i++) {
    const count = distribution[i];
    for (let j = 0; j < count; j++) {
      sequence.push(images[i]);
    }
  }
  
  return sequence;
};

export const generateMultiPhotoPrintableSheet = async ({
  uploadedImages,
  selectedOption,
  setIsProcessing,
  setError,
  setGeneratedSheetUrl,
  hiddenCanvasRef,
  sheetCanvasRef,
  LAYOUTS,
  SHEET_DIMENSIONS
}) => {
  if (!uploadedImages.length || !selectedOption) {
    setError("Please upload images and select a print option first.");
    return;
  }

  setIsProcessing(true);
  setError(null);
  setGeneratedSheetUrl(null);

  try {
    // Load all images
    const imageElements = await Promise.all(
      uploadedImages.map(imageUrl => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = imageUrl;
          img.crossOrigin = "anonymous"; // Handle CORS for processed images
        });
      })
    );

    const layout = LAYOUTS[selectedOption];
    const sheetInfo = SHEET_DIMENSIONS[layout.sheet];

    // Calculate distribution
    const distribution = calculatePhotoDistribution(uploadedImages.length, layout.count);
    const photoSequence = createPhotoSequence(imageElements, distribution);

    const sheetCanvas = sheetCanvasRef.current;
    const sheetCtx = sheetCanvas.getContext("2d");

    sheetCanvas.width = sheetInfo.width;
    sheetCanvas.height = sheetInfo.height;
    sheetCtx.fillStyle = "white";
    sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Dynamic scaling logic
    const effectiveSheetWidth = sheetCanvas.width - (layout.cols + 1) * MAX_GAP_PX_FOR_PRINT;
    const effectiveSheetHeight = sheetCanvas.height - (layout.rows + 1) * MAX_GAP_PX_FOR_PRINT;

    const potentialPhotoWidthBasedOnCols = effectiveSheetWidth / layout.cols;
    const potentialPhotoHeightBasedOnRows = effectiveSheetHeight / layout.rows;

    const scaleFactorForWidth = potentialPhotoWidthBasedOnCols / PASSPORT_WIDTH_PX;
    const scaleFactorForHeight = potentialPhotoHeightBasedOnRows / PASSPORT_HEIGHT_PX;

    const limitingScaleFactor = Math.min(scaleFactorForWidth, scaleFactorForHeight, 1);

    const photoWidth = Math.floor(PASSPORT_WIDTH_PX * limitingScaleFactor);
    const photoHeight = Math.floor(PASSPORT_HEIGHT_PX * limitingScaleFactor);

    const horizontalGap = MAX_GAP_PX_FOR_PRINT;
    const verticalGap = MAX_GAP_PX_FOR_PRINT;

    let currentPhotoIndex = 0;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        if (currentPhotoIndex >= layout.count || currentPhotoIndex >= photoSequence.length) break;

        const x = horizontalGap + col * (photoWidth + horizontalGap);
        const y = verticalGap + row * (photoHeight + verticalGap);

        const currentImage = photoSequence[currentPhotoIndex];
        
        const tempCanvas = hiddenCanvasRef.current;
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = photoWidth;
        tempCanvas.height = photoHeight;
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Fill with white background first (important for transparent backgrounds)
        tempCtx.fillStyle = "white";
        tempCtx.fillRect(0, 0, photoWidth, photoHeight);

        // Crop and fit image logic (enhanced for transparent backgrounds)
        const imgAspectRatio = currentImage.width / currentImage.height;
        const targetAspectRatio = photoWidth / photoHeight;

        let sx, sy, sWidth, sHeight;

        if (imgAspectRatio > targetAspectRatio) {
          sHeight = currentImage.height;
          sWidth = currentImage.height * targetAspectRatio;
          sx = (currentImage.width - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = currentImage.width;
          sHeight = currentImage.width / targetAspectRatio;
          sx = 0;
          sy = (currentImage.height - sHeight) / 2;
        }

        // Draw image with proper handling for transparent backgrounds
        tempCtx.drawImage(
          currentImage,
          sx, sy, sWidth, sHeight,
          0, 0, photoWidth, photoHeight
        );

        // Add border
        tempCtx.strokeStyle = "black";
        tempCtx.lineWidth = 2;
        tempCtx.strokeRect(0, 0, photoWidth, photoHeight);

        // Add photo identifier (small number in corner)
        const originalImageIndex = imageElements.indexOf(currentImage) + 1;
        tempCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
        tempCtx.fillRect(5, 5, 20, 15);
        tempCtx.fillStyle = "black";
        tempCtx.font = "12px Arial";
        tempCtx.fillText(originalImageIndex.toString(), 10, 16);

        sheetCtx.drawImage(tempCanvas, x, y, photoWidth, photoHeight);
        currentPhotoIndex++;
      }
      if (currentPhotoIndex >= layout.count) break;
    }

    setGeneratedSheetUrl(sheetCanvas.toDataURL("image/png"));
    setIsProcessing(false);

  } catch (err) {
    console.error("Error generating multi-photo sheet:", err);
    setError("An error occurred during sheet generation. Please try again.");
    setIsProcessing(false);
  }
};
