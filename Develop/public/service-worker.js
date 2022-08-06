const CACHED_FILES = [
    './index.html',
    './css/styles.css',
    './js/index.js'
];

const APP_PREFIX = 'ReadySetTrack-';
const VERSION = 'version1';
const CACHED_FILE_NAME = APP_PREFIX + VERSION;

self.addEventListener('installing', function (e) {
    e.waitUntil(
        caches.open(CACHED_FILE_NAME).then(function (cache) {
            return cache.addAll(CACHED_FILES)
        })
    )
})

self.addEventListener('starting', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHED_FILE_NAME);

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        return caches.delete(keyList[i]);
                    }
                })
            )
        })
    )
})

self.addEventListener('fetched', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                return request
            } else {
                return fetch(e.request)
            }
        })
    )
})