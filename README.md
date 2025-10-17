# Next.js + deck.gl + MapLibre 地図検索アプリ

Next.js、deck.gl、MapLibreを使用した地図検索アプリケーションです。地名や住所を検索して、地図上に位置を表示できます。

## 特徴

- 🗺️ **MapLibre GL JS** による高速な地図レンダリング
- 🎯 **deck.gl** による高性能な地理空間データの可視化
- 🔍 **OpenStreetMap Nominatim API** による無料のジオコーディング
- 🎨 **Tailwind CSS** によるモダンなUIデザイン
- ⚡ **Turbopack** による高速な開発体験
- 🔧 **Biome** による高速なコード品質管理

## 技術スタック

- **フレームワーク**: Next.js 15.5.6 (App Router)
- **言語**: TypeScript 5.9.3
- **地図ライブラリ**: 
  - deck.gl 9.2.2
  - MapLibre GL JS 5.9.0
  - react-map-gl 8.1.0
- **スタイリング**: Tailwind CSS 4.1.14
- **コード品質**: Biome 2.2.6
- **Git hooks**: Husky 9.1.7 + lint-staged 16.2.4

## 必要要件

- Node.js 22以上

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd nextjs-deckgl-sample
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## スクリプト

```bash
# 開発サーバーの起動 (Turbopack使用)
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start

# コードチェック
npm run lint

# コードフォーマット
npm run format
```

## 主な機能

### 地図検索

1. 画面左上の検索ボックスに地名や住所を入力
2. 「検索」ボタンをクリックするか、Enterキーを押す
3. 地図が検索結果の位置に滑らかに移動
4. 検索結果の位置に赤いマーカーが表示される

### 地図操作

- **ドラッグ**: 地図を移動
- **スクロール**: ズームイン/アウト
- **Shift + ドラッグ**: 地図を回転
- **Ctrl + ドラッグ**: 地図を傾ける

## プロジェクト構成

```
nextjs-deckgl-sample/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   └── DeckGLMap.tsx     # 地図コンポーネント
├── public/               # 静的ファイル
├── biome.json           # Biome設定
├── tailwind.config.ts   # Tailwind CSS設定
├── tsconfig.json        # TypeScript設定
└── package.json         # プロジェクト設定
```

## 開発のポイント

### deck.glとMapLibreの統合

`react-map-gl`を使用して、deck.glとMapLibreを統合しています。deck.glはWebGLベースの高性能な可視化を提供し、MapLibreは地図タイルのレンダリングを担当します。

### ジオコーディングAPI

OpenStreetMap Nominatim APIを使用しています。無料で使用できますが、使用する際は[利用規約](https://operations.osmfoundation.org/policies/nominatim/)を確認してください。

商用利用や大量のリクエストが必要な場合は、以下のAPIの利用を検討してください:
- Google Places API
- Mapbox Geocoding API
- Here Geocoding API

### コミット時の自動チェック

Huskyとlint-stagedを使用して、コミット前に自動的にコードチェックとフォーマットが実行されます。

## カスタマイズ

### 地図スタイルの変更

`components/DeckGLMap.tsx`の`mapStyle`プロパティを変更することで、地図のスタイルを変更できます:

```typescript
<Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
```

### 初期表示位置の変更

`viewState`の初期値を変更することで、アプリ起動時の地図の位置を変更できます:

```typescript
const [viewState, setViewState] = useState<ViewState>({
  longitude: 139.7671,  // 東京
  latitude: 35.6812,
  zoom: 11,
});
```

### マーカーのカスタマイズ

`ScatterplotLayer`のプロパティを変更することで、マーカーの色やサイズを変更できます:

```typescript
new ScatterplotLayer({
  // ...
  getFillColor: [255, 0, 0, 200],  // RGBA
  getRadius: 100,
  radiusMinPixels: 8,
  radiusMaxPixels: 50,
})
```

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [deck.gl Documentation](https://deck.gl/)
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev/)
