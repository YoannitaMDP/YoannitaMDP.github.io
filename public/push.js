var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BIYOb_yEwjx1_pIbFCmrQzEvfL71mw0gfIGZmLQQeYVmGGjXgyiSSv2fR9oXqTT8Owa8N0dq_J0bBcm8EKQ26XM",
    "privateKey": "QQQjbrpqt-rzLGamp4nc5CiFNZyN2UVNn8hFSQ_fl5c"
};


webPush.setVapidDetails(
    'mailto:rahasia@mdp.ac.id',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/eysqj17KPPI:APA91bEzQ1eEzIbSkHGSeGl5Pv4E9L3xrrr7XNpAwCBrgRcbYDijJjyEZRFoXRdTgw88xANV7jV3EDzBXCuKbS9-lBSWL5C8zHHvP4f2-5zbyuHrMVgxnDtOoibrc43prvHBlKAoZY4l",
    "keys": {
        "p256dh": "BApHfsan17eiQ5LpB6tP+X23jgmmuPuc/TMJdNdsAdhho++cTfzTW9p6FSQz4PHbMeOgBe4FOZXdzZ9tS6Wc3+k=",
        "auth": "KFloLKOdGcFr/dL+PkKPWw=="
    }
};

var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '118431922855',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);