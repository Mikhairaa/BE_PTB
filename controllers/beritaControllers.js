const db = require('../models');
const upload = require('../middleware/upload'); // Import middleware multer

const Berita = db.berita
const Notifikasi = db.notifikasi

const getAllBerita = async (req,res)=> {
    
    try {
        const { id } = req.user;
        console.log("ID dari user:", req.user.id);
        // Mencari berita yang berhubungan dengan id_user yang login
        const berita = await Berita.findAll({
          where: { id_user: id }  // Cari berita yang id_user-nya sesuai dengan id yang login
        });

        // Periksa apakah data berita ditemukan
        if (!berita) {
          return res.status(404).json({ message: 'Berita tidak ditemukan' });
        }
        // Kirimkan data berita yang ditemukan
        res.status(200).json({
          message: 'Berhasil mengambil data berita',
          berita: berita.map(item => ({
            id_berita: item.id_berita,
            judul: item.judul,
            tanggal: item.tanggal,
            waktu: item.waktu,
            lokasi: item.lokasi,
            status: item.status,
            deskripsi: item.deskripsi,
          })),
        });

      } catch (error) {
        
        console.error(error);
        return res.status(500).send('Terjadi kesalahan saat mengambil data berita');
      }
    };

const getOnProgressBerita = async (req,res)=> {
    
      try {
          const { id } = req.user;
          console.log("ID dari user:", req.user.id);
          // Mencari berita yang berhubungan dengan id_user yang login
          const berita = await Berita.findAll({
            where: { 
              id_user: id,
              status: 'on progress'
             }  // Cari berita yang id_user-nya sesuai dengan id yang login
          });
  
          // Periksa apakah data berita ditemukan
          if (!berita) {
            return res.status(404).json({ message: 'Berita tidak ditemukan' });
          }
          // Kirimkan data berita yang ditemukan
          res.status(200).json({
            message: 'Berhasil mengambil data berita',
            berita: berita.map(item => ({
              id_berita: item.id_berita,
              judul: item.judul,
              tanggal: item.tanggal,
              waktu: item.waktu,
              lokasi: item.lokasi,
              status: item.status,
              deskripsi: item.deskripsi,
            })),
          });
  
        } catch (error) {
          
          console.error(error);
          return res.status(500).send('Terjadi kesalahan saat mengambil data berita');
        }
      };

const getRejectedBerita = async (req,res)=> {

try {
    const { id } = req.user;
    console.log("ID dari user:", req.user.id);
    // Mencari berita yang berhubungan dengan id_user yang login
    const berita = await Berita.findAll({
      where: { 
        id_user: id,
        status: 'ditolak'
        }  // Cari berita yang id_user-nya sesuai dengan id yang login
    });

    // Periksa apakah data berita ditemukan
    if (!berita) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    // Kirimkan data berita yang ditemukan
    res.status(200).json({
      message: 'Berhasil mengambil data berita',
      berita: berita.map(item => ({
        id_berita: item.id_berita,
        judul: item.judul,
        tanggal: item.tanggal,
        waktu: item.waktu,
        lokasi: item.lokasi,
        status: item.status,
        deskripsi: item.deskripsi,
      })),
    });

  } catch (error) {
    
    console.error(error);
    return res.status(500).send('Terjadi kesalahan saat mengambil data berita');
  }
};

const getSelesaiBerita = async (req,res)=> {

  try {
      const { id } = req.user;
      console.log("ID dari user:", req.user.id);
      // Mencari berita yang berhubungan dengan id_user yang login
      const berita = await Berita.findAll({
        where: { 
          id_user: id,
          status: 'selesai'
          }  // Cari berita yang id_user-nya sesuai dengan id yang login
      });
  
      // Periksa apakah data berita ditemukan
      if (!berita) {
        return res.status(404).json({ message: 'Berita tidak ditemukan' });
      }
      // Kirimkan data berita yang ditemukan
      res.status(200).json({
        message: 'Berhasil mengambil data berita',
        berita: berita.map(item => ({
          id_berita: item.id_berita,
          judul: item.judul,
          tanggal: item.tanggal,
          waktu: item.waktu,
          lokasi: item.lokasi,
          status: item.status,
          deskripsi: item.deskripsi,
        })),
      });
  
    } catch (error) {
      
      console.error(error);
      return res.status(500).send('Terjadi kesalahan saat mengambil data berita');
    }
  };
  

const createOrUpdateBerita = async (req, res) => {
        try {
          const {
            id_berita, // Jika ada, berarti update
            judul,
            tanggal,
            waktu,
            lokasi,
            deskripsi,
            no_hp,
            no_rek,
          } = req.body;
      
          const userId = req.user.id; // ID user yang sedang login
      
          // Validasi: Semua kolom harus diisi
          if (!judul || !tanggal || !waktu || !lokasi || !deskripsi || !no_hp || !no_rek || !req.file) {
            return res.status(400).json({
              success: false,
              message: 'Semua kolom wajib diisi untuk membuat atau memperbarui berita.',
            });
          }
      
          let berita;
      
          if (id_berita) {
            // Proses Update Berita
            berita = await Berita.findOne({ where: { id_berita, id_user: userId } });
      
            if (!berita) {
              return res.status(404).json({
                success: false,
                message: 'Berita tidak ditemukan untuk ID dan user tersebut.',
              });
            }
      
            // Data baru yang akan diperbarui
            const updateData = {
              judul,
              tanggal,
              waktu,
              lokasi,
              deskripsi,
              no_hp,
              no_rek,
              bukti: `/uploads/${req.file.filename}`, // Path file baru
              status: 'on progress', // Reset status menjadi 'on progress'
            };
      
            // Update data di database
            await Berita.update(updateData, { where: { id_berita, id_user: userId } });
      
            // Gabungkan data lama dengan data baru untuk respon
            berita = { ...berita.dataValues, ...updateData };
          } else {
            // Proses Create Berita Baru
            berita = await Berita.create({
              id_user: userId,
              judul,
              tanggal,
              waktu,
              lokasi,
              deskripsi,
              bukti: `/uploads/${req.file.filename}`, // Path file baru
              status: 'on progress',
              no_hp,
              no_rek,
            });
          }
      
          return res.status(200).json({
            success: true,
            message: id_berita ? 'Berita berhasil diperbarui.' : 'Berita berhasil dibuat.',
            data: berita,
          });
        } catch (error) {
          console.error('Error saat membuat atau memperbarui berita:', error);
          return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
          });
        }
      };
         
const saveBerita = async (req, res) => {
        try {
          const {
            judul,
            tanggal,
            waktu,
            lokasi,
            deskripsi,
            no_hp,
            no_rek,
          } = req.body;
      
          const userId = req.user.id; // ID user yang sedang login
      
          // Validasi: Kolom wajib minimal
          if (!judul) {
            return res.status(400).json({ success: false, message: 'Judul berita harus diisi!' });
          }
      
          // Validasi untuk file (opsional, karena bisa berupa draft tanpa file)
          let bukti = null;
          if (req.file) {
            bukti = `/uploads/${req.file.filename}`; // Simpan path file yang diunggah
          }
      
          // Simpan berita sebagai draft
          const berita = await Berita.create({
            id_user: userId,
            judul: judul,
            tanggal: tanggal || null, // Optional saat menyimpan draft
            waktu: waktu || null, // Optional saat menyimpan draft
            lokasi: lokasi || null, // Optional saat menyimpan draft
            deskripsi: deskripsi || null, // Optional saat menyimpan draft
            bukti: bukti||null, // Foto atau video jika ada
            status: 'draft', // Status default untuk draft
            no_hp: no_hp || null, // Optional saat menyimpan draft
            no_rek: no_rek || null, // Optional saat menyimpan draft
          });
      
          return res.status(200).json({
            success: true,
            message: 'Berita berhasil disimpan sebagai draft.',
            data: berita,
          });
        } catch (error) {
          console.error('Error saat menyimpan draft berita:', error);
          res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan berita sebagai draft.',
            error: error.message,
          });
        }
      };
      
const getSaveBerita = async (req,res)=> {
    try{
        const {id_berita} = req.params
        // Cari berita dengan id_user dan id_berita
        const berita = await Berita.findOne({
            where: {
                id_berita: id_berita,
                status: 'draft', // Pastikan hanya mencari status 'draft'
            },
        });
        
        if (!berita) {
            return res.status(404).json({ message: 'Draft berita tidak ditemukan' });
        }

        return res.status(200).json({
            message: 'Draft berita ditemukan',data:berita
        });
    } catch (error){
        console.error('Error saat menampilkan berita:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menampilkan berita' });
    }
}
const deleteDraft = async (req,res)=>{
    try{
        const {id_berita} = req.params
        const id_user = req.user.id
        const berita = await Berita.findOne({ where: { id_berita, id_user } });

        if (!berita) {
            return res.status(404).json({ success: false, message: 'Berita tidak ditemukan atau tidak memiliki izin untuk menghapusnya' });
        }

        // Delete the berita
        await berita.destroy();

        return res.status(200).json({ success: true, message: 'Berita berhasil dihapus' });
    } catch (error) {
        console.error('Error saat menghapus berita:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus berita' });
    }
};

const getDetailBerita = async (req,res)=> {
  try{
      const {id_berita} = req.params
      // Cari berita dengan id_user dan id_berita
      const berita = await Berita.findOne({
          where: {
              id_berita: id_berita
          },
      });
      
      if (!berita) {
          return res.status(404).json({ message: 'Detail berita tidak ditemukan' });
      }

      return res.status(200).json({
          message: 'Detail berita ditemukan',data:berita
      });
  } catch (error){
      console.error('Error saat menampilkan berita:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat menampilkan berita' });
  }
}

const beritaDiterima = async (req, res) => {
  try {
      const { id_berita } = req.params;

      
      const berita = await Berita.findOne({
          where: { id_berita }
      });

      if (!berita) {
          return res.status(404).send('Berita tidak ditemukan');
      }

      
      await Berita.update({ status: 'selesai' }, { where: { id_berita } });

      
      const deskripsi = `Berita Anda yang berjudul ${berita.judul} diterima. Imbalan telah dikirimkan silahkan cek email Anda`;

      await Notifikasi.create({
        id_user: berita.id_user,         // User yang terkait
        id_berita: berita.id_berita,     // Berita yang terkait
        deskripsi: deskripsi,
        status: 'belum dibaca',                  // Status default untuk notifikasi
    });

      res.status(200).json({message:'Notifikasi Berhasil Dikirimkan',data:berita});
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status berita:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status berita');
  }
};

const markAsRead = async (req, res) => {
  try {
      await Notifikasi.update({ status :'dibaca' }, {
          where: { id_user: req.user.id, status: 'belum dibaca' }
      });

      
      res.json({ message: 'Notifikasi telah dibaca, status diperbarui!' });
  } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).send('Internal Server Error');
  }
};

module.exports = {
    getAllBerita,
    createOrUpdateBerita,
    saveBerita,
    getSaveBerita,
    deleteDraft,
    getOnProgressBerita,
    getRejectedBerita,
    getSelesaiBerita,
    getDetailBerita,
    beritaDiterima,
    markAsRead
}