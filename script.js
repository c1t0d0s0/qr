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
            },
            design: {
                customizeTitle: 'デザインをカスタマイズ',
                presetsLabel: 'デザインプリセット',
                presetClassic: 'Classic',
                presetOcean: 'Ocean',
                presetSunset: 'Sunset',
                presetEmerald: 'Emerald',
                presetCyber: 'Cyber',
                presetRose: 'Rose',
                dotStyleLabel: 'ドット形状',
                dotSquare: '四角',
                dotRounded: '角丸',
                dotCircle: 'ドット',
                eyeStyleLabel: 'アイ(目)の形状',
                eyeSquare: '四角',
                eyeRounded: '角丸',
                eyeCircle: '円形',
                colorLabel: 'カラー設定',
                colorSolid: '単色',
                colorGradient: 'グラデーション',
                fgColor: '前景色',
                fgColor2: '終了色',
                bgColor: '背景色',
                logoLabel: '中央ロゴ / アイコン',
                logoNone: 'なし',
                logoIcon: 'タイプアイコン',
                logoUpload: '画像アップロード',
                chooseImage: '画像を選択...'
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
            },
            design: {
                customizeTitle: 'Customize Design',
                presetsLabel: 'Design Presets',
                presetClassic: 'Classic',
                presetOcean: 'Ocean',
                presetSunset: 'Sunset',
                presetEmerald: 'Emerald',
                presetCyber: 'Cyber',
                presetRose: 'Rose',
                dotStyleLabel: 'Dot Style',
                dotSquare: 'Square',
                dotRounded: 'Rounded',
                dotCircle: 'Dots',
                eyeStyleLabel: 'Corner Eye Style',
                eyeSquare: 'Square',
                eyeRounded: 'Rounded',
                eyeCircle: 'Circle',
                colorLabel: 'Color Settings',
                colorSolid: 'Solid',
                colorGradient: 'Gradient',
                fgColor: 'Foreground',
                fgColor2: 'End Color',
                bgColor: 'Background',
                logoLabel: 'Center Logo / Icon',
                logoNone: 'None',
                logoIcon: 'Type Icon',
                logoUpload: 'Upload Image',
                chooseImage: 'Choose image...'
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

    // デザインプリセット
    const PRESETS = {
        classic: {
            name: 'Classic',
            dotStyle: 'square',
            eyeStyle: 'square',
            colorType: 'solid',
            fgColor1: '#000000',
            fgColor2: '#000000',
            bgColor: '#ffffff'
        },
        ocean: {
            name: 'Ocean',
            dotStyle: 'rounded',
            eyeStyle: 'rounded',
            colorType: 'gradient',
            fgColor1: '#0284c7',
            fgColor2: '#38bdf8',
            bgColor: '#ffffff'
        },
        sunset: {
            name: 'Sunset',
            dotStyle: 'dots',
            eyeStyle: 'circle',
            colorType: 'gradient',
            fgColor1: '#ea580c',
            fgColor2: '#f43f5e',
            bgColor: '#ffffff'
        },
        emerald: {
            name: 'Emerald',
            dotStyle: 'rounded',
            eyeStyle: 'rounded',
            colorType: 'gradient',
            fgColor1: '#059669',
            fgColor2: '#10b981',
            bgColor: '#ffffff'
        },
        cyber: {
            name: 'Cyber',
            dotStyle: 'dots',
            eyeStyle: 'rounded',
            colorType: 'gradient',
            fgColor1: '#7c3aed',
            fgColor2: '#ec4899',
            bgColor: '#ffffff'
        },
        rose: {
            name: 'Rose',
            dotStyle: 'rounded',
            eyeStyle: 'circle',
            colorType: 'gradient',
            fgColor1: '#be123c',
            fgColor2: '#fb7185',
            bgColor: '#ffffff'
        }
    };

    const TYPE_ICONS = {
        url: '🌐',
        text: '📝',
        wifi: '📶',
        email: '✉️',
        phone: '📞',
        vcard: '📇'
    };

    const designOptions = {
        preset: 'classic',
        dotStyle: 'square',
        eyeStyle: 'square',
        colorType: 'solid',
        fgColor1: '#000000',
        fgColor2: '#0284c7',
        bgColor: '#ffffff',
        logoType: 'none',
        customLogoImage: null
    };

    let lastGeneratedQRModel = null;
    let lastGeneratedLabel = '';

    // 角丸矩形パス描画ヘルパー
    const addRoundRectPath = (ctx, x, y, width, height, radius) => {
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            return;
        }
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
    };

    // ファインダパターン（目）の領域判定
    const isFinderArea = (r, c, count) => {
        return (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);
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

    // カスタムQRコード描画エンジン
    const renderCustomQRCode = (qrModel, options, labelText, activeType) => {
        const count = qrModel.getModuleCount();
        const cellSize = 10;
        const qrSize = count * cellSize;
        const padding = 20;
        const hasLabel = labelText && labelText.length > 0;
        const labelHeight = hasLabel ? 40 : 0;

        const canvas = document.createElement('canvas');
        canvas.width = qrSize + (padding * 2);
        canvas.height = qrSize + labelHeight + (padding * 2);
        const ctx = canvas.getContext('2d');

        // 背景塗りつぶし
        if (options.bgColor) {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 上部ラベル描画
        if (hasLabel) {
            ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            ctx.fillStyle = '#1e293b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const maxLabelWidth = canvas.width - (padding * 2);
            const displayLabel = truncateText(ctx, labelText, maxLabelWidth);
            ctx.fillText(displayLabel, canvas.width / 2, padding + (labelHeight / 2));
        }

        const originX = padding;
        const originY = padding + labelHeight;

        // 前景色・グラデーション設定
        let fillStyle = options.fgColor1;
        if (options.colorType === 'gradient') {
            const grad = ctx.createLinearGradient(originX, originY, originX + qrSize, originY + qrSize);
            grad.addColorStop(0, options.fgColor1);
            grad.addColorStop(1, options.fgColor2);
            fillStyle = grad;
        }

        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = fillStyle;

        // 中央ロゴ領域の判定
        const hasLogo = options.logoType === 'icon' || (options.logoType === 'custom' && options.customLogoImage);
        let centerStart = -1, centerEnd = -1;
        if (hasLogo) {
            const centerCells = Math.max(5, Math.floor(count * 0.22));
            centerStart = Math.floor((count - centerCells) / 2);
            centerEnd = centerStart + centerCells;
        }

        // 1. データドット描画
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (isFinderArea(r, c, count)) continue;
                if (hasLogo && r >= centerStart && r < centerEnd && c >= centerStart && c < centerEnd) continue;

                if (qrModel.isDark(r, c)) {
                    const x = originX + (c * cellSize);
                    const y = originY + (r * cellSize);

                    if (options.dotStyle === 'dots') {
                        ctx.beginPath();
                        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (options.dotStyle === 'rounded') {
                        addRoundRectPath(ctx, x + cellSize * 0.08, y + cellSize * 0.08, cellSize * 0.84, cellSize * 0.84, cellSize * 0.32);
                        ctx.fill();
                    } else {
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                }
            }
        }

        // 2. ファインダパターン（アイ）描画
        const eyeLocations = [
            { r: 0, c: 0 },
            { r: 0, c: count - 7 },
            { r: count - 7, c: 0 }
        ];

        eyeLocations.forEach(loc => {
            const x = originX + (loc.c * cellSize);
            const y = originY + (loc.r * cellSize);
            const size = 7 * cellSize;

            if (options.eyeStyle === 'circle') {
                const cx = x + size / 2;
                const cy = y + size / 2;
                // 外枠
                ctx.lineWidth = cellSize;
                ctx.beginPath();
                ctx.arc(cx, cy, (size - cellSize) / 2, 0, Math.PI * 2);
                ctx.stroke();
                // 芯
                ctx.beginPath();
                ctx.arc(cx, cy, 1.5 * cellSize, 0, Math.PI * 2);
                ctx.fill();
            } else if (options.eyeStyle === 'rounded') {
                // 外枠
                ctx.lineWidth = cellSize;
                addRoundRectPath(ctx, x + cellSize / 2, y + cellSize / 2, size - cellSize, size - cellSize, cellSize * 1.4);
                ctx.stroke();
                // 芯
                addRoundRectPath(ctx, x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize, cellSize * 0.8);
                ctx.fill();
            } else {
                // 四角アイ
                ctx.lineWidth = cellSize;
                ctx.strokeRect(x + cellSize / 2, y + cellSize / 2, size - cellSize, size - cellSize);
                ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
            }
        });

        // 3. 中央ロゴ描画
        if (hasLogo) {
            const logoAreaSize = (centerEnd - centerStart) * cellSize;
            const logoCenterX = originX + (centerStart * cellSize) + (logoAreaSize / 2);
            const logoCenterY = originY + (centerStart * cellSize) + (logoAreaSize / 2);
            const bgSize = logoAreaSize + (cellSize * 0.6);

            // 背景プレート
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 6;
            addRoundRectPath(ctx, logoCenterX - (bgSize / 2), logoCenterY - (bgSize / 2), bgSize, bgSize, bgSize * 0.22);
            ctx.fill();
            ctx.restore();

            if (options.logoType === 'icon') {
                const icon = TYPE_ICONS[activeType] || '🌐';
                ctx.font = `${Math.floor(logoAreaSize * 0.62)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(icon, logoCenterX, logoCenterY);
            } else if (options.logoType === 'custom' && options.customLogoImage) {
                const img = options.customLogoImage;
                const maxDim = logoAreaSize * 0.78;
                let drawW = maxDim;
                let drawH = maxDim;
                if (img.width && img.height) {
                    if (img.width > img.height) {
                        drawH = maxDim * (img.height / img.width);
                    } else {
                        drawW = maxDim * (img.width / img.height);
                    }
                }
                ctx.drawImage(img, logoCenterX - (drawW / 2), logoCenterY - (drawH / 2), drawW, drawH);
            }
        }

        return canvas;
    };

    // 既存QRのリアルタイム再描画
    const refreshCurrentQR = () => {
        if (!lastGeneratedQRModel) return;
        qrCodeDiv.innerHTML = '';
        const finalCanvas = renderCustomQRCode(lastGeneratedQRModel, designOptions, lastGeneratedLabel, currentType);
        qrCodeDiv.appendChild(finalCanvas);
        currentCanvas = finalCanvas;
    };

    // デザインUI要素の同期
    const updateDesignUI = () => {
        // プリセットボタン
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-preset') === designOptions.preset);
        });

        // プリセットバッジ
        const badgeEl = document.getElementById('preset-badge');
        if (badgeEl) {
            const t = i18n[currentLang] || i18n.en;
            const presetKey = 'preset' + designOptions.preset.charAt(0).toUpperCase() + designOptions.preset.slice(1);
            badgeEl.textContent = (t.design && t.design[presetKey]) ? t.design[presetKey] : designOptions.preset;
        }

        // ドット形状
        document.querySelectorAll('#dot-style-control .segment-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-dot') === designOptions.dotStyle);
        });

        // アイ形状
        document.querySelectorAll('#eye-style-control .segment-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-eye') === designOptions.eyeStyle);
        });

        // カラータイプ
        const solidBtn = document.getElementById('color-type-solid');
        const gradBtn = document.getElementById('color-type-gradient');
        const groupFg2 = document.getElementById('group-fg2');
        if (solidBtn && gradBtn && groupFg2) {
            const isGrad = designOptions.colorType === 'gradient';
            solidBtn.classList.toggle('active', !isGrad);
            gradBtn.classList.toggle('active', isGrad);
            groupFg2.style.display = isGrad ? 'block' : 'none';
        }

        // カラー入力値
        const colorFg1 = document.getElementById('color-fg1');
        const colorFg1Hex = document.getElementById('color-fg1-hex');
        const colorFg2 = document.getElementById('color-fg2');
        const colorFg2Hex = document.getElementById('color-fg2-hex');
        const colorBg = document.getElementById('color-bg');
        const colorBgHex = document.getElementById('color-bg-hex');

        if (colorFg1) colorFg1.value = designOptions.fgColor1;
        if (colorFg1Hex) colorFg1Hex.value = designOptions.fgColor1.toUpperCase();
        if (colorFg2) colorFg2.value = designOptions.fgColor2;
        if (colorFg2Hex) colorFg2Hex.value = designOptions.fgColor2.toUpperCase();
        if (colorBg) colorBg.value = designOptions.bgColor;
        if (colorBgHex) colorBgHex.value = designOptions.bgColor.toUpperCase();

        // ロゴタイプ
        document.querySelectorAll('#logo-type-control .segment-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-logo') === designOptions.logoType);
        });
        const uploadGroup = document.getElementById('custom-logo-upload-group');
        if (uploadGroup) {
            uploadGroup.style.display = designOptions.logoType === 'custom' ? 'flex' : 'none';
        }
    };

    // プリセット適用
    const applyPreset = (presetName) => {
        const p = PRESETS[presetName];
        if (!p) return;
        designOptions.preset = presetName;
        designOptions.dotStyle = p.dotStyle;
        designOptions.eyeStyle = p.eyeStyle;
        designOptions.colorType = p.colorType;
        designOptions.fgColor1 = p.fgColor1;
        designOptions.fgColor2 = p.fgColor2;
        designOptions.bgColor = p.bgColor;

        updateDesignUI();
        refreshCurrentQR();
    };

    // デザインイベントリスナーの設定
    const setupDesignListeners = () => {
        // プリセットクリック
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetName = btn.getAttribute('data-preset');
                applyPreset(presetName);
            });
        });

        // ドット形状
        document.querySelectorAll('#dot-style-control .segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                designOptions.dotStyle = btn.getAttribute('data-dot');
                designOptions.preset = 'custom';
                updateDesignUI();
                refreshCurrentQR();
            });
        });

        // アイ形状
        document.querySelectorAll('#eye-style-control .segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                designOptions.eyeStyle = btn.getAttribute('data-eye');
                designOptions.preset = 'custom';
                updateDesignUI();
                refreshCurrentQR();
            });
        });

        // カラータイプ切り替え
        const solidBtn = document.getElementById('color-type-solid');
        const gradBtn = document.getElementById('color-type-gradient');
        if (solidBtn && gradBtn) {
            solidBtn.addEventListener('click', () => {
                designOptions.colorType = 'solid';
                designOptions.preset = 'custom';
                updateDesignUI();
                refreshCurrentQR();
            });
            gradBtn.addEventListener('click', () => {
                designOptions.colorType = 'gradient';
                designOptions.preset = 'custom';
                updateDesignUI();
                refreshCurrentQR();
            });
        }

        // カラーピッカー & HEX
        const bindColorInput = (pickerId, hexId, key) => {
            const picker = document.getElementById(pickerId);
            const hex = document.getElementById(hexId);
            if (!picker || !hex) return;

            picker.addEventListener('input', () => {
                designOptions[key] = picker.value;
                hex.value = picker.value.toUpperCase();
                designOptions.preset = 'custom';
                updateDesignUI();
                refreshCurrentQR();
            });

            hex.addEventListener('change', () => {
                let val = hex.value.trim();
                if (!val.startsWith('#')) val = '#' + val;
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    designOptions[key] = val;
                    picker.value = val;
                    designOptions.preset = 'custom';
                    updateDesignUI();
                    refreshCurrentQR();
                }
            });
        };

        bindColorInput('color-fg1', 'color-fg1-hex', 'fgColor1');
        bindColorInput('color-fg2', 'color-fg2-hex', 'fgColor2');
        bindColorInput('color-bg', 'color-bg-hex', 'bgColor');

        // ロゴタイプ
        document.querySelectorAll('#logo-type-control .segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                designOptions.logoType = btn.getAttribute('data-logo');
                updateDesignUI();
                refreshCurrentQR();
            });
        });

        // カスタム画像アップロード
        const customLogoFile = document.getElementById('custom-logo-file');
        const customLogoFilename = document.getElementById('custom-logo-filename');
        const customLogoClear = document.getElementById('custom-logo-clear');

        if (customLogoFile) {
            customLogoFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (customLogoFilename) customLogoFilename.textContent = file.name;
                if (customLogoClear) customLogoClear.style.display = 'inline-block';

                const reader = new FileReader();
                reader.onload = (evt) => {
                    const img = new Image();
                    img.onload = () => {
                        designOptions.customLogoImage = img;
                        refreshCurrentQR();
                    };
                    img.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        if (customLogoClear) {
            customLogoClear.addEventListener('click', () => {
                if (customLogoFile) customLogoFile.value = '';
                if (customLogoFilename) customLogoFilename.textContent = '';
                customLogoClear.style.display = 'none';
                designOptions.customLogoImage = null;
                refreshCurrentQR();
            });
        }
    };

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
        updateDesignUI();
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

            // タイプアイコンモードの場合、タブ切り替えに合わせてリアルタイム更新
            if (designOptions.logoType === 'icon') {
                refreshCurrentQR();
            }
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

    // デザインコントロールの初期化
    setupDesignListeners();
    updateDesignUI();

    // 初期言語の適用
    applyLanguage(currentLang);

    // フォーム送信（QRコード生成）
    qrForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const { qrText, labelText } = generateQRData();
        if (!qrText) return;

        // 既存のQRコード表示をクリア
        qrCodeDiv.innerHTML = '';

        // 一時コンテナでQRCode.jsを実行してマトリクスモデルを生成
        const tempContainer = document.createElement('div');
        const t = i18n[currentLang] || i18n.en;
        let qrInstance = null;
        try {
            qrInstance = new QRCode(tempContainer, {
                text: qrText,
                width: 256,
                height: 256,
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (err) {
            console.error('QR Code generation error:', err);
            showToast(t.toasts.genFailed);
            return;
        }

        const qrModel = qrInstance._oQRCode;
        if (!qrModel) {
            showToast(t.toasts.genFailed);
            return;
        }

        lastGeneratedQRModel = qrModel;
        lastGeneratedLabel = labelText;

        // カスタムデザインでCanvasを描画
        const finalCanvas = renderCustomQRCode(qrModel, designOptions, labelText, currentType);

        // 画面に表示
        qrCodeDiv.appendChild(finalCanvas);
        qrCodeResultContainer.classList.remove('hidden');
        currentCanvas = finalCanvas;

        // スクロールして表示
        qrCodeResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
