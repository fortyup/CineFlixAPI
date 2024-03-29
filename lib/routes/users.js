'use strict';

module.exports = [
    {
        method: 'get',
        path: '/users',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            description: 'Get all users',
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const users = await userService.getAll();
            return users;
        } }
];
