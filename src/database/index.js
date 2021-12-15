import {Sequelize} from 'sequelize';
import {Dbconfig} from '../config/database-sample';

const connection = new Sequelize(Dbconfig);

export default connection;