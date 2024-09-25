import navbar from './navbar.json';
import landing from './landing.json';
import error from './error.json';
import students from './students.json';
import profile from './profile.json';
import projects from './projects.json';
import publications from './publications.json';
import teachers from './teachers.json';
import db from './fromDB.json';

import ppgi from './ppgi.json';
import ppgiBegin from './ppgi_begin.json';
import ppgiSignIn from './ppgiSignIn.json';
import ppgiRecPass from './ppgiRecPass.json';
import ppgiChangePass from './ppgiChangePass.json';
import ppgiSignUp from './ppgiSignUp.json';
import ppgiForm1 from './ppgiForm1.json';
import ppgiRecomendacao from './ppgiRecomendacao.json';

export default {
  translation: {
    navbar,
    landing,
    error,
    students,
    profile,
    projects,
    publications,
    teachers,
    ppgi,
    ppgiBegin,
    ppgiSignIn,
    ppgiRecPass,
    ppgiChangePass,
    ppgiSignUp,
    ppgiForm1,
    ppgiRecomendacao,
    ...db,
  },
};
