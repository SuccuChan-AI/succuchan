# GALLERY 入稿フォルダ（グラビア等）

キャラごとのフォルダに画像を入れてください。
ここは**マスター置き場**（git非公開）。公開用の軽量WebPは私が生成して `assets/webp/gallery/` に出力し、GALLERYページに組み込みます。

## フォルダ（キャラごと）
```
assets/gallery/rina/   ray/   mayu/   koto/   hika/   aya/
assets/gallery/group/    ← 集合・キービジュアル系（複数キャラ）
```

## ファイル名の規約（カテゴリを先頭に付けてください）
GALLERYのカテゴリ（KEY VISUAL / GRAVURE / SEASONAL / DAILY LIFE）に自動で振り分けます。
```
<カテゴリ>_<番号2桁>.png
```
カテゴリ表記:
- `keyvisual_01.png`
- `gravure_01.png`
- `seasonal_01.png`
- `daily_01.png`

例:
- `assets/gallery/rina/gravure_01.png`
- `assets/gallery/rina/seasonal_02.png`
- `assets/gallery/group/keyvisual_01.png`

- カテゴリ名が付いていないものは「GRAVURE」として扱います（後から変更可）
- 縦横比はバラバラでOK（グリッドで自然に並べます）
- 拡張子 png / jpg どちらでもOK。まず数点でも構いません。
