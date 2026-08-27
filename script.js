document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const qrForm = document.getElementById('qr-form');
    const qrCodeResultContainer = document.getElementById('qrcode-container');
    const qrCodeDiv = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');
    const wifiAuthSelect = document.getElementById('wifi-auth');
    const wifiPasswordInput = document.getElementById('wifi-password');

    let currentType = 'url';
    let currentCanvas = null;
    let toastTimeout = null;

    // タブ必須項目のマッピング
    const requiredInputs = {
        url: ['url-input'],
        text: ['text-input'],
        wifi: ['wifi-ssid'],
        email: ['email-to'],
        phone: ['phone-number'],
        vcard: ['vcard-lastname']
    };

    // タブ切り替え時のrequired属性更新
    const updateRequiredAttributes = (activeType) => {
        // すべての入力から一旦requiredを解除
        Object.values(requiredInputs).flat().forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = false;
        });

        // アクティブなタブの必須項目のみrequiredを設定
        const activeFields = requiredInputs[activeType] || [];
        activeFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = true;
        });
    };

    // タブ切り替え処理
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetType = btn.getAttribute('data-type');
            if (targetType === currentType) return;

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(`content-${targetType}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            currentType = targetType;
            updateRequiredAttributes(currentType);
        });
    });

    // 初期状態のrequired設定
    updateRequiredAttributes(currentType);

    // Wi-Fiの暗号化方式選択に応じたパスワード入力制御
    wifiAuthSelect.addEventListener('change', () => {
        if (wifiAuthSelect.value === 'nopass') {
            wifiPasswordInput.value = '';
            wifiPasswordInput.disabled = true;
            wifiPasswordInput.placeholder = '暗号化なしのため不要です';
        } else {
            wifiPasswordInput.disabled = false;
            wifiPasswordInput.placeholder = 'Wi-Fiパスワード';
        }
    });

    // 特殊文字エスケープ (Wi-Fi用)
    const escapeWifi = (str) => {
        return str.replace(/([\\;,:\"])/g, '\\$1');
    };

    // 各タイプのデータとラベル生成
    const generateQRData = () => {
        let qrText = '';
        let labelText = '';

        switch (currentType) {
            case 'url': {
                let url = document.getElementById('url-input').value.trim();
                if (url && !/^https?:\/\//i.test(url) && !/^ftp:\/\//i.test(url)) {
                    url = 'https://' + url;
                }
                qrText = url;
                labelText = document.getElementById('url-label').value.trim();
                break;
            }
            case 'text': {
                qrText = document.getElementById('text-input').value;
                labelText = document.getElementById('text-label').value.trim();
                break;
            }
            case 'wifi': {
                const ssid = document.getElementById('wifi-ssid').value.trim();
                const password = document.getElementById('wifi-password').value;
                const authType = wifiAuthSelect.value;
                const isHidden = document.getElementById('wifi-hidden').checked;

                if (authType === 'nopass') {
                    qrText = `WIFI:T:nopass;S:${escapeWifi(ssid)};H:${isHidden};;`;
                } else {
                    qrText = `WIFI:T:${authType};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${isHidden};;`;
                }
                labelText = document.getElementById('wifi-label').value.trim() || ssid;
                break;
            }
            case 'email': {
                const to = document.getElementById('email-to').value.trim();
                const subject = document.getElementById('email-subject').value.trim();
                const body = document.getElementById('email-body').value;

                const params = [];
                if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
                if (body) params.push(`body=${encodeURIComponent(body)}`);

                qrText = `mailto:${to}` + (params.length > 0 ? `?${params.join('&')}` : '');
                labelText = document.getElementById('email-label').value.trim() || to;
                break;
            }
            case 'phone': {
                const phone = document.getElementById('phone-number').value.trim();
                qrText = `tel:${phone}`;
                labelText = document.getElementById('phone-label').value.trim() || phone;
                break;
            }
            case 'vcard': {
                const lastName = document.getElementById('vcard-lastname').value.trim();
                const firstName = document.getElementById('vcard-firstname').value.trim();
                const org = document.getElementById('vcard-org').value.trim();
                const title = document.getElementById('vcard-title').value.trim();
                const phone = document.getElementById('vcard-phone').value.trim();
                const email = document.getElementById('vcard-email').value.trim();
                const url = document.getElementById('vcard-url').value.trim();

                const fullName = [lastName, firstName].filter(Boolean).join(' ');

                const vcardLines = [
                    'BEGIN:VCARD',
                    'VERSION:3.0',
                    `N:${lastName};${firstName};;;`,
                    `FN:${fullName}`
                ];
                if (org) vcardLines.push(`ORG:${org}`);
                if (title) vcardLines.push(`TITLE:${title}`);
                if (phone) vcardLines.push(`TEL;TYPE=CELL:${phone}`);
                if (email) vcardLines.push(`EMAIL:${email}`);
                if (url) vcardLines.push(`URL:${url}`);
                vcardLines.push('END:VCARD');

                qrText = vcardLines.join('\n');
                labelText = document.getElementById('vcard-label').value.trim() || fullName || org;
                break;
            }
        }

        return { qrText, labelText };
    };

    // テキストを描画可能な長さに省略するヘルパー
    const truncateText = (ctx, text, maxWidth) => {
        if (ctx.measureText(text).width <= maxWidth) {
            return text;
        }
        let truncated = text;
        while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + '...';
    };

    // フォーム送信（QRコード生成）
    qrForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const { qrText, labelText } = generateQRData();
        if (!qrText) return;

        // 既存のQRコード表示をクリア
        qrCodeDiv.innerHTML = '';

        // 一時コンテナでQRCode.jsを実行
        const tempContainer = document.createElement('div');
        try {
            new QRCode(tempContainer, {
                text: qrText,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (err) {
            console.error('QR Code generation error:', err);
            showToast('QRコードの生成に失敗しました。データ長を確認してください。');
            return;
        }

        // canvasの描画完了を待つ
        const checkCanvas = () => {
            const qrCanvas = tempContainer.querySelector('canvas');
            if (!qrCanvas) {
                setTimeout(checkCanvas, 20);
                return;
            }

            const qrSize = qrCanvas.width || 256;
            const hasLabel = labelText.length > 0;
            const labelHeight = hasLabel ? 36 : 0;
            const padding = 16;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = qrSize + (padding * 2);
            finalCanvas.height = qrSize + labelHeight + (padding * 2);
            const ctx = finalCanvas.getContext('2d');

            // 背景を白で塗りつぶす
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            // ラベルの描画
            if (hasLabel) {
                ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
                ctx.fillStyle = '#121212';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const maxLabelWidth = finalCanvas.width - (padding * 2);
                const displayLabel = truncateText(ctx, labelText, maxLabelWidth);
                ctx.fillText(displayLabel, finalCanvas.width / 2, padding + (labelHeight / 2));
            }

            // QRコード本体を描画
            ctx.drawImage(qrCanvas, padding, padding + labelHeight);

            // 画面に表示
            qrCodeDiv.appendChild(finalCanvas);
            qrCodeResultContainer.classList.remove('hidden');
            currentCanvas = finalCanvas;

            // スクロールして表示
            qrCodeResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        setTimeout(checkCanvas, 30);
    });

    // トースト通知表示
    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    };

    // PNG保存
    downloadBtn.addEventListener('click', () => {
        if (!currentCanvas) return;

        const link = document.createElement('a');
        link.download = `qrcode-${currentType}-${Date.now()}.png`;
        link.href = currentCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // クリップボードへコピー
    copyBtn.addEventListener('click', async () => {
        if (!currentCanvas) return;

        try {
            if (navigator.clipboard && window.ClipboardItem) {
                currentCanvas.toBlob(async (blob) => {
                    if (!blob) {
                        showToast('画像のコピーに失敗しました');
                        return;
                    }
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        showToast('📋 画像をクリップボードにコピーしました！');
                    } catch (err) {
                        console.error('Clipboard copy failed:', err);
                        showToast('クリップボードへのアクセスが許可されていません');
                    }
                });
            } else {
                showToast('お使いのブラウザは画像コピーに対応していません');
            }
        } catch (err) {
            console.error('Copy error:', err);
            showToast('コピーに失敗しました');
        }
    });
});

