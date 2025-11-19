document.addEventListener('DOMContentLoaded', () => {
    const wifiForm = document.getElementById('wifi-form');
    const qrCodeContainer = document.getElementById('qrcode');

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

        // 一時的なコンテナでQRコードを生成
        const tempContainer = document.createElement('div');
        new QRCode(tempContainer, {
            text: wifiString,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // canvasの生成を少し待つ
        setTimeout(() => {
            const qrCanvas = tempContainer.querySelector('canvas');
            if (!qrCanvas) return;

            const ssidText = ssid;
            const textHeight = 30; // SSIDテキスト用の高さ
            const fontSize = 20;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = qrCanvas.width;
            finalCanvas.height = qrCanvas.height + textHeight;
            const ctx = finalCanvas.getContext('2d');

            // 背景を白で塗りつぶす
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            // SSIDテキストを描画
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            // テキストを垂直方向中央に配置するための微調整
            const textY = textHeight - (textHeight - fontSize) / 2 - 2;
            ctx.fillText(ssidText, finalCanvas.width / 2, textY);

            // QRコードを描画
            ctx.drawImage(qrCanvas, 0, textHeight);

            // 最終的なcanvasを表示
            qrCodeContainer.appendChild(finalCanvas);
        }, 50); // 50ミリ秒の遅延
    });
});
