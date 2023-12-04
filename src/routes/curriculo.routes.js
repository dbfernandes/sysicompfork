import express from 'express'
import multer from 'multer'
import curriculoController from '../controllers/curriculoController'


const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, "/app/src/uploads/");
    },
    filename: (req, file, callback)=>{
        callback(null, `${new Date().getTime()}-`+file.originalname);
    }
})

const uploads = multer({storage: storage}).single("file")
const router = express.Router()

router.get('/', curriculoController.visualizar)
router.post('/upload', (req, res) =>{
    uploads(req, res, function (err) {
        if (err) {
            console.log(err)
          // An error occurred when uploading
          return
    }
    curriculoController.carregar(req, res)
})
}
)

export default router