// Simple background replacement without AI - for basic background color changes
let isInitialized = false;

export const initializeBackgroundRemoval = async () => {
  try {
    // Simulate initialization
    await new Promise(resolve => setTimeout(resolve, 500));
    isInitialized = true;
    console.log('Background removal initialized (simplified version)');
    return true;
  } catch (error) {
    console.error('Error initializing background removal:', error);
    throw new Error('Failed to initialize background removal');
  }
};

export const removeImageBackground = async (imageElement, options = {}) => {
  if (!isInitialized) {
    throw new Error('Background removal not initialized');
  }

  try {
    const {
      backgroundColor = '#ffffff',
      edgeBlurAmount = 0
    } = options;

    return new Promise((resolve, reject) => {
      try {
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = imageElement.naturalWidth || imageElement.width || 500;
        canvas.height = imageElement.naturalHeight || imageElement.height || 500;

        // Apply background color first
        if (backgroundColor !== 'transparent') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw the image with some simple processing
        ctx.globalCompositeOperation = 'source-atop';
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

        // Simple edge enhancement (if blur amount is specified)
        if (edgeBlurAmount > 0) {
          ctx.filter = `blur(${edgeBlurAmount}px)`;
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        }

        // Convert to data URL with high quality
        const processedDataUrl = canvas.toDataURL('image/png', 0.95);
        resolve(processedDataUrl);
        
      } catch (canvasError) {
        reject(new Error(`Image processing failed: ${canvasError.message}`));
      }
    });

  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

export const removeBackgroundFromMultipleImages = async (imageElements, options = {}) => {
  const results = [];
  const total = imageElements.length;
  
  for (let i = 0; i < total; i++) {
    try {
      const processedImage = await removeImageBackground(imageElements[i], options);
      results.push({
        index: i,
        processedImage,
        success: true
      });
      
      // Progress callback
      if (options.onProgress) {
        options.onProgress(i + 1, total);
      }
      
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error processing image ${i + 1}:`, error);
      results.push({
        index: i,
        error: error.message,
        success: false
      });
    }
  }
  
  return results;
};

// Helper function to convert hex color to RGB (kept for compatibility)
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
