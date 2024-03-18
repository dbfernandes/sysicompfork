import express from 'express';
import selecaoppgiController from '../controllers/selecaoppgiController';
import multer from 'multer';
const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './src/candidato/uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, `${new Date().getTime()}-`+file.originalname);
  }
})

const uploads = multer({ storage: storage }).fields([
  { name: 'VitaePDF', maxCount: 1 }, 
  { name: 'Prova', maxCount: 1 },
  { name: 'VitaeXML', maxCount: 1 },
])

/* TODO - Add routes */
router.all('/', selecaoppgiController.begin);
router.all('/cadastro', selecaoppgiController.signin);
router.all('/entrar', selecaoppgiController.login)
router.all('/formulario/1' ,selecaoppgiController.form1)
router.all('/formulario/2', (req, res) => {
  uploads(req, res, function(err){
    if(err){
      console.log(err)
      throw err
    }
    selecaoppgiController.form2(req, res)
  })
})


router.all('/formulario/json', (req, res) => {
  uploads(req, res, function(err){
    if(err){
      console.log(err)
      throw err
    }
    selecaoppgiController.form2json(req, res)
  })
});

router.all('/formulario/publicacoes',(req, res) => {
  uploads(req, res, function(err){
    if(err){
      console.log(err)
      throw err
    }
    selecaoppgiController.formPublicacoes(req, res)
  })
})


router.all('/formulario', selecaoppgiController.forms)
router.all('/candidates', selecaoppgiController.candidates)
router.all('/voltar', selecaoppgiController.voltar)
export default router;