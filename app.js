new Vue({
    el: '#app',
    data: {
      form: {
        nama: '',
        nik: '',
        noKK: '',
        fotoKTP: null,
        fotoKK: null,
        umur: null,
        jenisKelamin: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        alamat: '',
        rt: '',
        rw: '',
        penghasilanSebelum: null,
        penghasilanSesudah: null,
        alasan: '',
        alasanLainnya: '',
        confirm: false,
      },
      provinsiList: [],
      kabupatenList: [],
      kecamatanList: [],
      kelurahanList: [],
      showPreview: false,
      isSubmitting: false,
      progress: 0,
    },
    methods: {
      updateProgress() {
        const fields = ['nama', 'nik', 'noKK', 'umur', 'jenisKelamin', 'provinsi', 'kabupaten', 'kecamatan', 'kelurahan', 'alamat', 'rt', 'rw', 'penghasilanSebelum', 'penghasilanSesudah', 'alasan', 'confirm'];
        let filledFields = fields.filter(field => this.form[field]);
        this.progress = (filledFields.length / fields.length) * 100;
      },
      handleFileUpload(fieldName, event) {
        const file = event.target.files[0];
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB.');
            event.target.value = null;
          } else if (!validFormats.includes(file.type)) {
            alert('Format file harus JPG/JPEG/PNG/BMP.');
            event.target.value = null;
          } else {
            this.form[fieldName] = file;
          }
        }
      },
      fetchProvinsi() {
        axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
          .then(response => {
            this.provinsiList = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      fetchKabupaten() {
        this.kabupatenList = [];
        this.kecamatanList = [];
        this.kelurahanList = [];
        this.form.kabupaten = '';
        this.form.kecamatan = '';
        this.form.kelurahan = '';
        if (this.form.provinsi) {
          axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${this.form.provinsi}.json`)
            .then(response => {
              this.kabupatenList = response.data;
            })
            .catch(error => {
              console.error(error);
            });
        }
      },
      fetchKecamatan() {
        this.kecamatanList = [];
        this.kelurahanList = [];
        this.form.kecamatan = '';
        this.form.kelurahan = '';
        if (this.form.kabupaten) {
          axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${this.form.kabupaten}.json`)
            .then(response => {
              this.kecamatanList = response.data;
            })
            .catch(error => {
              console.error(error);
            });
        }
      },
      fetchKelurahan() {
        this.kelurahanList = [];
        this.form.kelurahan = '';
        if (this.form.kecamatan) {
          axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${this.form.kecamatan}.json`)
            .then(response => {
              this.kelurahanList = response.data;
            })
            .catch(error => {
              console.error(error);
            });
        }
      },
      getNameById(list, id) {
        const item = list.find(el => el.id == id);
        return item ? item.name : '';
      },
      submitForm() {
        if (this.form.umur <= 25) {
          alert('Umur harus lebih dari atau sama dengan 25 tahun.');
          return;
        }
        this.isSubmitting = true;
        setTimeout(() => {
          const success = Math.random() > 0.5;
          this.isSubmitting = false;
          if (success) {
            alert('Data berhasil dikirim!');
            this.showPreview = true;
          } else {
            alert('Gagal mengirim data. Silakan coba lagi.');
          }
        }, 1500);
      }
    },
    mounted() {
      this.fetchProvinsi();
    }
  });
  
