import { mkdir, writeFile } from 'node:fs/promises';

const paths = ['/event/*', '/carpool/*', '/food-bank/*', '/s/*'];
const directory = new URL('../dist/.well-known/', import.meta.url);
const androidCertificates = process.env.PUBLIC_ANDROID_SHA256_CERT_FINGERPRINTS;
const iosAppId = process.env.PUBLIC_IOS_APP_ID;
if (androidCertificates || iosAppId) await mkdir(directory, { recursive: true });

if (androidCertificates) {
  const fingerprints = androidCertificates.split(',').map((value) => value.trim().toUpperCase());
  if (fingerprints.some((value) => !/^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/.test(value))) throw new Error('PUBLIC_ANDROID_SHA256_CERT_FINGERPRINTS must contain release certificate SHA-256 fingerprints.');
  await writeFile(new URL('assetlinks.json', directory), JSON.stringify([{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: { namespace: 'android_app', package_name: process.env.PUBLIC_ANDROID_PACKAGE || 'com.gathergo.dev', sha256_cert_fingerprints: fingerprints },
  }], null, 2));
}
if (iosAppId) {
  if (!/^[A-Z0-9]{10}\.[A-Za-z0-9.-]+$/.test(iosAppId)) throw new Error('PUBLIC_IOS_APP_ID must be the Apple team ID and bundle identifier, separated by a dot.');
  await writeFile(new URL('apple-app-site-association', directory), JSON.stringify({ applinks: { details: [{ appIDs: [iosAppId], components: paths.map((path) => ({ '/': path })) }] } }, null, 2));
}
