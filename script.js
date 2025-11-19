document.addEventListener('DOMContentLoaded', () => {
    const wifiForm = document.getElementById('wifi-form');
    const qrCodeContainer = document.getElementById('qrcode');
    let qrcode = null;

    wifiForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const ssid = document.getElementById('ssid').value;
        const password = document.getElementById('password').value;
        const isHidden = document.getElementById('hidden').checked;
        const authType = 'WPA'; // 認証タイプはWPAで固定

        // 特殊文字をエスケープ
        const escape = (str) => {
            return str.replace(/([\\;,\"])/g, '\\$1');
        };

        const wifiString = `WIFI:T:${authType};S:${escape(ssid)};P:${escape(password)};H:${isHidden};;`;

        // 既存のQRコードをクリア
        qrCodeContainer.innerHTML = '';

        // 新しいQRコードを生成
        qrcode = new QRCode(qrCodeContainer, {
            text: wifiString,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    });
});
