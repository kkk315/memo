
# mkazu.net

個人開発・インフラ・ネットワーク・プログラミング・自宅サーバー運用・ツール活用など、日々の技術的な気づきやノウハウ、実践記録をまとめたブログです。
本体→http://blog.mkazu.net
## このブログで読めること

- 個人開発や自作ツールの実践メモ
- Linux・サーバー・ネットワーク構築のトラブルシュートやTips
- Next.jsやTypeScriptなどWeb技術の導入・運用ノウハウ
- asdfやGitなど開発環境の管理・自動化の工夫
- 自宅ラボ・仮想化・Proxmoxなどの構築記録
- 日々の作業効率化や便利ツールの紹介

技術的な検証・失敗談・運用のリアルな知見を中心に、備忘録も兼ねて幅広く発信しています。

記事はカテゴリごとに整理されており、日本語のカテゴリ名や記事名にも対応しています。

---



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
date: "2025-01-01"（必須）
update: "2025-01-02"（あれば）
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
