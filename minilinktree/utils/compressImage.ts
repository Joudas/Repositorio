// utils/compressImage.ts
export const compressImage = (file: File, maxSizeMB = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Redimensionar si es muy grande
      const maxDim = 800;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = (height / width) * maxDim; width = maxDim; }
        else { width = (width / height) * maxDim; height = maxDim; }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      // Comprimir con calidad reducida hasta estar bajo el límite
      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(file);
          if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.2) {
            quality -= 0.1;
            tryCompress();
          } else {
            resolve(new File([blob], file.name, { type: 'image/webp' }));
          }
        }, 'image/webp', quality);
      };
      tryCompress();
    };

    img.src = url;
  });
};