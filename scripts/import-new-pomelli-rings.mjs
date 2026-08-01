import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'node:crypto';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseEnv } from 'node:util';

const envFileIndex = process.argv.indexOf('--import-env-file');
if (envFileIndex !== -1 && process.argv[envFileIndex + 1]) {
  Object.assign(
    process.env,
    parseEnv(readFileSync(process.argv[envFileIndex + 1], 'utf8'))
  );
}

const sourceRoot = path.resolve('pomelli/inceleme-yeni');
const sql = neon(process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL eksik.');
const importUploadUrl = process.env.IMPORT_UPLOAD_URL;
if (!importUploadUrl && !process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL_OIDC_TOKEN) {
  throw new Error('Blob kimliği veya IMPORT_UPLOAD_URL gerekli.');
}

const coreFeatures = [
  '316L paslanmaz çelik',
  'Suya dayanıklı',
  'Kararmaya karşı dirençli',
  'Günlük kullanıma uygun',
];

const products = [
  {
    set: 'set-01', name: 'Paris Éternité Çift Halka Taşlı Yüzük', slug: 'paris-eternite-cift-halka-tasli-yuzuk', collection: 'paris', color: 'gumus', material: 'celik',
    story: 'İki ışık halkası, zamansız bir bağda buluşur.',
    description: 'Birbirine geçen iki taşlı halkayı zarif bir gümüş tonunda buluşturan Paris Éternité, klasik ışıltıyı modern bir formda taşır. Dengeli hacmi sayesinde tek başına güçlü görünür; sade yüzüklerle birlikte kullanıldığında katmanlı ve rafine bir stil yaratır.',
    features: ['Çift halka formu', 'Taşlı yüzey', 'Zamansız tasarım'],
  },
  {
    set: 'set-02', name: 'Stockholm Halo Oval Taşlı Yüzük', slug: 'stockholm-halo-oval-tasli-yuzuk', collection: 'stockholm', color: 'gumus', material: 'celik',
    story: 'Kesintisiz bir çizgi, ışığı çevresinde toplar.',
    description: 'Oval merkez formunu taşlı bir çerçeveyle belirginleştiren Stockholm Halo, kuzey tasarımının sade çizgilerini zarif bir ışıltıyla tamamlar. Açık ve dengeli silueti günlük kombinlere modern bir vurgu ekler.',
    features: ['Oval halo formu', 'Taşlı çerçeve', 'Modern açık tasarım'],
  },
  {
    set: 'set-03', name: 'Barcelona Vela Geometrik Taşlı Yüzük', slug: 'barcelona-vela-geometrik-tasli-yuzuk', collection: 'barcelona', color: 'gumus', material: 'celik',
    story: 'Keskin bir çizgi, Akdeniz ışığında yumuşar.',
    description: 'Geometrik uçları ve taşlı yüzeyiyle dikkat çeken Barcelona Vela, mimari çizgileri feminen bir parlaklıkla dengeler. Belirgin formu sayesinde minimal kombinlerin güçlü odak noktasına dönüşür.',
    features: ['Geometrik açık form', 'Taşlı yüzey', 'Mimari görünüm'],
  },
  {
    set: 'set-04', name: 'Paris Lumière Beş Taş Yüzük', slug: 'paris-lumiere-bes-tas-yuzuk', collection: 'paris', color: 'gumus', material: 'celik',
    story: 'Beş ayrı ışık, tek bir zarafette birleşir.',
    description: 'Sıralı taş görünümünü ince ve zarif bir bantla tamamlayan Paris Lumière, klasik beş taş stilini günlük kullanıma uyarlayan rafine bir parçadır. Tek başına romantik, ince yüzüklerle birlikte daha modern görünür.',
    features: ['Beş taş görünümü', 'İnce bant', 'Zarif sıra tasarım'],
  },
  {
    set: 'set-05', name: 'Stockholm Flora Yaprak Taşlı Yüzük', slug: 'stockholm-flora-yaprak-tasli-yuzuk', collection: 'stockholm', color: 'gumus', material: 'celik',
    story: 'Doğanın hafifliği, gümüş bir çizgide kalır.',
    description: 'Yaprakları andıran taşlı kıvrımlarıyla Stockholm Flora, organik formları sade bir kuzey estetiğiyle yorumlar. Hafif ve akışkan görünümü, günlük stile doğal bir ışıltı ekler.',
    features: ['Yaprak motifli form', 'Taşlı kıvrımlar', 'Organik tasarım'],
  },
  {
    set: 'set-06', name: 'Barcelona Carré Kare Taşlı Yüzük', slug: 'barcelona-carre-kare-tasli-yuzuk', collection: 'barcelona', color: 'gumus', material: 'celik',
    story: 'Net bir form, ışığı tek noktada toplar.',
    description: 'Kare taşlı merkezini güçlü ve dengeli bir gövdeyle birleştiren Barcelona Carré, klasik tektaş görünümüne mimari bir karakter kazandırır. Belirgin silueti özel anlarda olduğu kadar sade günlük kombinlerde de etkileyicidir.',
    features: ['Kare taşlı merkez', 'Belirgin gövde', 'Mimari tektaş görünümü'],
  },
  {
    set: 'set-07', name: 'Stockholm Linea Baget Taşlı Yüzük', slug: 'stockholm-linea-baget-tasli-yuzuk', collection: 'stockholm', color: 'gumus', material: 'celik',
    story: 'Işık, sade bir çizgide yönünü bulur.',
    description: 'Baget taş görünümünü temiz çizgiler ve dengeli bir bantla buluşturan Stockholm Linea, modern sadeliğin güçlü bir yorumudur. Geniş yüzeyi tek başına tamamlanmış bir görünüm sunar.',
    features: ['Baget taş görünümü', 'Geniş bant', 'Minimal geometrik tasarım'],
  },
  {
    set: 'set-08', name: 'Paris Crystal Kare Tektaş Yüzük', slug: 'paris-crystal-kare-tektas-yuzuk', collection: 'paris', color: 'gumus', material: 'celik',
    story: 'Tek bir taş, bütün bakışları üzerinde toplar.',
    description: 'Kare kesim merkez taşı ince taşlı detaylarla tamamlayan Paris Crystal, klasik tektaş zarafetini çağdaş bir siluetle yeniden yorumlar. Net hatları sayesinde hem romantik hem modern kombinlere kolayca uyum sağlar.',
    features: ['Kare kesim merkez taş', 'İnce taşlı detaylar', 'Modern tektaş formu'],
  },
  {
    set: 'set-09', name: 'Barcelona Rivière Çok Sıralı Yüzük', slug: 'barcelona-riviere-cok-sirali-yuzuk', collection: 'barcelona', color: 'gumus', material: 'celik',
    story: 'Paralel ışık çizgileri, aynı ritimde akar.',
    description: 'Birden fazla taşlı sırayı güçlü bir bant formunda buluşturan Barcelona Rivière, katmanlı yüzük görünümünü tek parçada sunar. Işıltılı yüzeyi gece stilinde iddialı, sade kombinlerde dengeli bir vurgu yaratır.',
    features: ['Çok sıralı tasarım', 'Taşlı bantlar', 'Katmanlı görünüm'],
  },
  {
    set: 'set-10', name: 'Paris Serene Oval Taşlı Yüzük', slug: 'paris-serene-oval-tasli-yuzuk', collection: 'paris', color: 'gumus', material: 'celik',
    story: 'Yumuşak bir kıvrım, ışığı sessizce taşır.',
    description: 'Oval taşlı merkezini akışkan çizgilerle çevreleyen Paris Serene, zarif hareketi ve dengeli ışıltısıyla dikkat çeker. Feminen formu günlük kullanıma kolayca uyum sağlarken tek başına yeterince belirgin görünür.',
    features: ['Oval taşlı merkez', 'Akışkan form', 'Zarif açık tasarım'],
  },
  {
    set: 'set-11', name: 'Stockholm Papillon Kelebek Yüzük', slug: 'stockholm-papillon-kelebek-yuzuk', collection: 'stockholm', color: 'gumus', material: 'celik',
    story: 'Hafif bir kanat hareketi, ışığa dönüşür.',
    description: 'Taşlı kelebek uçlarını açık bir bant üzerinde buluşturan Stockholm Papillon, romantik sembolizmi temiz ve modern çizgilerle dengeler. Hafif görünümü günlük stile zarif bir hareket katar.',
    features: ['Kelebek motifli uçlar', 'Açık bant formu', 'Taşlı detaylar'],
  },
  {
    set: 'set-12', name: 'Paris Duo Kelebek Taşlı Yüzük', slug: 'paris-duo-kelebek-tasli-yuzuk', collection: 'paris', color: 'gumus', material: 'celik',
    story: 'İki kelebek, aynı ışığın çevresinde buluşur.',
    description: 'Karşılıklı iki kelebek motifini taşlı bir kompozisyonda birleştiren Paris Duo, romantik ve dikkat çekici bir siluet sunar. Açık formu sayesinde güçlü görünümünü hafif bir dengeyle tamamlar.',
    features: ['Çift kelebek motifi', 'Taşlı merkez detayları', 'Açık form'],
  },
  {
    set: 'set-13', name: 'Barcelona Fleur Çiçek Taşlı Yüzük', slug: 'barcelona-fleur-cicek-tasli-yuzuk', collection: 'barcelona', color: 'gumus', material: 'celik',
    story: 'Bir çiçek açar, ışık bütün yapraklara yayılır.',
    description: 'Çiçek formundaki taşlı merkezini ince bir bantla dengeleyen Barcelona Fleur, feminen görünümü modern bir sadelikle tamamlar. Zarif boyutu sayesinde günlük kullanımda romantik bir vurgu sunar.',
    features: ['Çiçek motifli merkez', 'Taşlı yapraklar', 'İnce bant'],
  },
  {
    set: 'set-14', name: 'Stockholm Layer Çok Sıralı Taşlı Yüzük', slug: 'stockholm-layer-cok-sirali-tasli-yuzuk', collection: 'stockholm', color: 'gumus', material: 'celik',
    story: 'Farklı çizgiler, tek bir dengede birleşir.',
    description: 'Parlak ve taşlı bantları katmanlı bir düzende buluşturan Stockholm Layer, birden fazla yüzük takılmış etkisini tek parçada yaratır. Temiz geometrisi güçlü görünümünü rafine bir çizgide tutar.',
    features: ['Katmanlı bantlar', 'Taşlı ve parlak yüzeyler', 'Çok sıralı form'],
  },
  {
    set: 'set-15', name: 'Barcelona Élan Fiyonk Taşlı Yüzük', slug: 'barcelona-elan-fiyonk-tasli-yuzuk', collection: 'barcelona', color: 'gumus', material: 'celik',
    story: 'Bir düğüm, zarafeti hareket halinde tutar.',
    description: 'Fiyonk ve kanat çizgilerini çağrıştıran taşlı formuyla Barcelona Élan, enerjik ve feminen bir görünüm sunar. Heykelsi merkezi sade kıyafetlere karakterli bir ışıltı ekler.',
    features: ['Fiyonk esintili form', 'Taşlı merkez', 'Heykelsi tasarım'],
  },
  {
    set: 'set-16', name: 'Paris Cœur Kalp Taşlı Yüzük', slug: 'paris-coeur-kalp-tasli-yuzuk', collection: 'paris', color: 'gumus', material: 'celik',
    story: 'Kalbin çizgisi, sade bir ışıkla tamamlanır.',
    description: 'Kalp formunu taşlı ve parlak çizgilerle yorumlayan Paris Cœur, romantik sembolizmi modern bir açık tasarımda buluşturur. Zarif görünümü günlük kombinlere sıcak ve anlamlı bir detay katar.',
    features: ['Kalp motifli form', 'Taşlı çizgi', 'Romantik açık tasarım'],
  },
  {
    set: 'set-17', name: 'Barcelona Stella Altın Taşlı Yüzük', slug: 'barcelona-stella-altin-tasli-yuzuk', collection: 'barcelona', color: 'altin', material: 'altin-kaplama',
    story: 'Altın bir yıldız, ışığı merkezinden yayar.',
    description: 'Yıldız ve çiçek etkisini bir araya getiren taşlı merkeziyle Barcelona Stella, sıcak altın tonunu güçlü bir odak noktasına dönüştürür. Açık gövdesi hacimli görünümü dengeler ve stile modern bir parlaklık ekler.',
    features: ['Yıldız esintili merkez', 'Taşlı detaylar', 'Altın tonlu açık form'],
  },
  {
    set: 'set-18', name: 'Stockholm Leaf Altın Yaprak Yüzük', slug: 'stockholm-leaf-altin-yaprak-yuzuk', collection: 'stockholm', color: 'altin', material: 'altin-kaplama',
    story: 'İki altın yaprak, sade bir dengede buluşur.',
    description: 'Karşılıklı yaprak uçlarını akışkan bir açık bantta buluşturan Stockholm Leaf, doğadan gelen formu minimal bir altın çizgiyle yorumlar. Sade silueti hem tek başına hem katmanlı kullanım için uygundur.',
    features: ['Çift yaprak formu', 'Açık bant', 'Minimal altın görünüm'],
  },
  {
    set: 'set-19', name: 'Paris Cascade Altın Çok Sıralı Yüzük', slug: 'paris-cascade-altin-cok-sirali-yuzuk', collection: 'paris', color: 'altin', material: 'altin-kaplama',
    story: 'Altın çizgiler, ışığı katman katman taşır.',
    description: 'Parlak ve taşlı altın bantları akışkan bir kompozisyonda birleştiren Paris Cascade, katmanlı yüzük stilini tek parçada sunar. Modern hacmi sayesinde sade kombinlerde güçlü ve zarif bir odak oluşturur.',
    features: ['Çok sıralı altın bantlar', 'Taşlı çizgi detayları', 'Katmanlı açık form'],
  },
];

const existing = await sql.query(
  'select slug from catalog_products where slug = any($1::text[])',
  [products.map((product) => product.slug)]
);
const existingSlugs = new Set(existing.map((row) => row.slug));
const pending = products.filter((product) => !existingSlugs.has(product.slug));

if (!pending.length) {
  console.log('Tüm ürünler daha önce içe aktarılmış.');
  process.exit(0);
}

async function uploadProduct(product) {
  const setPath = path.join(sourceRoot, product.set);
  const files = (await readdir(setPath))
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  if (files.length < 3) throw new Error(`${product.set}: en az üç görsel gerekli.`);

  const labels = ['flatlay', 'elde', 'model', 'editorial'];
  const urls = [];
  for (let index = 0; index < files.length; index += 1) {
    const bytes = await readFile(path.join(setPath, files[index]));
    const pathname = `products/${product.slug}/${String(index + 1).padStart(2, '0')}-${labels[index] ?? 'detail'}.png`;
    if (importUploadUrl) {
      const form = new FormData();
      form.set('file', new Blob([bytes], { type: 'image/png' }), path.basename(files[index]));
      form.set('pathname', pathname);
      const key = createHash('sha256')
        .update(`${process.env.DATABASE_URL}:pomelli-import-v1`)
        .digest('hex');
      const response = await fetch(importUploadUrl, {
        method: 'POST',
        headers: { 'x-import-key': key },
        body: form,
      });
      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(`${product.set}/${files[index]} yüklenemedi: ${result.error ?? response.status}`);
      }
      urls.push(result.url);
    } else {
      const uploadOptions = {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/png',
      };
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        uploadOptions.token = process.env.BLOB_READ_WRITE_TOKEN;
      }
      const blob = await put(pathname, bytes, uploadOptions);
      urls.push(blob.url);
    }
  }
  return urls;
}

for (const product of pending) {
  console.log(`Yükleniyor: ${product.set} / ${product.name}`);
  const images = await uploadProduct(product);
  const id = `product-${randomUUID()}`;
  const now = new Date().toISOString();
  const data = {
    id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: 'yuzuk',
    collection: product.collection,
    story: product.story,
    price: 0,
    variants: [{
      id: 'v1',
      color: product.color,
      material: product.material,
      stock: 0,
      images,
    }],
    defaultVariant: 'v1',
    images,
    features: [...new Set([...coreFeatures, ...product.features])],
    material: product.material,
    isNew: true,
    isBestSeller: false,
    isCustomizable: false,
    adChecklist: {
      visualMatchApproved: false,
      copyApproved: false,
      priceStockApproved: false,
      landingPageApproved: false,
    },
    createdAt: now,
    updatedAt: now,
  };

  await sql.query(
    'insert into catalog_products (id, slug, data, published) values ($1, $2, $3::jsonb, false)',
    [id, product.slug, JSON.stringify(data)]
  );
  await sql.query(
    'insert into inventory (product_id, variant_id, stock) values ($1, $2, 0) on conflict (product_id, variant_id) do nothing',
    [id, 'v1']
  );
  console.log(`Taslak oluşturuldu: ${product.slug} (${images.length} görsel)`);
}

console.log(`${pending.length} yeni ürün taslak olarak içe aktarıldı.`);
