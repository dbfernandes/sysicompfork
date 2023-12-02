import express from 'express'
import multer from 'multer'
import curriculoController from '../controllers/curriculoController'


const timestamp = new Date().getTime();

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, "/app/src/uploads");
    },
    filename: (req, file, callback)=>{
        callback(null, `${timestamp}-`+file.originalname);
    }
})

const uploads = multer({storage: storage})
const router = express.Router()

router.get('/', curriculoController.visualizar)
router.post('/upload', uploads.single("file"), curriculoController.carregar)

export default router