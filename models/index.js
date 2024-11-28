const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user.js')(sequelize, DataTypes)
db.berita = require('./berita.js')(sequelize, DataTypes)
db.notifikasi = require('./notifikasi.js')(sequelize, DataTypes)
//

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})
// 1 to Many Relation

db.user.hasMany(db.berita, {
    foreignKey: 'id_user',
    as: 'beritas'
})

// 1 to Many Relation

db.user.hasMany(db.notifikasi, {
    foreignKey: 'id_user',
    as: 'notifikasis'
})

// Relasi 1-to-Many: Berita -> Notifikasi
db.berita.hasMany(db.notifikasi, {
    foreignKey: 'id_berita',
    as: 'notifikasis',
});

module.exports = db