import EditalService from '../services/edital'
import CandidateService from '../services/candidate'

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
			return res.render('selecaoppgi/signin', {...locals, editais: await EditalService.list()});
		case 'POST':
			return res.send('Erro 400');
	}
}

const login = async(req, res) => {
	switch (req.method) {
		case 'GET':
			return res.render('selecaoppgi/login', {...locals});
		case 'POST':
			return res.send('Erro 400');
	}
}

export default {begin, signin, login};