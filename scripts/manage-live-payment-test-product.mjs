import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), false);

const PRODUCT_ID = 'presales-live-payment-test-v1';
const VARIANT_ID = 'v1';
const SLUG = 'novella-kontrollu-odeme-testi';
const PRICE = 50;
const SHIPPING = 49.9;

function usage() {
  console.error('Kullanim: node scripts/manage-live-payment-test-product.mjs --status|--create|--cleanup|--close-expired-first-session|--close-unpaid-reload-test --paytr-no-transaction-confirmed');
  process.exitCode = 2;
}

async function main() {
  const action = process.argv[2];
  if (!['--status', '--create', '--cleanup', '--close-expired-first-session', '--close-unpaid-reload-test'].includes(action)) return usage();
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

  const sql = neon(process.env.DATABASE_URL);
  if (action === '--close-unpaid-reload-test') {
    if (process.argv[3] !== '--paytr-no-transaction-confirmed') {
      throw new Error('PayTR panelinde NJ20260005 ve alici aramasinda tahsilat olmadigi dogrulanmali.');
    }
    // Exact controlled test only: no card was entered, and reopening its consumed
    // token showed PayTR's invalid-page message. This is NOT customer expiry logic.
    const [, changed] = await sql.transaction([
      sql.query('SELECT pg_advisory_xact_lock(71624, 1)'),
      sql.query(`WITH closed AS (
        UPDATE orders SET status='failed', fulfillment_status='cancelled', cancelled_at=now(), updated_at=now()
         WHERE order_no='NJ-2026-0005' AND status='pending' AND paid_at IS NULL
           AND total=99.90 AND checkout_reserved=true
           AND date_trunc('milliseconds', payment_ready_at)='2026-09-02T00:36:38.218Z'::timestamptz
           AND jsonb_array_length(items)=1 AND items->0->>'productId'=$1
           AND (items->0->>'adet')::integer=1
         RETURNING id, order_no, status
      ), recorded AS (
        INSERT INTO order_events (order_id,event_type,from_value,to_value,note,created_by)
        SELECT id,'payment_test_closed','pending','failed',
          'Kontrollu yenileme testi: kart bilgisi girilmedi. Ayni token yeniden acilinca PayTR gecersiz odeme sayfasi gosterdi. Panelde siparis ve alici aramasinda tahsilat bulunmadi. Test rezervasyonu kaldirildi.',
          'codex-presales-check'
        FROM closed RETURNING order_id
      ) SELECT order_no,status FROM closed WHERE id IN (SELECT order_id FROM recorded)`, [PRODUCT_ID]),
    ]);
    if (changed.length !== 1) throw new Error('Kontrollu test kaydi beklenen durumda degil; kayit degistirilmedi.');
    console.log(JSON.stringify({ ok: true, order: changed[0], inventoryChanged: false }, null, 2));
    return;
  }
  if (action === '--close-expired-first-session') {
    if (process.argv[3] !== '--paytr-no-transaction-confirmed') {
      throw new Error('PayTR panelinde siparis ve alici aramasinda tahsilat olmadigi once dogrulanmali.');
    }
    // One-off reconciliation for the known, abandoned test iframe. Never expire
    // ordinary customer sessions based only on age or an absent callback.
    const [, changed] = await sql.transaction([
      sql.query('SELECT pg_advisory_xact_lock(71624, 1)'),
      sql.query(`WITH closed AS (
        UPDATE orders SET status='failed', fulfillment_status='cancelled', cancelled_at=now(), updated_at=now()
         WHERE order_no='NJ-2026-0003' AND status='pending' AND paid_at IS NULL
           AND total=99.90 AND checkout_reserved=true
           AND payment_ready_at < now() - interval '31 minutes'
           AND jsonb_array_length(items)=1
           AND items->0->>'productId'=$1
           AND (items->0->>'adet')::integer=1
         RETURNING id, order_no, status
      ), recorded AS (
        INSERT INTO order_events (order_id,event_type,from_value,to_value,note,created_by)
        SELECT id,'payment_expired','pending','failed',
          'Kontrollu test: 30 dakikalik PayTR oturumu doldu. PayTR panelinde siparis numarasi ve alici e-postasi ile tahsilat bulunmadigi dogrulandi. Stok rezervasyonu serbest birakildi.',
          'codex-presales-check'
        FROM closed RETURNING order_id
      ) SELECT order_no,status FROM closed WHERE id IN (SELECT order_id FROM recorded)`, [PRODUCT_ID]),
    ]);
    if (changed.length !== 1) throw new Error('Oturum henuz sona ermemis veya siparis durumu degismis; hicbir kayit degistirilmedi.');
    console.log(JSON.stringify({ ok: true, order: changed[0], inventoryChanged: false }, null, 2));
    return;
  }
  if (action === '--status') {
    const [productRows, inventoryRows, orderRows] = await sql.transaction([
      sql.query(
        `select id, slug, published, data->>'name' as name,
                coalesce((data->>'hidden')::boolean, false) as hidden,
                data->>'deletedAt' as deleted_at,
                (data->>'price')::numeric as price
           from catalog_products where id = $1`,
        [PRODUCT_ID]
      ),
      sql.query(
        `select stock from inventory where product_id = $1 and variant_id = $2`,
        [PRODUCT_ID, VARIANT_ID]
      ),
      sql.query(
        `select order_no, status, total, fulfillment_status, refund_status, refund_amount,
                checkout_reserved, payment_ready_at is not null as payment_ready, payment_ready_at,
                legal_acceptance is not null as legal_acceptance_saved, paid_at, created_at
           from orders
          where exists (
            select 1 from jsonb_array_elements(items) item
             where item->>'productId' = $1
          )
          order by created_at desc`,
        [PRODUCT_ID]
      ),
    ], { readOnly: true });

    console.log(JSON.stringify({
      product: productRows[0] ?? null,
      inventory: inventoryRows[0] ?? null,
      orders: orderRows,
      expectedCharge: PRICE + SHIPPING,
      writes: false,
    }, null, 2));
    return;
  }

  if (action === '--create') {
    const now = new Date().toISOString();
    const product = {
      id: PRODUCT_ID,
      name: 'NOVELLA Kontrollü Ödeme Testi',
      slug: SLUG,
      description: 'Satış öncesi gerçek ödeme, sipariş e-postası ve tam iade akışını kontrollü olarak doğrulamak için kullanılan gizli test ürünüdür.',
      collection: 'klasikler',
      story: 'Müşterilere gösterilmez; yalnızca NOVELLA satış öncesi doğrulamasında kullanılır.',
      category: 'yuzuk',
      price: PRICE,
      variants: [{
        id: VARIANT_ID,
        color: 'gumus',
        material: 'celik',
        stock: 1,
        images: ['/icon-512x512.png'],
      }],
      defaultVariant: VARIANT_ID,
      images: ['/icon-512x512.png'],
      features: ['Kontrollü canlı ödeme testi', 'Müşterilere görünmez'],
      material: 'celik',
      isNew: false,
      isBestSeller: false,
      isCustomizable: false,
      hidden: true,
      createdAt: now,
      updatedAt: now,
    };

    const [existing] = await sql.query(
      `select id from catalog_products where id = $1 or slug = $2`,
      [PRODUCT_ID, SLUG]
    );
    if (existing && existing.id !== PRODUCT_ID) {
      throw new Error('Test urunu slug degeri baska bir urun tarafindan kullaniliyor.');
    }
    if (existing) {
      throw new Error('Test urunu zaten mevcut. Stogu sifirlamadan once --status ile mevcut testi kontrol edin.');
    }

    await sql.transaction([
      sql.query(
        `insert into catalog_products (id, slug, data, published)
         values ($1, $2, $3::jsonb, true)`,
        [PRODUCT_ID, SLUG, JSON.stringify(product)]
      ),
      sql.query(
        `insert into inventory (product_id, variant_id, stock, low_stock_threshold)
         values ($1, $2, 1, 1)`,
        [PRODUCT_ID, VARIANT_ID]
      ),
      sql.query(
        `insert into stock_movements
           (product_id, variant_id, delta, previous_stock, new_stock, source, reason, reference, created_by)
         values ($1, $2, 1, 0, 1, 'presales_test', 'Kontrollu canli odeme testi icin stok hazirlandi', $3, 'codex-presales-check')`,
        [PRODUCT_ID, VARIANT_ID, SLUG]
      ),
    ]);

    console.log(JSON.stringify({
      ok: true,
      hidden: true,
      productUrl: `https://novellajewell.com/urun/${SLUG}`,
      itemPrice: PRICE,
      shipping: SHIPPING,
      expectedCharge: PRICE + SHIPPING,
    }, null, 2));
    return;
  }

  const pending = await sql.query(
    `select order_no from orders
      where status = 'pending'
        and exists (
          select 1 from jsonb_array_elements(items) item
           where item->>'productId' = $1
        )
      limit 1`,
    [PRODUCT_ID]
  );
  if (pending[0]) {
    throw new Error(`Bekleyen test siparisi temizlenmeden urun kapatilamaz: ${pending[0].order_no}`);
  }

  const deletedAt = new Date().toISOString();
  await sql.transaction([
    sql.query(
      `update catalog_products
          set published = false,
              data = jsonb_set(jsonb_set(data, '{hidden}', 'true'::jsonb), '{deletedAt}', to_jsonb($2::text)),
              updated_at = now()
        where id = $1`,
      [PRODUCT_ID, deletedAt]
    ),
    sql.query(
      `update inventory set stock = 0, updated_at = now()
        where product_id = $1 and variant_id = $2`,
      [PRODUCT_ID, VARIANT_ID]
    ),
  ]);
  console.log(JSON.stringify({ ok: true, published: false, hidden: true, deletedAt }, null, 2));
}

main().catch((error) => {
  console.error(`FAIL: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exitCode = 1;
});
