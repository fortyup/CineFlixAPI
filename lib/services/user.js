'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../modules/iut-encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    create(user) {

        console.log(user);
        const { User } = this.server.models();
        user.password = Encrypt.sha1(user.password);
        return User.query().insertAndFetch(user);
    }

    getAll() {

        const { User } = this.server.models();
        return User.query();
    }

    delete(id) {

        const { User } = this.server.models();
        return User.query().deleteById(id);
    }

    update(id, user) {

        const { User } = this.server.models();
        if (user.password) {
            user.password = Encrypt.sha1(user.password);
        }

        return User.query().patchAndFetchById(id, user);
    }

    async verifyPassword(mail, password) {

        const { User } = this.server.models();
        const user = await User.query().findOne({ mail });

        if (user && user.password === Encrypt.sha1(password)) {

            return user;
        }

        throw Boom.unauthorized('Invalid password');
    }

    generateToken(user) {
        const token = Jwt.token.generate({
            aud: 'urn:audience:iut',
            iss: 'urn:issuer:iut',
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.mail,
            scope: user.role
        }, {
            key: 'random_string', // Clé définie dans votre configuration JWT
            algorithm: 'HS512'
        }, {
            ttlSec: 14400 // Durée de validité du token en secondes
        });

        return 'Bearer ' + token;
    }
};