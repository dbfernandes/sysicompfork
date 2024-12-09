import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, callback) => {
    const id = req.body.professorId;
    callback(null, `${new Date().getTime()}-${id}-` + file.originalname);
  },
});

const upload = multer({ storage }).single('file');

export default upload;
