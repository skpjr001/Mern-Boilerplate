require('dotenv').config();
const db = require('../db/connection')

const bcrypt = require('bcryptjs')

const users = db.get('users');
async function createAdminUser() {
    try {
        const user = await users.findOne({role : 'admin'});
        if (!user) {
            await users.insert({
                email: 'admin',
                password: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 12),
                role: 'admin',
                active: true
            });
            console.log('Admin user created!');
            
        } else {
            console.log('Admin user already exist!')
            
        }
    } catch (error) {
        console.log(error);
    } finally {
        db.close()
    }
}

createAdminUser();