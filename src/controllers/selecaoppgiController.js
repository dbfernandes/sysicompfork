import EditalService from '../services/editalService'
import CandidateService from '../services/candidateService'

const locals = {
	layout: 'selecaoppgi'
}

const begin = async (req, res) => {
	switch (req.method) {
		case 'GET':
			return res.render('selecaoppgi/begin', {
				...locals,
			});
		case 'POST':
			return res.send('Erro 400');
	}
}

const signin = async (req, res) => {
	switch (req.method) {
		case 'GET':
			const editais = await EditalService.listEdital();
			return res.render('selecaoppgi/signin', {
				csrfToken: req.csrfToken(),
				...locals,
				editais: editais.map((edital) => {
					return {
						...edital.get(),
					};
				}),
				errorSignin: null
			});
		case 'POST':
			const {
				email, senha, edital
			} = req.body;

			if (!email || !senha || !edital) {
				return res.status(400).json({
					error: 'Dados incompletos ou mal formatados'
				});
			}

			let responseError = null;

			const candidate = await CandidateService
				.create({
					email: email,
					password: senha,
					editalNumber: edital
				})
				.catch((err) => {
					responseError = err;
				});

			if (!candidate) {
				return res.status(400).json({
					error: responseError.message
				});
			}
			return res.status(200).redirect('/selecaoppgi');
		default:
			return res.status(404).send();
	}
}

const login = async (req, res) => {
	switch (req.method) {
		case 'GET':
			const editais = await EditalService.listEdital();
			return res.render('selecaoppgi/login', {
				csrfToken: req.csrfToken(),
				teste: "teste",
				...locals,
				editais: editais.map((edital) => {
					return {
						...edital.get(),
					};
				}),
			});

		case 'POST':
			try {
				const {
					email, senha, edital
				} = req.body;

				console.log({
					email,
					senha,
					edital
				})

				if (!email || !senha || !edital) {
					return res.status(400).json({
						error: 'Dados incompletos ou mal formatados'
					});
				}

				let responseError = null;
				const IsCandidateValid = await CandidateService
					.auth({
						email,
						password: senha,
						editalNumber: edital
					})
					.catch((err) => {
						responseError = err;
					});

				console.log("TESTE");
				const editais2 = await EditalService.listEdital();

				if (!IsCandidateValid) {
					console.log("error teste");
					console.log(req.csrfToken());

					return res.render('selecaoppgi/login', {
						csrfToken: req.csrfToken(),
						message: "Usuário não cadastrado",
						type: 'danger',
						...locals,
						editais: editais2.map((edital) => {
							return {
								...edital.get(),
							};
						}),
					});
				}

				req.session.email = IsCandidateValid.email;
				req.session.editalId = IsCandidateValid.editalId;
				req.session.uid = IsCandidateValid.id;
				req.session.editalPosition = IsCandidateValid.editalPosition;
				return res.status(200).send();

			} catch (err) {
				console.log(err);
				return res.status(500).send();
			}

		default:
			return res.status(404).send();
	}
}

const forms = async (req, res) => {
	console.log(req.method)
	console.log("teste forms")

	switch (req.method) {
		case 'GET':


			if (!req.session.email) {
				res.redirect('/selecaoppgi/entrar')
			}
			if (req.session.editalPosition == 1) {
				//console.log(req.session.email)
				//console.log(req.session.editalId)
				//console.log(req.session.uid)
				const id = req.session.uid
				const candidate = await CandidateService.findOne({
					id: id,
				})
				//console.log(candidate)
				return res.render('selecaoppgi/forms1', {
					...locals,
					Nome: candidate.Nome,
					Nascimento: candidate.Nascimento,
					Sexo: candidate.Sexo,
					NomeSocial: candidate.NomeSocial,
					CEP: candidate.CEP,
					UF: candidate.UF,
					Endereco: candidate.Endereco,
					Cidade: candidate.Cidade,
					Bairro: candidate.Bairro,
					Nacionalidade: candidate.Nacionalidade,
					Telefone: candidate.Telefone,
					TelefoneSecundario: candidate.TelefoneSecundario,
					ComoSoube: candidate.ComoSoube,
					Curso: candidate.CursoDesejado,
					Regime: candidate.RegimeDedicacao,
					Cotista: candidate.Cotista,
					CotistaTipo: candidate.CotistaTipo,
					Condicao: candidate.Condicao,
					CondicaoTipo: candidate.CondicaoTipo,
					Bolsista: candidate.Bolsista,
					editalPosicao: req.session.editalPosition,
					email: req.session.email,
					id: req.session.uid,
					csrfToken: req.csrfToken()
				});
			}
			if (req.session.editalPosition == 2) {
				const candidate = await CandidateService.findOne({
					id: req.session.uid,
				})


				return res.render('selecaoppgi/forms2', {
					...locals,
					editalPosicao: req.session.editalPosition,
					email: req.session.email,
					id: req.session.uid,
					Curso: candidate.CursoDesejado,
					csrfToken: req.csrfToken()
				});
			}

			if (req.session.editalPosition == 3) {
				const candidate = await CandidateService.findOne({
					id: req.session.uid,
				})

				return res.render('selecaoppgi/forms3', {
					...locals,
					editalPosicao: req.session.editalPosition,
					email: req.session.email,
					id: req.session.uid,
					csrfToken: req.csrfToken()
				});
			}

		case 'POST':

			if (req.session.editalPosition == 1) {
				//console.log(req.body)
			}

	}
}

const form1 = async (req, res) => {
	switch (req.method) {
		case 'GET':
			res.send("oi")
		case 'POST':
			console.log("******************************************** FORM 1 POST")
			const data = req.body.data
			//console.log(req.session.editalPosition)
			if (req.session.editalPosition == 1) {
				console.log("teste form1")
				const Candidato = {
					Nome: data.Nome,
					Nascimento: data.Nascimento,
					Sexo: data.Sexo,
					NomeSocial: data.NomeSocial,
					CEP: data.CEP,
					UF: data.UF,
					Endereco: data.Endereco,
					Cidade: data.Cidade,
					Bairro: data.Bairro,
					Nacionalidade: data.Nacionalidade,
					TelefonePrincipal: data.TelefonePrincipal,
					TelefoneAlternativo: data.TelefoneAlternativo,
					ComoSoube: data.ComoSoube,
					CursoDesejado: data.CursoDesejado,
					RegimeDedicacao: data.RegimeDedicacao,
					Cotista: data.Cotista,
					CotistaTipo: data.CotistaTipo,
					Condicao: data.Condicao,
					CondicaoTipo: data.CondicaoTipo,
					Bolsa: data.Bolsa,
				};
				const id = req.session.uid

				const candidate = await CandidateService
					.form1({
						Candidato: Candidato,
						id: id,
					})
					.catch((err) => {
					});
				req.session.editalPosition = candidate.editalPosition
				res.status(200).send()

				break;
			}

			return res.send('Erro 400 begin');
	}
}

const form2 = async (req, res) => {
	console.log("form2post")
	console.log(req.body)
	res.status(200).send()

}

const candidates = async (req, res) => {
	switch (req.method) {
		case 'GET':
			return res.json({
				candidates: await CandidateService.list()
			});
		default:
			return res.status(400).send();
	}
}

const voltar = async (req, res) => {
	switch (req.method) {
		case 'POST':
			const id = req.body.id
			let editalPosicao = req.body.editalPosicao;
			console.log(editalPosicao)
			editalPosicao = parseInt(editalPosicao, 10) - 1;

			//res.redirect('/selecaoppgi')
			console.log(editalPosicao)

			const candidateAtualizacao = await CandidateService.back({
				id: id,
			})
			req.session.editalPosition = editalPosicao
			res.status(200).send()
		default:
			return res.status(400).send();
	}
}

const refresh = async (req, res) => {
	console.log("asdasdsadasd")
	res.redirect('/selecaoppgi/formulario')
}
export default {
	begin,
	signin,
	login,
	forms,
	form1,
	form2,
	candidates,
	voltar,
	refresh
};