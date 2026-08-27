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
    const themeToggleBtn = document.getElementById('theme-toggle');
    const langSelect = document.getElementById('lang-select');

    let currentType = 'url';
    let currentCanvas = null;
    let toastTimeout = null;

    // 多言語辞書 (i18n)
    const i18n = {
        ja: {
            pageTitle: 'QR Code Generator',
            appTitle: 'QR Code Generator',
            appSubtitle: 'URL、テキスト、Wi-Fi、連絡先などのQRコードを簡単に作成',
            themeToLight: 'ライトモードに切り替え',
            themeToDark: 'ダークモードに切り替え',
            tabs: {
                ariaLabel: 'QRコードのタイプ',
                url: 'URL',
                text: 'テキスト',
                wifi: 'Wi-Fi',
                email: 'メール',
                phone: '電話',
                vcard: '連絡先'
            },
            labels: {
                topLabelOptional: '画像上部ラベル (任意)',
                urlRequired: 'URL <span class="required">*</span>',
                textRequired: 'テキスト <span class="required">*</span>',
                wifiSsidRequired: 'SSID (ネットワーク名) <span class="required">*</span>',
                wifiPassword: 'パスワード',
                wifiAuth: 'セキュリティ (暗号化方式)',
                wifiHidden: '非公開ネットワーク (ステルスSSID)',
                wifiLabel: '画像上部ラベル (空欄時はSSIDを使用)',
                emailToRequired: '宛先メールアドレス <span class="required">*</span>',
                emailSubject: '件名 (任意)',
                emailBody: '本文 (任意)',
                emailLabel: '画像上部ラベル (任意)',
                phoneNumberRequired: '電話番号 <span class="required">*</span>',
                phoneLabel: '画像上部ラベル (任意)',
                vcardLastNameRequired: '姓 <span class="required">*</span>',
                vcardFirstName: '名',
                vcardOrg: '会社名 / 組織 (任意)',
                vcardTitle: '役職 / 肩書 (任意)',
                vcardPhone: '電話番号 (任意)',
                vcardEmail: 'メールアドレス (任意)',
                vcardUrl: 'Webサイト (任意)',
                vcardLabel: '画像上部ラベル (任意)'
            },
            placeholders: {
                urlInput: 'https://example.com',
                urlLabel: '例: 公式サイト',
                textInput: 'QRコードに変換したいテキストを入力してください',
                textLabel: '例: メモ',
                wifiSsid: 'Wi-FiのSSID',
                wifiPassword: 'Wi-Fiパスワード',
                wifiPasswordNoPass: '暗号化なしのため不要です',
                wifiLabel: '空欄時はSSIDがラベルになります',
                emailTo: 'info@example.com',
                emailSubject: 'お問い合わせ件名',
                emailBody: 'メールの本文テンプレート',
                emailLabel: '例: お問い合わせ窓口',
                phoneNumber: '09012345678 または +819012345678',
                phoneLabel: '例: カスタマーサポート',
                vcardLastName: '山田',
                vcardFirstName: '太郎',
                vcardOrg: '株式会社〇〇',
                vcardTitle: '代表取締役 / マネージャー',
                vcardPhone: '03-1234-5678',
                vcardEmail: 'yamada@example.com',
                vcardUrl: 'https://example.com',
                vcardLabel: '空欄時は氏名を使用'
            },
            selectOptions: {
                wifiAuthWpa: 'WPA / WPA2 / WPA3',
                wifiAuthWep: 'WEP',
                wifiAuthNoPass: 'なし (オープンネットワーク)'
            },
            buttons: {
                generate: 'QRコードを生成',
                download: '<span>💾</span> PNG保存',
                copy: '<span>📋</span> 画像コピー'
            },
            toasts: {
                genFailed: 'QRコードの生成に失敗しました。データ長を確認してください。',
                copySuccess: '📋 画像をクリップボードにコピーしました！',
                copyFailed: '画像のコピーに失敗しました',
                copyUnsupported: 'お使いのブラウザは画像コピーに対応していません',
                copyPermissionDenied: 'クリップボードへのアクセスが許可されていません'
            }
        },
        en: {
            pageTitle: 'QR Code Generator',
            appTitle: 'QR Code Generator',
            appSubtitle: 'Easily generate QR codes for URLs, text, Wi-Fi, contacts, and more',
            themeToLight: 'Switch to Light Mode',
            themeToDark: 'Switch to Dark Mode',
            tabs: {
                ariaLabel: 'QR Code Type',
                url: 'URL',
                text: 'Text',
                wifi: 'Wi-Fi',
                email: 'Email',
                phone: 'Phone',
                vcard: 'Contact'
            },
            labels: {
                topLabelOptional: 'Top Label (Optional)',
                urlRequired: 'URL <span class="required">*</span>',
                textRequired: 'Text <span class="required">*</span>',
                wifiSsidRequired: 'SSID (Network Name) <span class="required">*</span>',
                wifiPassword: 'Password',
                wifiAuth: 'Security (Encryption)',
                wifiHidden: 'Hidden Network (Stealth SSID)',
                wifiLabel: 'Top Label (Uses SSID if blank)',
                emailToRequired: 'Recipient Email <span class="required">*</span>',
                emailSubject: 'Subject (Optional)',
                emailBody: 'Body (Optional)',
                emailLabel: 'Top Label (Optional)',
                phoneNumberRequired: 'Phone Number <span class="required">*</span>',
                phoneLabel: 'Top Label (Optional)',
                vcardLastNameRequired: 'Last Name <span class="required">*</span>',
                vcardFirstName: 'First Name',
                vcardOrg: 'Company / Organization (Optional)',
                vcardTitle: 'Job Title (Optional)',
                vcardPhone: 'Phone Number (Optional)',
                vcardEmail: 'Email Address (Optional)',
                vcardUrl: 'Website (Optional)',
                vcardLabel: 'Top Label (Optional)'
            },
            placeholders: {
                urlInput: 'https://example.com',
                urlLabel: 'e.g., Official Website',
                textInput: 'Enter the text to encode into a QR code',
                textLabel: 'e.g., Note',
                wifiSsid: 'Wi-Fi SSID',
                wifiPassword: 'Wi-Fi Password',
                wifiPasswordNoPass: 'Not required for open network',
                wifiLabel: 'Uses SSID as label if blank',
                emailTo: 'info@example.com',
                emailSubject: 'Inquiry Subject',
                emailBody: 'Email body template',
                emailLabel: 'e.g., Support Desk',
                phoneNumber: '+1234567890 or +819012345678',
                phoneLabel: 'e.g., Customer Support',
                vcardLastName: 'Doe',
                vcardFirstName: 'John',
                vcardOrg: 'Acme Corp',
                vcardTitle: 'CEO / Manager',
                vcardPhone: '03-1234-5678',
                vcardEmail: 'john.doe@example.com',
                vcardUrl: 'https://example.com',
                vcardLabel: 'Uses full name if blank'
            },
            selectOptions: {
                wifiAuthWpa: 'WPA / WPA2 / WPA3',
                wifiAuthWep: 'WEP',
                wifiAuthNoPass: 'None (Open Network)'
            },
            buttons: {
                generate: 'Generate QR Code',
                download: '<span>💾</span> Save PNG',
                copy: '<span>📋</span> Copy Image'
            },
            toasts: {
                genFailed: 'Failed to generate QR code. Please check the data length.',
                copySuccess: '📋 QR code copied to clipboard!',
                copyFailed: 'Failed to copy image',
                copyUnsupported: 'Your browser does not support copying images',
                copyPermissionDenied: 'Clipboard access was denied'
            }
        }
    };

    // ブラウザの第一優先言語を判定
    const getBrowserLanguage = () => {
        const primary = (navigator.languages && navigator.languages.length > 0)
            ? navigator.languages[0]
            : (navigator.language || navigator.userLanguage || navigator.browserLanguage || '');
        
        if (typeof primary === 'string' && primary.toLowerCase().trim().startsWith('ja')) {
            return 'ja';
        }
        return 'en';
    };

    // 保存された言語設定の取得 (未設定時は 'auto')
    const getSavedLangSetting = () => {
        const saved = localStorage.getItem('qr_lang');
        if (saved === 'ja' || saved === 'en' || saved === 'auto') {
            return saved;
        }
        return 'auto';
    };

    // 実際に適用する言語 ('ja' | 'en') を解決
    const resolveEffectiveLanguage = (setting) => {
        if (setting === 'ja' || setting === 'en') {
            return setting;
        }
        return getBrowserLanguage();
    };

    let currentSetting = getSavedLangSetting();
    let currentLang = resolveEffectiveLanguage(currentSetting);

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
    };

    // 言語セレクトUIの同期
    const updateLangSelectUI = (setting) => {
        if (langSelect) {
            langSelect.value = setting;
        }
    };

    // テーマ切り替え機能
    const updateThemeToggleUI = (theme) => {
        if (!themeToggleBtn) return;
        const t = i18n[currentLang] || i18n.en;
        const nextThemeText = theme === 'dark' ? t.themeToLight : t.themeToDark;
        themeToggleBtn.setAttribute('aria-label', nextThemeText);
        themeToggleBtn.setAttribute('title', nextThemeText);
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('qr_theme', theme);
        } catch (e) {
            console.warn('Failed to save theme to localStorage', e);
        }
        updateThemeToggleUI(theme);
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // 言語適用関数
    const applyLanguage = (lang) => {
        currentLang = lang;
        document.documentElement.lang = lang;
        const t = i18n[lang] || i18n.en;

        if (t.pageTitle) {
            document.title = t.pageTitle;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = getNestedValue(t, key);
            if (val !== undefined) el.textContent = val;
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const val = getNestedValue(t, key);
            if (val !== undefined) el.innerHTML = val;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = getNestedValue(t, key);
            if (val !== undefined) el.placeholder = val;
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            const val = getNestedValue(t, key);
            if (val !== undefined) el.setAttribute('aria-label', val);
        });

        // Wi-Fiパスワードプレースホルダーの更新
        if (wifiAuthSelect && wifiPasswordInput) {
            if (wifiAuthSelect.value === 'nopass') {
                wifiPasswordInput.placeholder = t.placeholders.wifiPasswordNoPass;
            } else {
                wifiPasswordInput.placeholder = t.placeholders.wifiPassword;
            }
        }

        updateThemeToggleUI(document.documentElement.getAttribute('data-theme') || 'dark');
        updateLangSelectUI(currentSetting);
    };

    const setLanguageSetting = (setting) => {
        currentSetting = setting;
        try {
            localStorage.setItem('qr_lang', setting);
        } catch (e) {
            console.warn('Failed to save language setting to localStorage', e);
        }
        const effectiveLang = resolveEffectiveLanguage(setting);
        applyLanguage(effectiveLang);
    };

    if (langSelect) {
        langSelect.addEventListener('change', () => {
            setLanguageSetting(langSelect.value);
        });
    }

    // 初期言語の適用
    applyLanguage(currentLang);

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

            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
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
        const t = i18n[currentLang] || i18n.en;
        if (wifiAuthSelect.value === 'nopass') {
            wifiPasswordInput.value = '';
            wifiPasswordInput.disabled = true;
            wifiPasswordInput.placeholder = t.placeholders.wifiPasswordNoPass;
        } else {
            wifiPasswordInput.disabled = false;
            wifiPasswordInput.placeholder = t.placeholders.wifiPassword;
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

                const fullName = currentLang === 'ja'
                    ? [lastName, firstName].filter(Boolean).join(' ')
                    : [firstName, lastName].filter(Boolean).join(' ');

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
        const t = i18n[currentLang] || i18n.en;
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
            showToast(t.toasts.genFailed);
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
        const t = i18n[currentLang] || i18n.en;

        try {
            if (navigator.clipboard && window.ClipboardItem) {
                currentCanvas.toBlob(async (blob) => {
                    if (!blob) {
                        showToast(t.toasts.copyFailed);
                        return;
                    }
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        showToast(t.toasts.copySuccess);
                    } catch (err) {
                        console.error('Clipboard copy failed:', err);
                        showToast(t.toasts.copyPermissionDenied);
                    }
                });
            } else {
                showToast(t.toasts.copyUnsupported);
            }
        } catch (err) {
            console.error('Copy error:', err);
            showToast(t.toasts.copyFailed);
        }
    });
});

