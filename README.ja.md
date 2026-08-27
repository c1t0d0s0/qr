# QR Code Generator (QRコード ジェネレーター)

[English (README.md)](README.md)

URL、テキスト、Wi-Fi、メール、電話番号、連絡先（vCard）などのQRコードを簡単に作成できる、モダンでレスポンシブなWebアプリケーションです。

---

## ✨ 主な機能

- **6種類のQRコードタイプに対応**:
  - 🌐 **URL**: Webサイトやリンク用
  - 📝 **テキスト**: 任意のテキストメッセージ
  - 📶 **Wi-Fi**: Wi-Fi接続設定（WPA/WPA2/WPA3、WEP、なし、ステルスSSID対応）
  - ✉️ **メール**: 宛先、件名、本文テンプレート付き
  - 📞 **電話**: 電話番号の発信リンク
  - 📇 **連絡先 (vCard)**: 氏名、会社名、役職、電話、メール、Webサイトを含むデジタル名刺
- **🎨 おしゃれなデザインカスタマイズ機能**:
  - **デザインプリセット**: ワンクリックで適用できる6種類のスタイル（Classic、Ocean Blue、Sunset Glow、Emerald Nature、Cyber Purple、Rose Gold）
  - **ドット形状**: 四角（クラシック）、角丸、サークル（円形）から選択可能
  - **アイ（目の部分）形状**: 四角、角丸、円形ファインダパターン
  - **カラー & グラデーション**: 単色設定、および2色リニアグラデーション（カラーピッカー対応）
  - **中央ロゴ / アイコン埋め込み**: 各QRタイプ対応のアイコン（🌐/📶/✉️/📞/📇）または任意のカスタムロゴ画像を配置可能（エラー訂正レベル最高品質 `Level H (30%)`）
- **画像上部ラベル機能**: 生成されるQRコード画像の上部に任意のテキストラベルを埋め込み可能
- **保存・共有オプション**:
  - 💾 **PNG保存**: 高解像度のQRコード画像をローカルにダウンロード
  - 📋 **画像コピー**: ワンクリックでクリップボードに画像をコピー
- **テーマ切り替え**: ダークモード / ライトモードに対応（選択状態は自動保存）
- **多言語対応 (i18n)**:
  - ブラウザの言語設定に応じた自動判定
  - ヘッダーから `Auto`、`日本語`、`English` の手動切り替えが可能
- **快適なUI/UXとレスポンシブ対応**:
  - 横スクロール不要の3列×2行グリッドレイアウトで、PCでもスマホでも快適に操作
  - WAI-ARIAに準拠したアクセシブルな設計
- **完全クライアントサイド動作**: すべてのQRコード生成処理はブラウザ内で完結し、サーバーへデータが送信されることはありません（プライバシー保護）。

---

## 🚀 使い方・ローカル実行

ビルドや依存パッケージのインストールは不要です。`index.html` をブラウザで直接開くか、ローカルサーバーで起動できます。

```bash
# Python を使用する場合
python3 -m http.server 8000

# Node.js (npx) を使用する場合
npx serve .
```

ブラウザで [http://localhost:8000](http://localhost:8000) を開きます。

---

## ⚙️ デプロイとCI/CD

本リポジトリには、`v` から始まるタグ（例: `v1.0.0`）をpushした際に **GitHub Pages** へ自動デプロイする GitHub Actions ワークフロー（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）が含まれています。

### デプロイの実行

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Google Tag Manager (GTM) の設定

Google Tag Manager / Google Analytics を利用する場合:
1. リポジトリの **Settings** → **Secrets and variables** → **Actions** → **Variables**（または **Secrets**）を開きます。
2. `GTM_ID` という名前で測定ID / コンテナID（例: `G-XXXXXXXXXX` または `GTM-XXXXXXX`）を登録します。
3. デプロイ時に自動的に `config.js` に注入されて反映されます。

---

## 📁 ディレクトリ構成

```
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Pages 自動デプロイワークフロー
├── config.js             # GTM / Google Analytics 設定ファイル
├── index.html            # メインHTML
├── qrcode.min.js         # クライアントサイドQRコード生成ライブラリ
├── script.js             # アプリケーションロジック（i18n、テーマ、QR生成等）
├── style.css             # スタイルシート（ダーク/ライトテーマ、レスポンシブ）
├── LICENSE               # MIT License
├── README.md             # 英語版ドキュメント
└── README.ja.md          # 日本語版ドキュメント
```

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。
