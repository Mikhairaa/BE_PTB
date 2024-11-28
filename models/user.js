
module.exports = (sequelize,DataTypes) => {
    const User = sequelize.define("user",{
        id: {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey: true,
            allowNull: false
          },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        nama:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        alamat:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fotoProfil:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        
    },{
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps: false
    })
    return User;
}