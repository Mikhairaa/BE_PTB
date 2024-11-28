
module.exports = (sequelize,DataTypes) => {
    const Notifikasi = sequelize.define("notifikasi",{
        id_notifikasi: {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey: true,
            allowNull: false
          },
        id_user:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'user',
            key: 'id'
        }
        },
        id_berita:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'berita',
            key: 'id_berita'
        }
        },
        deskripsi:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt:{
            type: DataTypes.DATE,
            allowNull: true,
        },
        
    },{
        sequelize,
        modelName: 'Notifikasi',
        tableName: 'notifikasi',
        timestamps: true
    })
    return Notifikasi;
}