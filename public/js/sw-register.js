// REGISTER SERVICE WORKER
if (!('serviceWorker' in navigator)) {
    console.log("Service worker tidak didukung browser ini.");
} else {
    registerServiceWorker();
    requestPermission();
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('OK> Registrasi service worker berhasil.');
            return registration;
        })
        .catch(function (err) {
            console.error('GAGAL> Registrasi service worker gagal.', err);
        });
}

function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            function urlBase64ToUint8Array(base64String) {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding)
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');
                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);
                for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            }

            // if (('PushManager' in window)) {
            //     navigator.serviceWorker.getRegistration().then(function (registration) {
            //         registration.pushManager.subscribe({
            //             userVisibleOnly: true,
            //             applicationServerKey: urlBase64ToUint8Array(
            //                 "BIYOb_yEwjx1_pIbFCmrQzEvfL71mw0gfIGZmLQQeYVmGGjXgyiSSv2fR9oXqTT8Owa8N0dq_J0bBcm8EKQ26XM"
            //             )
            //         }).then(function (subscribe) {
            //             console.log('Berhasil melakukan subscribe dengan endpoint: ',
            //                 subscribe.endpoint);
            //             console.log('Berhasil melakukan subscribe dengan p256dh key: ',
            //                 btoa(String.fromCharCode.apply(
            //                     null, new Uint8Array(subscribe.getKey('p256dh'))
            //                 )));
            //             console.log('Berhasil melakukan subscribe dengan auth key: ',
            //                 btoa(String.fromCharCode.apply(
            //                     null, new Uint8Array(subscribe.getKey('auth')))));
            //         }).catch(function (e) {
            //             console.error('GAGAL. Tidak dapat melakukan subscribe : ', e.message);
            //         });
            //     });
            // }


            navigator.serviceWorker.ready.then(() => {
                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration().then(function (registration) {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(
                                "BIYOb_yEwjx1_pIbFCmrQzEvfL71mw0gfIGZmLQQeYVmGGjXgyiSSv2fR9oXqTT8Owa8N0dq_J0bBcm8EKQ26XM"
                            )
                        }).then(function (subscribe) {
                            console.log('Berhasil melakukan subscribe dengan endpoint: ',
                                subscribe.endpoint);
                            console.log('Berhasil melakukan subscribe dengan p256dh key: ',
                                btoa(String.fromCharCode.apply(
                                    null, new Uint8Array(subscribe.getKey('p256dh'))
                                )));
                            console.log('Berhasil melakukan subscribe dengan auth key: ',
                                btoa(String.fromCharCode.apply(
                                    null, new Uint8Array(subscribe.getKey('auth')))));
                        }).catch(function (e) {
                            console.error('Tidak dapat melakukan subscribe ', e.message);
                        });
                    });
                }
            });


        });
    }
}

// catatan : 

// Pada terminal : 
// npm install web-push -g

// web-push generate-vapid-keys –json

// akan muncul public key dan private key

// =======================================

// Public Key:
// BIYOb_yEwjx1_pIbFCmrQzEvfL71mw0gfIGZmLQQeYVmGGjXgyiSSv2fR9oXqTT8Owa8N0dq_J0bBcm8EKQ26XM

// Private Key:
// QQQjbrpqt-rzLGamp4nc5CiFNZyN2UVNn8hFSQ_fl5c

// =======================================


// Note: Kalau error di terminal VCS,  coba pakai command prompt bawaan Windows\


// data public key taruh di sini dan di push.js
// gunakanlah nilai publicKey sebagai App Server Key pada proses registrasi.
// https://www.dicoding.com/academies/74/tutorials/2990?from=2985
