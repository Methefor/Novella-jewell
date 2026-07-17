import { Config } from '@remotion/cli/config';

/**
 * Stüdyo, mağazanın public klasörünü doğrudan okur.
 *
 * Böylece ürün görselleri kopyalanmaz — staticFile('media/yuzuk/yuzuk-17.jpg')
 * dediğinde sitedeki gerçek dosyayı kullanır. Ürünü sitede güncellersen video
 * da güncel kalır, iki ayrı kopya tutup birbirinden ayrışmaz.
 */
Config.setPublicDir('../public');

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Reklam videoları için yüksek kalite; dosya boyutu Instagram için sorun değil.
Config.setCrf(18);
