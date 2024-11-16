// utils/imageUpload.js
import path from 'path';

const handleImageUpload = async (imageFile, dirPath) => {
  if (!imageFile) {
    return null; // Si no se subió ninguna imagen
  }

  // Verifica el tipo de archivo (solo imágenes)
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validImageTypes.includes(imageFile.mimetype)) {
    throw new Error('El archivo debe ser una imagen (jpg, png, gif).');
  }

  // Verifica el tamaño del archivo (ejemplo, máximo 5MB)
  if (imageFile.size > 5 * 1024 * 1024) {
    throw new Error('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
  }

  // Genera un nombre único para la imagen
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}_${imageFile.name}`;
  const uploadPath = path.join(__dirname, '..', 'uploads', dirPath, uniqueFileName);

  // Mueve el archivo a la carpeta destino
  await imageFile.mv(uploadPath);

  // Retorna la URL y la ruta relativa del archivo
  const fileURL = `https://conection-1.onrender.com${dirPath}/${uniqueFileName}`;
  const filePath = `./uploads${dirPath}/${uniqueFileName}`;

  return { fileURL, filePath };
};

export default handleImageUpload;
