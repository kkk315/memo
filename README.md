# mkazu 技術メモ

Next.js 15 App Router を使用したSSG対応Markdownブログサイトです。

## 機能

- 📝 Markdownファイルから静的サイト生成
- 🎨 Mermaidグラフの埋め込み対応
- 🖼️ 画像の自動配信（API Route経由）
- 🌏 日本語カテゴリ・記事名対応
- 📄 ページネーション機能
- 🍞 パンくずリスト
- 💻 シンタックスハイライト（Prism.js）
- 🔧 TypeScript + ESLint設定

## 技術スタック

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript
- **Styling**: CSS
- **Markdown**: gray-matter + next-mdx-remote
- **Code Highlight**: react-syntax-highlighter
- **Graphs**: Mermaid.js
- **Deployment**: GitHub Actions + GitHub Pages

## Getting Started

First, run the development server:

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 開発コマンド

```bash
# ビルド
npm run build

# 型チェック
npx tsc --noEmit

# ESLint
npm run lint
```

## ディレクトリ構造

```
content/
├── カテゴリ名/
│   ├── 記事名/
│   │   ├── index.md
│   │   └── 画像ファイル
│   └── ...
└── ...
```

## 記事の作成

1. `content/` 以下にカテゴリフォルダを作成
2. カテゴリ内に記事フォルダを作成
3. `index.md` ファイルを作成し、フロントマターを記述：

```markdown
---
title: "記事タイトル"
date: "2025-01-01"
update: "2025-01-02"
---

記事の内容...

[---]

ページ2の内容...
```

## デプロイ

GitHub Actionsによりmainブランチへのpushで自動デプロイされます。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
