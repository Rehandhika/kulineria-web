const fs = require('fs');
const path = require('path');
const foodsDir = path.join(__dirname, 'src/content/foods');

const stories = {
  'rendang': 'Rendang lahir dari tradisi merantau orang Minang yang butuh bekal tahan lama buat perjalanan jauh. Makanya daging dimasak perlahan pake santan dan belasan rempah sampai kering, bisa tahan berbulan-bulan. Kata randang dari marandang, proses masak santan sampai airnya habis. Awalnya pake daging kerbau yang dianggap hewan penting, sekarang daging sapi lebih umum. Setiap keluarga punya resep rahasia turun-temurun. Tahun 2011 dan 2017, CNN kasih gelar makanan terenak di dunia.',

  'pempek': 'Pempek awalnya disebut kelesan, makanan rumahan warga Palembang dari campuran ikan dan sagu. Baru tahun 1917, seorang pria Tionghoa tua yang dipanggil Apek mulai jualan keliling naik sepeda. Orang manggil dia Pek, Pek, lama-lama jadilah nama pempek. Adonan ini sebenernya udah ada sejak zaman Sriwijaya abad ke-7. Disajikan sama cuko hitam dari gula merah, cabai, dan cuka yang asem pedas manis. Varian terkenal kayak kapal selam berisi telur dan lenjer.',

  'soto-betawi': 'Soto Betawi lahir dari perpaduan budaya di Batavia tempo dulu. Awalnya dari caudo, makanan berkuah bawaan imigran Tionghoa abad ke-18, isian daging babi diganti sapi. Nama Soto Betawi muncul tahun 1977, dipopulerkan Lie Boen Po di THR Lokasari. Bedanya soto Betawi sama soto lain ada di kuahnya yang pake campuran santan dan susu sapi, dikasih pala, cengkeh, kayu manis. Isinya daging sapi, jeroan, kentang, dan emping. Ditetapkan sebagai warisan budaya Jakarta.',

  'nasi-goreng': 'Nasi goreng berawal dari tradisi Tiongkok kuno ngolah nasi sisa biar nggak mubazir. Waktu pedagang Tionghoa bawa teknik ini ke Nusantara abad ke-16, orang lokal nambahin terasi, kecap manis, dan cabai. Kecap manis inilah yang bikin nasi goreng Indonesia beda dari negara lain, warnanya coklat keemasan, rasanya manis gurih. Dari gerobak kaki lima sampai hotel bintang lima, nasi goreng ada di mana-mana. Tahun 2017 CNN ngasih peringkat kedua makanan terenak dunia.',

  'gudeg': 'Gudeg udah ada sejak Panembahan Senopati buka hutan Alas Mentaok buat Kerajaan Mataram Islam abad ke-16. Di hutan itu banyak nangka dan kelapa, jadi para prajurit masak nangka muda pake santan di kuali besar. Karena porsinya banyak, mereka ngaduk pake dayung perahu, gerakannya disebut hangudeg, dari situlah nama gudeg berasal. Sekarang gudeg identik sama Jogja, dimakan sama nasi, ayam bacem, telur, tahu, tempe, dan sambal krecek. Ada versi basah dan kering.',

  'mie-aceh': 'Mie Aceh beda sama mie lain karena bumbu karinya yang kental dan pedas. Ini pengaruh dari pedagang India dan Timur Tengah yang singgah di Banda Aceh, pelabuhan utama Nusantara zaman dulu. Mienya pake mie kuning tebal mirip spaghetti, dimasak sama belasan rempah kayak jintan, kapulaga, dan kunyit. Biasanya pake daging kambing atau seafood. Ada tiga varian: kuah, tumis, dan goreng kering. Toppingnya kerupang, bawang goreng, dan acar bawang merah.',

  'coto-makassar': 'Coto Makassar udah ada sejak Kerajaan Gowa abad ke-16. Awalnya cuma buat kalangan istana dan bangsawan, rakyat biasa dilarang nyobain. Ada cerita coto diciptakan Toak, juru masak istana, dari jeroan sisa daging kerbau. Dibumbui 40 jenis rempah yang disebut rampah patang pulo. Bedanya dengan sup lain, kuahnya kental dari kacang tanah sangrai dan air tajin, bukan santan. Disajikan sama ketupat atau burasa dan sambal tauco. Sekarang jadi ikon kuliner Makassar.',

  'dendeng-balado': 'Dendeng balado daging sapi tipis yang digoreng garing kayak keripik, khas Minang. Dendeng berarti daging diawetkan, balado berarti bumbu cabai. Prosesnya unik: daging direbus bumbu dulu, diiris tipis searah serat, dipukul pake ulekan biar melebar, baru digoreng sampai renyah. Abis itu disiram tumisan cabai merah keriting dan bawang merah. Perpaduan tekstur garing dan rasa pedas gurih bikin ketagihan. Dulu ini cara orang Minang awetkan daging tanpa kulkas.',

  'es-pisang-ijo': 'Es Pisang Ijo lahir dari Makassar sebagai versi dingin pisang ijo klasik. Pisang raja dibungkus kulit hijau dari tepung beras dan daun suji, dikukus, disajikan di atas bubur sumsum. Yang bikin spesial ada sirup DHT merah rasa pisang ambon yang wangi banget, ditambah es serut dan susu kental manis. Dulu cuma disajikan pas acara tertentu kayak pernikahan adat, sekarang jadi takjil favorit sepanjang tahun apalagi pas Ramadhan. Manis, dingin, dan legit.',

  'gado-gado': 'Nama gado-gado dari bahasa Betawi digado, artinya dimakan tanpa nasi. Sejarahnya ada beberapa versi: ada yang bilang dari Kampung Tugu keturunan Portugis abad ke-17, ada juga yang bilang modifikasi pecel Jawa sama warga Tionghoa. Yang jelas gado-gado udah populer sejak tahun 1950-an. Isinya campuran sayur rebus kayak kangkung, tauge, kacang panjang, tahu, tempe, telur, dan lontong. Siraman bumbu kacangnya pake kencur dan jeruk purut, bedain sama pecel.',

  'gangan-asam': 'Gangan Asam sayur kuah kuning khas Banjar, Kalimantan Selatan. Beda sama sup biasa, rasa asamnya dari terung asam khas Kalimantan, bukan asam jawa. Ikan patin jadi lauk utama, lemaknya lumer di kuah kuning dari kunyit, jahe, dan serai. Ditambah pucuk pisang muda atau talas yang bikin tekstur unik. Cocok dimakan pas cuaca panas terik, rasanya segar, gurih, pedas. Mencerminkan kearifan lokal sungai-sungai Kalimantan yang kaya akan ikan air tawar.',

  'gangan-habang': 'Gangan Habang atau Masak Habang pusaka kuliner Banjar. Habang berarti merah, tapi meski kuahnya merah gelap pekat, rasanya justru manis legit bukan pedas. Soalnya cabai merah kering dibuang biji dulu, direbus, dihaluskan sama gula merah Banjar yang melimpah. Bumbu merah ini dimasak sama daging, telur bebek, atau ikan haruan asap. Prosesnya butuh kesabaran, bumbu ditumis sampai pecah minyak. Wajib ada di setiap acara adat dan pernikahan Banjar.',

  'gohu-ikan': 'Gohu Ikan sering disebut sashimi Maluku Utara. Ikan tuna segar hasil tangkapan nelayan langsung dipotong dadu, dimasak kimiawi pake perasan jeruk nipis. Asamnya bikin protein ikan berubah jadi putih susu dan kenyal, mirip proses bikin ceviche. Uniknya dikasih siraman minyak kelapa kampung panas yang harum, ditaburi kacang kenari hutan sangrai dan daun kemangi liar. Sensasi dingin kenyal ikan, hangat minyak kelapa, renyah kacang kenari, juara banget.',

  'gulai-ikan': 'Gulai Ikan, apalagi gulai kepala kakap merah, hidangan laut andalan Minangkabau. Kuah santan kuningnya kaya rempah kayak kunyit, jahe, lengkuas, serai. Yang bikin beda ada daun ruku-ruku alias kemangi hutan khas Minang dan asam kandis yang ngasih aroma segar sekaligus ngilangin bau amis ikan. Masak gulai ikan tantangannya jangan sampai santan pecah. Kepala ikan kakap dimasukin hati-hati biar dagingnya tetep utuh dan lembut pas disantap.',

  'ikan-asar': 'Ikan Asar teknik pengasapan tradisional dari Maluku dan Papua. Kata asar berarti diasapi. Dulu sebelum ada kulkas, nelayan ngawetkan tangkapan lautnya pake asap sabut kelapa dan tempurung. Ikan cakalang atau tongkol dibelah, dijepit bilah bambu, diasap 4 sampai 8 jam di atas bara api. Hasilnya daging padat, warna coklat mengkilap, aroma asap kuat. Bisa dimakan langsung pake sambal colo-colo atau diolah lagi jadi masakan kuah santan.',

  'ikan-kuah-kuning': 'Ikan Kuah Kuning pendamping setia papeda di Maluku dan Papua. Kuah kuning dapet warna dari kunyit, dicampur jeruk nipis, kemangi hutan, dan serai. Dulu rempah ini bukan cuma penyedap tapi juga ngilangin bau amis ikan laut. Ikan tongkol atau tuna dimasak utuh dalam kuah asam segar, gurih, dan pedas dari cabai rawit. Buat orang timur, hidangan ini melambangkan kehangatan keluarga dan harmoni antara laut dan darat.',

  'ikan-woku': 'Ikan Woku Belanga kebanggaan Minahasa, Sulawesi Utara. Beda sama masakan lain, woku dominan pake daun-daunan aromatik dalam jumlah banyak: kemangi, jeruk purut, daun kunyit, daun pandan, dan daun bawang. Wanginya kuat dan segar, langsung ngilangin bau amis ikan. Dulu namanya Woku Daun, bumbu dibungkus daun woka dipanggang di bara. Sekarang dimasak pake belanga tanah liat jadi Woku Belanga. Rasanya pedas, segar, dan harum banget.',

  'iwak-pakasam': 'Iwak Pakasam ikan fermentasi khas Barabai, Kalimantan Selatan. Beda sama ikan asin biasa, pakasam pake beras ketan sangrai yang ditumbuk kasar sebagai campuran fermentasi. Ikan kecil kayak sepat atau betok dibalur garam dan beras ketan sangrai, didiemin 3 sampai 7 hari. Proses fermentasi ini bikin ikan jadi asem segar alami. Enaknya pas digoreng, beras ketannya jadi renyah garing kayak lapisan tepung. Biasanya ditumis sama bawang merah dan cabai rawit.',

  'kapurung': 'Kapurung dari Tana Luwu, Sulawesi Selatan. Intinya bola-bola sagu kenyal transparan yang disiram kuah kaldu ikan kuning asem gurih. Dilengkapi sayuran rebus kayak kangkung, bayam, kacang panjang, jantung pisang, jagung manis, suwiran ikan cakalang atau udang. Dulu sagu makanan pokok orang Luwu sebelum beras terkenal. Tradisi ma-kapurung, makan bareng dari satu wadah besar, jadi simbol kebersamaan dan gotong royong warga Bugis-Luwu.',

  'ketupat-kandangan': 'Ketupat Kandangan dari kota Kandangan, Kalimantan Selatan. Beda dari ketupat biasa, ketupatnya sengaja dibuat agak lembek biar gampang hancur pas dicampur kuah. Dimakan pake tangan, diremas-remas sama kuah santan kuning dan ikan haruan asap. Ikan gabusnya diasap dulu di atas bara, jadi aromanya smoky banget. Perpaduan rasa gurih santan, rempah kuning, dan asap ikan ditambah tekstur ketupat berderai, bikin pengalaman unik.',

  'kohu-kohu': 'Kohu-kohu versi Maluku dari urap sayur, tapi ada suwiran ikan cakalang asap di dalamnya. Dulu nelayan bikin ini dari sisa ikan asar kemarin dicampur sayuran segar pekarangan. Kacang panjang dan tauge cuma direbus sebentar biar masih krenyes. Bumbu kelapanya dikasih perasan lemon cui, bawang merah iris, dan cabai rawit. Ikan asap ngasih rasa gurih laut yang dalem. Biasanya dimakan sama singkong rebus atau sagu lempeng.',

  'konro': 'Sop Konro ikon Makassar dengan kuah hitam pekat dari buah kluwek. Beda dari rawon, konro pake iga sapi plus sumsum tulang yang bikin kaldu makin gurih. Dulu pake daging kerbau dan cuma disajikan pas acara adat kayak pernikahan atau syukuran. Sekarang iga sapi lebih umum, tapi bumbu 40 rempah masih dipertahankan. Daging iganya empuk banget, kuahnya gelap pekat. Disajikan sama ketupat dan sambal. Ditetapkan sebagai warisan budaya.',

  'kue-bagea': 'Kue Bagea camilan legendaris Maluku dan Papua dari tepung sagu, gula merah, kayu manis, dan cengkeh. Ini peninggalan zaman perdagangan rempah dulu. Teksturnya unik: keras di luar tapi langsung lumer dan berpasir di mulut. Itu ciri khas sagu murni. Taburan kacang kenari di atas ngasih rasa gurih alami yang mewah. Orang Maluku biasa nyediain bagea pas minum teh sore atau kopi jahe hangat. Nyuguhin bagea ke tamu itu tanda penghormatan.',

  'lawar': 'Lawar bukan cuma makanan tapi tradisi di Bali. Proses ngelawar dilakukan bareng-bareang kaum pria sehari sebelum upacara adat, maknanya gotong royong. Lawar putih pake kelapa tanpa darah, lawar merah pake darah segar yang bikin rasa makin gurih. Isinya campuran kelapa parut, sayur kayak kacang panjang, daging cincang, dan basa gede alias bumbu lengkap Bali. Setiap gigitan kaya rempah, ada gurih kelapa bakar dan pedas yang seimbang.',

  'mandai': 'Mandai atau Mandai Tiwadak makanan paling unik dari Kalimantan Selatan. Lahir dari cara orang Banjar ngawetin kulit buah cempedak yang melimpah pas musim. Kulit bagian dalamnya difermentasi pake air garam dalam toples kedap udara, bisa dari mingguan sampai tahunan. Semakin lama makin enak rasanya. Pas digoreng sama bawang dan cabai, teksturnya berserat kayak daging ayam, rasanya gurih masam asin. Banyak yang bilang mirip vegan meat.',

  'nasi-campur': 'Nasi Campur Bali adalah keberagaman dalam satu piring. Di atas nasi putih, ada sate lilit wangi serai, lawar segar, ayam sisit berbumbu merah, kacang goreng renyah, telur bumbu Bali, dan sambal matah pedas. Setiap lauk pake teknik masak beda: dibakar, disuwir, digoreng. Dulu cuma masakan rumahan, sekarang jadi buruan wisatawan. Manis, pedas, gurih, asin, dan segar berpadu dalam setiap suapan. Mencerminkan keramahan budaya Bali.',

  'nasi-jinggo': 'Nasi Jinggo jajanan malam paling populer di Bali. Porsinya mungil, cuma sekepalan tangan, dibungkus daun pisang bentuk kerucut. Isinya nasi putih atau kuning, ayam suwir, mie goreng, kering tempe, serundeng, dan sambal embe yang pedas nampol. Nama Jinggo dari Hokkien jeng go artinya seribu lima ratus, harga jual pas pertama muncul tahun 1990-an. Ada yang bilang dari film Django, soalnya sambalnya nembak di lidah.',

  'nasi-kuning-banjar': 'Buat orang Banjar, pagi belum afdol tanpa Nasi Kuning Banjar. Beras lokal kayak beras Unus yang pera dimasak sama santan, kunyit, pandan, serai, jeruk purut. Hasilnya butirannya pera nggak lengket, harum banget. Lauk wajibnya Masak Habang, bumbu merah manis legit dari cabai kering dan gula merah, dimasak sama ikan haruan asap, ayam, atau telur bebek. Dibungkus daun pisang, aromanya sedap. Beda banget sama nasi kuning Jawa.',

  'nasi-kuning': 'Nasi Kuning identik sama acara selamatan di Jawa. Warnanya kuning dari kunyit, dari dulu dipercaya simbol emas, kemakmuran, dan rasa syukur. Makanya sering dibentuk tumpeng kerucut menjulang. Rahasia warnanya cerah ada di perasan jeruk nipis yang mengunci warna kurkumin biar nggak kusam. Dimasak pake santan, daun pandan, serai, salam. Lauknya kering tempe, abon, telur dadar iris, perkedel, ayam goreng kuning. Disajikan di acara syukuran.',

  'nasi-lapola': 'Nasi Lapola makanan pokok alternatif dari Maluku. Bedanya, nasi ini dicampur kacang tolo dan parutan kelapa. Dimasak setengah matang dulu, dicampur kelapa dan kacang tolo, lalu dikukus sampai matang sempurna. Aroma kelapa kukusnya harum banget, rasanya gurih pekat. Enak disantap hangat apalagi ditumis sebentar pake minyak kelapa. Biasanya jadi pendamping cakalang fufu, ikan asar, atau sambal colo-colo. Mencerminkan kearifan lokal Maluku.',

  'nasi-liwet': 'Nasi Liwet Solo awalnya dari Desa Menuran, Sukoharjo, cuma dimasak buat acara syukuran. Nasi dimasak langsung dengan santan, pandan, serai, salam di panci cor, nggak dikukus. Hasilnya nasi gurih basah, pulen berminyak tipis. Disajikan pake pincuk daun pisang, dikasih kuah labu siam, ayam suwir opor, telur bacem, areh sari santan kental. Abad ke-19 udah jadi favorit keraton Solo, disukai raja dan para abdi dalem.',

  'nasi-padang': 'Nasi Padang terkenal dengan tradisi hidangnya. Pelayan bawa belasan piring lauk bertumpuk di lengan, ditaruh semua di meja. Kita pilih mau makan apa, bayar sesuai yang dimakan. Dari rendang legendaris, gulai tunjang kenyal, sampai sambal ijo yang pedas segar, semuanya punya rasa masing-masing. Dulu pas kolonial, nasi Padang bungkus dikasih porsi lebih biar pembeli bisa bagi sama keluarga di rumah. Itu budaya solidaritas orang Minang.',

  'nasi-uduk': 'Nasi Uduk sarapan favorit Jakarta. Nasi dimasak dengan santan, pandan, serai, cengkeh, pala, dan kayu manis. Wanginya semerbak, rasanya gurih. Kata uduk dari bahasa Sunda atau Jawa artinya campur. Perpaduan budaya Melayu nasi lemak sama Arab nasi kebuli. Bedanya nasi uduk Betawi dengan nasi lemak ada di sambalnya: pake sambal kacang cair pedas gurih asam, bukan sambal bilis. Ditabur bawang goreng Sumenep melimpah.',

  'pallubasa': 'Pallubasa mirip coto Makassar tapi ada beda. Kuahnya lebih kental karena dicampur kelapa parut yang disangrai sampai coklat gelap, dihaluskan, baru dimasukkan. Hasilnya kuah gurih manis asin yang pekat, berserat, dengan aroma asap kelapa kuat. Dulu pallubasa makanan kelas pekerja, sementara coto buat bangsawan. Para jagal pake jeroan dan sisa potongan daging. Ironisnya sekarang pallubasa jadi favorit semua kalangan.',

  'papeda': 'Papeda bubur sagu khas Maluku dan Papua. Teksturnya putih bening, lengket kayak lem, rasanya tawar. Makanya selalu dimakan bareng ikan kuah kuning yang asem pedas. Cara makannya unik: pake sumpit atau garpu buat ngegulung papeda sampai jadi gumpalan, baru dicelup ke kuah. Sagu udah jadi makanan pokok orang Papua sejak ribuan tahun lalu. Sering hadir di acara adat penting kayak upacara kematian dan kelahiran. Ditetapkan sebagai warisan budaya tahun 2015.',

  'pecel': 'Pecel udah ada sejak zaman Mataram. Kata pecel disebut di Serat Centhini abad ke-19 sebagai hidangan sayur rebus bersiram sambal kacang. Bedanya sama gado-gado, bumbu pecel pake kencur dan daun jeruk purut dominan. Rasanya segar, wangi sitrus. Sayurnya sederhana: bayam, tauge, kacang panjang, kembang turi. Penyajian paling autentik pake pincuk daun pisang. Kota Madiun terkenal sebagai sentra pecel paling enak di Indonesia.',

  'pisang-ijo': 'Pisang Ijo dari Makassar, bukan cuma jajanan tapi punya makna mendalam. Warna hijau pada kulitnya melambangkan kemakmuran, kedamaian, dan harapan baru. Dulu sering disajikan di acara pernikahan adat Bugis-Makassar sebagai simbol doa buat pengantin. Pisang raja dibalut adonan tepung beras dan santan berwarna hijau dari daun suji, dikukus, disajikan di atas bubur sumsum. Lembut, legit, manis. Sekarang dinikmati kapan aja.',

  'plecing-kangkung': 'Plecing Kangkung andalan Lombok dan Bali. Kangkungnya pake kangkung air Lombok yang batangnya besar, berongga, krenyes pas digigit. Direbus setengah matang, disiram sambal plecing dari cabai rawit, tomat, terasi lombok yang manis gurih. Ditaburin kacang tanah goreng dan kacang tolo rebus. Perasan jeruk limau dikasih pas mau makan, bikin makin seger. Pendamping paling pas buat ayam taliwang atau sate lilit.',

  'rawon': 'Rawon salah satu sup tertua di Indonesia. Prasasti Taji dari tahun 901 Masehi di Ponorogo udah nyebut hidangan rarawwan yang diyakini cikal bakal rawon. Kuah hitam pekatnya dari kluwek, biji pohon kepayang yang difermentasi. Daging sandung lamur dimasak lama sama bumbu kluwek, bawang, kemiri, ketumbar, kunyit. Disajikan sama tauge pendek, telur asin, sambal terasi, kerupuk udang. Tahun 2023 TasteAtlas ngasih gelar sup terbaik dunia.',

  'sagu-lempeng': 'Sagu Lempeng roti kering khas Maluku dan Papua. Beda sama papeda yang basah, sagu lempeng sengaja dikeringkan biar awet berbulan-bulan. Dimasak pake cetakan tanah liat bernama forna yang dipanaskan di atas bara sabut kelapa. Dulu jadi bekal utama penjelajah dan nelayan pas perjalanan jauh melintasi laut. Teksturnya keras, cara makannya dicelup ke kopi atau teh dulu biar lunak. Sekarang banyak yang dikasih kelapa parut.',

  'sambal-colocolo': 'Sambal Colo-colo sambal mentah khas Maluku. Uniknya nggak diulek tapi diiris kasar, jadi tekstur bahannya keliatan semua. Isinya bawang merah iris, tomat hijau, cabai rawit, perasan jeruk nipis atau lemon cui. Versi asli nggak pake kecap manis, rasa manisnya dapet alami dari bawang merah lokal. Tapi varian pake kecap mulai populer di luar Maluku. Wajib jadi temen ikan bakar atau ikan asar Ambon, seger dan pedas.',

  'sate-babi': 'Sate Babi Bali beda dari sate lain. Bumbunya pake kunyit, kencur, terasi, cabai rawit dihaluskan, ditambah kecap manis. Potongan daging diselang-seling lemak. Pas dibakar di arang batok kelapa, lemaknya meleleh bikin asap tebal wangi karamel. Luarnya agak garing, dalemnya masih lembut berair. Disajikan sama tipat dan sup bumbu kuning yang gurih. Jajanan malam paling dicari di Bali, mulai jualan pas sore.',

  'sate-banjar': 'Sate Banjar beda dari sate Madura atau Ponorogo. Daging ayamnya diiris tipis memanjang, ditusuk berkelok-kelok kayak gelombang. Sausnya bukan kacang tapi bumbu merah dari cabai kering, bawang, kemiri, dan kentang yang dihaluskan sampai kental mengilap. Dikasih perasan jeruk kuit khas Banjar yang wangi. Marinasi sebelum dibakar bikin bumbu meresep dalem. Rasanya gurih, manis legit, seger dari jeruk kuit.',

  'sate-lilit': 'Sate Lilit beda dari sate biasa. Daging dicincang halus, dicampur kelapa parut dan bumbu basa genep, dililitkan ke batang serai atau pelepah kelapa. Pas dibakar, minyak atsiri dari serai meresep ke daging, bikin wangi herbal yang khas. Dulu cuma buat upacara adat, melambangkan persatuan dan kebersamaan. Sekarang jadi makanan sehari-hari di Bali. Dimakan sama sambal matah, rasanya gurih pedas wangi serai.',

  'sate-padang': 'Sate Padang ada tiga varian: Padang Panjang kuah kuning, Pariaman kuah merah lebih pedas, Padang kota kuah coklat. Kuahnya bukan dari kacang, tapi tepung beras dimasak sama belasan rempah kayak kapulaga, ketumbar, jinten, kunyit. Dagingnya direbus dulu sebelum dibakar biar bumbu meresep. Disajikan sama ketupat dan taburan bawang goreng. Sejarahnya sate Padang disebarin santri dari Padang Panjang yang belajar agama ke Pariaman.',

  'sop-saudara': 'Sop Saudara lahir tahun 1957 dari Haji Muhammad Aliah, penjual coto asal Pangkep. Terinspirasi nama kedai Es Saudara, dia pengen bikin sup yang bikin orang makan bareng kayak saudara. Bedanya sama coto, kuahnya kuning keruh tanpa kacang, pake jahe, lengkuas, pala, kayu manis, cengkeh. Isinya daging sapi, bihun, perkedel kentang, telur rebus, paru goreng garing. Satu mangkuk berisi tekstur kenyal, lembut, dan renyah.',

  'soto-banjar': 'Soto Banjar beda dari soto lain. Kuahnya pake kayu manis, pala, cengkeh, kapulaga yang bikin wangi hangat khas. Beberapa versi ngentalin kuah pake susu kental manis atau telur bebek yang dihancurin. Disajikan sama ketupat segitiga, bukan nasi. Pelengkapnya perkedel, soun, telur bebek, perasan limau kuit. Soto ini udah ada sejak zaman Kesultanan Banjar, sering disajikan di acara adat dan pernikahan jadi simbol kehangatan.',

  'soto-medan': 'Soto Medan kuahnya kuning dari santan dan kunyit, kental dan kaya rempah. Bedanya dari soto lain, soto Medan pake pengaruh Melayu, Tionghoa, dan India yang kental. Isinya daging sapi atau ayam, kadang ada udang dan kerupuk. Bumbu kapulaga, cengkeh, kayu manis, pala. Ditabur bawang goreng, daun bawang, jeruk nipis. Disajikan sama ketupat atau nasi. Kota Medan yang multietnis bikin soto ini punya rasa kompleks.',

  'tinutuan': 'Tinutuan atau Bubur Manado lahir dari masa sulit pas perang. Karena beras terbatas, warga Minahasa mencampurnya dengan ubi, labu kuning, jagung, dan sayuran kayak kangkung, bayam, kemangi, daun gedi. Semua dimasak jadi satu sampai hancur lumer, warnanya kuning keemasan. Tinutuan dari bahasa Minahasa artinya diaduk campur. Dulu cara bertahan hidup, sekarang jadi kuliner sehat kebanggaan. Dikasih ikan asin dan sambal terasi.',

  'tongseng': 'Tongseng dari Klego, Boyolali, Jawa Tengah. Sisa potongan daging kambing yang nggak dipake buat sate, kayak serpihan daging berlemak, diolah jadi tongseng. Beda sama gulai, tongseng dimasak dadakan per porsi di wajan. Daging ditumis minyak samin, bawang merah, cabai rawit utuh, kecap manis, kol, dan tomat segar. Abis itu dikasih kuah gulai kuning. Sayur kolnya masih garing, ada rasa manis karamel dari kecap.',

  'bubur-ne': 'Bubur Ne pencuci mulut khas Maluku dari sagu mutiara dan santan. Sagu mutiaranya dimasak sama gula merah Ambon yang wangi, dikasih daun pandan. Hasilnya kuah santan gula merah manis gurih dengan bulatan sagu kenyal yang nyusun. Biasanya dimakan dingin sebagai dessert abis makan besar, atau hangat sebagai takjil buka puasa. Nama Ne katanya dari suara orang Maluku pas manggil sagu mutiara. Sederhana tapi nagih.',

  'cakalang-fufu': 'Cakalang Fufu teknik pengasapan khas Minahasa, Sulawesi Utara. Ikan cakalang dibelah, dijepit bambu melengkung, diasap pake kayu keras selama 4 jam sampai merah kering. Tujuannya ngawetkan ikan, tekniknya disebut fufu. Aroma asapnya kuat banget, khas banget. Biasanya disuwir dan digoreng pake bumbu rica-rica super pedas. Dulu cara nenek moyang Minahasa nyimpan ikan tanpa kulkas. Sekarang jadi bahan premium yang dicari banyak restoran.',

  'bika-ambon': 'Bika Ambon dari Medan punya tekstur bersarang-sarang yang khas. Adonan tepung tapioka, telur, santan, gula, harus difermentasi dulu 12 sampai 24 jam sampai ngembang dan bersarang. Aroma khasnya dari daun pandan, kadang dikasih daun jeruk biar makin wangi. Dimatangkan di oven bawah biar sarangnya keluar sempurna. Namanya bika dari bahasa Tamil, ambon mungkin dari empon-empon. Dulu cuma ada pas lebaran, sekarang jadi oleh-oleh Medan.',

  'ayam-betutu': 'Ayam Betutu dari Bali, kata betutu dari be (daging) dan tutu (dibakar). Ayam utuh dilumuri base genep, bumbu lengkap Bali dari kunyit, jahe, lengkuas, kencur, bawang, cabai. Dibungkus daun pisang, dibakar atau dikukus berjam-jam sampai empuk dan bumbu meresep. Dulu cuma buat upacara adat atau sesaji. Tahun 1978 Men Tempeh mulai jualan betutu di Gilimanuk dan bikin populer. Dimakan sama sambal matah dan lawar.',

  'ayam-cincane': 'Ayam Cincane khas Kalimantan Timur, sering disajikan pas acara adat suku Kutai. Ayam kampung dibakar sambil dioles bumbu merah dari cabai, bawang, gula merah, dan rempah. Kata cincane dari proses dioles-oles bumbu sambil dipanaskan di atas api. Dimasak pelan-pelan biar bumbu meresep ke serat daging sampe ke tulang. Rasanya manis, pedas, gurih. Disajikan sama nasi kuning atau ketupat di acara pernikahan.',

  'ayam-pop': 'Ayam Pop andalan rumah makan Padang. Bedanya sama ayam goreng biasa, ayam pop direbus dulu dengan air kelapa dan bumbu sampai empuk, baru digoreng sebentar di minyak panas. Hasilnya ayam putih pucat, nggak sampai kering atau coklat. Teksturnya super lembut, hampir kayak ayam kukus. Dinikmati sama sambal ijo khas Padang yang pedas segar dan nasi hangat. Asalnya dari daerah Singkarak, Sumatera Barat.',

  'ayam-taliwang': 'Ayam Taliwang dari Lombok, namanya dari Taliwang Sumbawa Barat. Ayam kampung dibakar sambil dioles bumbu cabai, bawang, tomat, gula merah, terasi lombok. Pedasnya nampol banget, beda sama ayam bakar daerah lain yang cenderung manis. Dimakan sama plecing kangkung segar dan nasi hangat. Dulu cuma buat raja dan keluarga istana, sekarang jadi ikon kuliner Lombok yang dicari wisatawan lokal dan mancanegara.',

  'babi-guling': 'Babi Guling ikon kuliner Bali yang terkenal. Babi utuh diisi bumbu base genep, kunyit, jahe, serai, bawang, cabai, lalu diputar di atas api sampai kulitnya garing kecoklatan. Prosesnya butuh waktu berjam-jam. Dagingnya empuk, bumbu meresep sempurna, kulitnya renyah banget. Disajikan sama lawar, sambal embe, dan nasi putih. Aslinya cuma buat upacara adat, sekarang banyak warung yang buka tiap hari.',

  'bebek-betutu': 'Bebek Betutu khas Bali, mirip ayam betutu tapi pake bebek. Bebek utuh dibumbui base genep, dibungkus daun pisang, dikukus atau dipanggang berjam-jam sampai empuk. Di Bali, bebek betutu punya tempat khusus. Bebek dianggap hewan suci karena nggak pernah berebut makanan, jadi sering dipake buat sesaji upacara keagamaan. Dagingnya lebih padat dan berlemak dari ayam, rasanya lebih kaya. Disajikan sama sambal matah dan lawar.',

  'bingka-barandam': 'Bingka Barandam kue tradisional Banjar yang super lembut. Namanya barandam artinya berendam, soalnya kue ini setelah matang direndam dalam sirup gula pandan manis. Teksturnya mirip bolu spons dengan rongga-rongga besar, hasil dari ngocok telur bebek sampai mengembang. Pas dimakan, sirup manis meresep ke dalam rongga dan langsung meluber di mulut. Jadi takjil favorit pas Ramadhan di Kalimantan Selatan, lembut dan legit.',
};

const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));
let updated = 0;
files.forEach(file => {
  const filePath = path.join(foodsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const key = path.basename(file, '.json');
  if (stories[key] && data.story) {
    data.story.body = stories[key];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    updated++;
  }
});
console.log(`Updated ${updated} files`);

// Full verification
let allOk = true;
files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(foodsDir, file), 'utf-8'));
  const body = data.story?.body || '';
  const words = body.split(/\s+/).length;
  const hasEmDash = body.includes('\u2014') || body.includes('\u2013');
  console.log(`${data.name.padEnd(22)} ${words}w${words < 78 || words > 95 ? ' <<<' : ''}${hasEmDash ? ' EM-DASH' : ''}`);
  if (words < 78 || words > 95 || hasEmDash) allOk = false;
});
if (allOk) console.log('\nAll stories pass!');
