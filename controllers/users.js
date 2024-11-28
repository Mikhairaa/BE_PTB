
const db = require('../models');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const User = db.user
const Berita = db.berita

const createNewUsers = async (req,res)=>{
    try{
        if (!req.body.password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
    const hashedPassword = await bcrypt.hash(req.body.password, 10); 
    let info = {
        email:req.body.email,
        password:hashedPassword,
        nama:req.body.nama,
        alamat:req.body.alamat,
    }
    const user = await User.create(info)
    res.status(200).send(user)
    console.log('Berhasil Register',user)
}
    catch(error){
        console.log('Gagal register', error)
        return res.status(500).json({ error: 'Error' });
    }

}

const login = async(req,res)=>{
    const {email,password} = req.body
    console.log('Receive email:', email)
    console.log('Receive password:',password)

    if (!email || !password) {

        console.log( 'Email and password are required' );
        return res.status(500).json({ error: 'Email or password are required' });
      }
    try{
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found'); 
            return res.status(400).json({ error: 'Invalid email ' });
          }
      
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password match:', validPassword);
        console.log('Received password (plain):', password);
        console.log('Stored hashed password in DB:', user.password);

          if (!validPassword) {
            console.log('Invalid password');  
            return res.status(400).json({ error: 'Invalid password' });
          }

          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
      
        res.cookie('token', token, { httpOnly: true });
          // Responding with the token in JSON format
        res.status(200).json({
            message: 'Login successful',
            user: {
            id: user.id,
            email: user.email,
            name: user.nama, // Assuming you have 'nama' field for the user's name
            }, 
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

}

const getUsersData = async (req, res) => {
    try {
      const { id } = req.user; // Mendapatkan ID user dari request
      const userData = await User.findByPk(id);
  
      if (!userData) {
        return res.status(404).json({
          message: 'User tidak ditemukan',
        });
      }
  
      // Mendapatkan berita dengan status "on progress" saja
      const dataBerita = await Berita.findAll({
        where: {
          id_user: id, // Asumsi: berita terkait user tertentu
          status: 'on progress', // Hanya berita dengan status "on progress"
        },
      });
  
      if (!dataBerita) {
        return res.status(404).json({
          message: 'Tidak ada berita dengan status "on progress"',
        });
      }
  
      // Mengirimkan response data user dan berita
      res.status(200).json({
        message: 'Berhasil mengambil data',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.nama, // Asumsi: terdapat field 'nama' pada model user
        },
        berita: dataBerita.map(item => ({
          id_berita: item.id_berita,
          judul: item.judul,
          tanggal: item.tanggal,
          waktu: item.waktu,
          lokasi: item.lokasi,
          status: item.status,
          deskripsi: item.deskripsi,
        }))
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat mengambil data berita');
    }
  };  

  const lihatProfil = async (req, res) => {
    try {
        const id = req.user.id;
        const lihatProfil = await User.findByPk(id);

        if (!lihatProfil) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Menampilkan profil',
            user: {
                id: lihatProfil.id,
                email: lihatProfil.email,
                name: lihatProfil.nama,
                alamat: lihatProfil.alamat,
                fotoProfil: lihatProfil.fotoProfil, // Uncomment jika properti ada di database
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const uploadFotoProfil = async (req, res) => {
  // Middleware untuk upload satu file dengan field name 'fotoProfil'
  const uploadFile = upload.single('fotoProfil');

  uploadFile(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: err });
      }

      if (!req.file) {
          return res.status(400).json({ message: 'No file selected' });
      }

      try {
          const id = req.user.id; // ID user yang login
          await User.update({ fotoProfil: req.file.filename }, { where: { id } });
          res.status(200).json({ message: 'Berhasil mengupload foto profil' });
      } catch (error) {
          console.error("Error updating user profile:", error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });
};

const updateProfil = async (req,res)=>{
  try{
    const{id} = req.params
    const {nama, email, alamat} = req.body

    // Cek apakah ada data yang dikirim
    if (!nama && !email && !alamat) {
      return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
  }

    await User.update({nama, email, alamat},{where:{id}})

    res.status(200).json({message:'Profil berhasil diperbarui'})
  } catch(error){
    res.status(500).json({message:'Terjadi kesalahan saat update profil'})
  }
}

const changePassword = async (req,res)=> {
  const {passwordLama, passwordBaru, konfirmasiPassword} = req.body
  const id = req.user.id
    try {
      if(!passwordLama||!passwordBaru ||!konfirmasiPassword){
        return res.status(400).json({message: "Isi password lama atau password barunya"})
      }
      if (konfirmasiPassword!==passwordBaru){
          return res.status(400).json({message: "Konfirmasi password berbeda"})
      } 
  const findAccount = await User.findOne({where:{id:id}})
  if(!findAccount){
    return res.status(400).json({message: "Akun tidak ditemukan"}) 
  } 
  const passwordAsli = findAccount.password
  const passwordMatch =  bcrypt.compareSync(passwordLama , passwordAsli)  
  if(!passwordMatch){
      return res.status(400).json({message: "Password Anda Salah"})
  }
  const salt = bcrypt.genSaltSync(10)
  const encryptPass = bcrypt.hashSync(passwordBaru, salt)
  await User.update({
      password : encryptPass
  }, {where : {id:id}}
  )
  return res.status(200).json({message: "Data Berhasil diperbarui"})
  } catch (error) {
  console.error(error);
  return res.status(500).json({message: "Ada Error"})
  } 
  }

  const logout = (req,res)=> {
    res.clearCookie('token')
    res.status(200).json({message:'Berhasil logout'})
  }

 module.exports = {
    getUsersData,
    createNewUsers,
    login,
    lihatProfil,
    uploadFotoProfil,
    updateProfil,
    changePassword,
    logout
 }