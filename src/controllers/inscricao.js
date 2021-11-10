const locals = { 
	layout: 'selecaoppgi' 
}

const begin = async(req, res) => {
	switch (req.method) {
		case 'GET':
			return res.render('inscricao/begin', locals);
		case 'POST':
			return res.send('Erro 400');
	}
}

export default {begin};