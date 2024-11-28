
module.exports = (sequelize,DataTypes) => {
    const Berita = sequelize.define("berita",{
        id_berita: {
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
        judul:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        tanggal:{
            type: DataTypes.DATE,
            allowNull: true,
        },
        waktu:{
            type: DataTypes.TIME,
            allowNull: true,
        },
        lokasi:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        deskripsi:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        bukti:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        no_hp:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        no_rek:{
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: 'Berita',
        tableName: 'berita',
        timestamps: true
    })
    return Berita;
}