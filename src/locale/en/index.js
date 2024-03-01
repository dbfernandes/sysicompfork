import navbar from './navbar.json'
import landing from './landing.json'
import error from './error.json'
import students from './students.json'
import profile from './profile.json'
import projects from './projects.json'
import publications from './publications.json'
import teachers from './teachers.json'
import db from './fromDB.json'

export default {
    "translation" : {
        navbar,
        landing,
        error,
        students,
        profile,
        projects,
        publications,
        teachers,
        ...db
    }
}