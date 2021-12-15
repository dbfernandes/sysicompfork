import {
    Sequelize
} from 'sequelize';
import {
    dev
} from '../config/database-sample';

const connection = new Sequelize(dev);

export default connection;