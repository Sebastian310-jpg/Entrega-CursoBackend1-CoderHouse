import multer from 'multer';

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/img');
  },
  filename: (req, file, callback) => {
    const newFilename = Date.now() + "-" + file.originalname;

    callback(null, newFilename);
  }
})

const uploader = multer({ storage });

export default uploader;