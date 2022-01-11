import EditalService from '../services/editalService'
import CandidateService from '../services/candidateService'

const locals = { 
	layout: 'selecaoppgi' 
}

const begin = async(req, res) => {
	switch (req.method) {
		case 'GET':
			return res.render('selecaoppgi/begin', {...locals});
		case 'POST':
			return res.send('Erro 400');
	}
}

const signin = async(req, res) => {
	switch (req.method) {
		case 'GET':
<<<<<<< HEAD
			const editais = await EditalService.listEdital();
			return res.render('selecaoppgi/signin', {...locals, editais, errorSignin: null});
=======
			return res.render('selecaoppgi/signin', {...locals, editais: await EditalService.listEdital(), errorSignin: null});
>>>>>>> 8ae7c579feb0b2ba3c19d4f2731c07af0f0020be
		case 'POST':
			const {email, senha, edital} = req.body;
			
			if(!email || !senha || !edital){
				return res.status(400).json({error: 'Dados incompletos ou mal formatados'});
			}

			let responseError = null;
			const candidate = await CandidateService
				.create({email, password: senha, editalNumber: edital})
				.catch((err)=>{
					responseError = err;
				});
				
			if(!candidate){		
					return res.status(400).json({error: responseError.message});
			}
			return res.status(200).redirect('/selecaoppgi');
		default:
			return res.status(404).send();
	}
}

const login = async(req, res) => {
	switch (req.method) {
		case 'GET':
			return res.render('selecaoppgi/login', {...locals, editais: await EditalService.listEdital()});
		case 'POST':
			const {email, senha, edital} = req.body;

			console.log({email, senha, edital})

			if(!email || !senha || !edital){
				return res.status(400).json({error: 'Dados incompletos ou mal formatados'});
			}

			let responseError = null;
			const isPasswordAuthenticate = await CandidateService
				.auth({email, password: senha, editalNumber: edital})
				.catch((err)=>{
					responseError = err;
				});
			
			if(!isPasswordAuthenticate){		
				return res.status(400).json({error: responseError.message});
			}
			return res.status(200).send();
		default:
			return res.status(404).send();
	}
}

const forms = async(req, res) => {
	switch (req.method){
		case 'GET':
			return res.render('selecaoppgi/forms', {...locals});
		case 'POST':
			
			return res.send('Erro 400');
	}
}

const candidates = async(req, res) => {
	switch (req.method){
		case 'GET':
			return res.json({candidates: await CandidateService.list()});
		default:
			return res.status(400).send();
	}
}

export default {begin, signin, login, forms, candidates};