const fs = require('fs');
const path = require('path');
const foodsDir = path.join(__dirname, 'src/content/foods');

// Pad stories to reach 80-90 words with natural additions
const pads = {
  'ayam-betutu': ' Disajikan sama sambal matah dan lawar, bikin makin lengkap.',
  'ayam-cincane': ' Biasa jadi hidangan utama di acara-acara besar dan perayaan keluarga.',
  'ayam-pop': ' Ayam yang lembut ini cocok banget buat yang nggak suka makanan terlalu kering atau gosong.',
  'ayam-taliwang': ' Sekarang udah banyak dijual di rumah makan Lombok di berbagai kota besar Indonesia.',
  'babi-guling': ' Kulitnya yang super renyah jadi bagian paling diburu sama penikmatnya.',
  'bebek-betutu': ' Makin enak dimakan sama nasi hangat dan sambal matah yang pedas.',
  'bika-ambon': ' Biasanya dijual dalam bentuk kotak-kotak dan jadi buruan wisatawan yang pulang dari Medan.',
  'bingka-barandam': ' Kue basah yang ringan ini cocok banget buat temen minum teh sore.',
  'bubur-ne': ' Cocok dimakan kapan aja, apalagi pas cuaca dingin.',
  'cakalang-fufu': ' Aroma asapnya yang khas bikin masakan ini beda dari olahan ikan lainnya.',
  'coto-makassar': ' Makannya sama ketupat atau burasa, ditambah sambal tauco yang gurih asin.',
  'dendeng-balado': ' Cocok banget buat lauk nasi hangat, apalagi kalo lagi kangen masakan Padang.',
  'es-pisang-ijo': ' Minuman legendaris yang nggak pernah lekang sama waktu, dari dulu sampe sekarang.',
  'gado-gado': ' Orang asing juga suka, sampe dijuluki Indonesian salad di luar negeri.',
  'gangan-asam': ' Cocok dimakan sama nasi hangat dan sambal terasi pas siang hari yang terik.',
  'gangan-habang': ' Makin enak dimakan sama nasi kuning Banjar yang gurih dan wangi.',
  'gohu-ikan': ' Wajib dicoba buat yang suka ikan mentah dan pengalaman rasa baru.',
  'gudeg': ' Makin enak dimakan sama nasi hangat, ayam bacem, telur, dan sambal goreng krecek.',
  'gulai-ikan': ' Gurihnya santan berpadu sama rempah bikin ketagihan.',
  'ikan-asar': ' Cara tradisional yang masih bertahan sampe sekarang di dapur-dapur rumah tangga.',
  'ikan-kuah-kuning': ' Cocok dicocol sama papeda, perpaduan rasa tawar dan gurih asem yang pas.',
  'ikan-woku': ' Wajib dicoba buat yang doyan masakan pedas dan kaya rempah.',
  'iwak-pakasam': ' Cara fermentasi tradisional yang bikin rasa ikan makin unik dan nagih.',
  'kapurung': ' Kenyalnya sagu berpadu sama kuah asem gurih, sensasi yang beda dari biasanya.',
  'ketupat-kandangan': ' Cara makannya yang pake tangan bikin rasanya makin mantap.',
  'kohu-kohu': ' Ikan asap yang gurih berpadu sama sayuran segar, cocok buat makan siang.',

  'konro': ' Iga empuk plus kuah hitam pekat yang kaya rempah, juara banget.',
  'kue-bagea': ' Teksturnya yang unik bikin nagih, apalagi sambil ngopi santai.',
  'lawar': ' Biasanya jadi pelengkap nasi campur Bali atau babi guling.',
  'mandai': ' Wajib dicoba kalo ke Kalimantan Selatan, pengalaman makan yang beda dari biasanya.',
  'mie-aceh': ' Pedas dan kaya rempah, cocok buat yang doyan makanan kuat rasa.',
  'nasi-campur': ' Setiap gigitan beda rasa, itulah yang bikin makan nasi campur Bali seru.',
  'nasi-goreng': ' Setiap orang punya versi favoritnya masing-masing, itulah keunikan nasi goreng.',
  'nasi-jinggo': ' Murah, enak, dan bikin kenyang, solusi lapar tengah malam yang pas.',
  'nasi-kuning-banjar': ' Sarapan yang bikin semangat sepanjang hari.',
  'nasi-kuning': ' Tumpeng nasi kuning selalu jadi pusat perhatian di setiap acara selamatan.',
  'nasi-lapola': ' Gurihnya kelapa berpadu sama kacang tolo bikin kenyang lebih lama.',
  'nasi-liwet': ' Makan nasi liwet beramai-ramai dari satu pincuk jadi tradisi yang seru banget.',
  'nasi-padang': ' Makan nasi Padang emang paling afdol kalo langsung di restoran dengan tradisi hidangnya.',
  'nasi-uduk': ' Makanan yang selalu bikin kangen buat yang udah lama tinggal di Jakarta.',
  'pallubasa': ' Aroma asap kelapa sangrainya yang khas bikin pallubasa beda dari sup lainnya.',
  'papeda': ' Unik, sederhana, tapi jadi makanan pokok yang mengenyangkan.',
  'pecel': ' Sederhana tapi kaya rasa dan gizi, makanya masih bertahan sampe sekarang.',
  'pempek': ' Paling enak dimakan pas masih anget-anget, teksturnya kenyal banget.',
  'pisang-ijo': ' Dulu makanan istimewa, sekarang bisa dinikmati kapan aja di berbagai tempat.',
  'plecing-kangkung': ' Kangkung yang krenyes ditambah sambal pedas, dijamin bikin nagih.',
  'rawon': ' Kuah hitamnya yang unik bikin penasaran, dicoba sekali pasti balik lagi.',
  'rendang': ' Nggak heran kalo rendang dinobatkan sebagai makanan terenak di dunia.',
  'sagu-lempeng': ' Dulu bekal penjelajah, sekarang jadi cemilan unik yang jarang ditemukan.',
  'sambal-colocolo': ' Segar, pedas, dan gurih, bikin nambah nasi terus.',
  'sate-babi': ' Yang suka daging babi pasti ngerti kenapa sate ini beda dari yang lain.',
  'sate-banjar': ' Saus merahnya yang khas bikin sate Banjar beda dari sate daerah lain.',
  'sate-lilit': ' Wangi serainya yang khas bikin sate lilit beda dari sate manapun.',
  'sate-padang': ' Setiap daerah punya versi masing-masing, semua enak dan beda.',
  'sop-saudara': ' Satu mangkuk sop saudara berisi banyak rasa dan tekstur yang beda-beda.',
  'soto-banjar': ' Hangat dan gurih, cocok buat sarapan pagi atau makan malam.',
  'soto-medan': ' Kuahnya yang kental dan kaya rempah bikin soto Medan beda dari soto lain.',
  'soto-betawi': ' Soto yang kaya sejarah dan rasa, wajib dicoba kalo ke Jakarta.',
  'tinutuan': ' Sehat, mengenyangkan, dan penuh sayuran, cocok buat yang lagi diet.',
  'tongseng': ' Pedas, manis, dan gurih berpadu dalam satu mangkuk tongseng yang hangat.',
};

const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));
files.forEach(file => {
  const filePath = path.join(foodsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const key = path.basename(file, '.json');
  if (data.story && pads[key]) {
    data.story.body += pads[key];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }
});

// Verification
console.log('Word counts:');
files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(foodsDir, file), 'utf-8'));
  const body = data.story?.body || '';
  const words = body.split(/\s+/).length;
  const hasEmDash = body.includes('\u2014') || body.includes('\u2013');
  const flag = words < 78 || words > 95 ? ' <<<' : '';
  const em = hasEmDash ? ' EM-DASH' : '';
  if (flag || em) console.log(`${data.name.padEnd(22)} ${words}w${flag}${em}`);
});
