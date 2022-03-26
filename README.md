# writeCryptactCustomFormatInGASSS-fromSavedSubscanStakingRewardsCSV
GASでSubscanで取得するステーキング報酬(Reward&Slash)のCSVファイルをクリプタクトのカスタムファイルフォーマットに書き出すソースコード

### 前提条件
* クリプタクトの[暗号資産の損益計算サービス](https://support.cryptact.com/hc/ja/categories/115000455551-%E4%BB%AE%E6%83%B3%E9%80%9A%E8%B2%A8%E3%81%AE%E6%90%8D%E7%9B%8A%E8%A8%88%E7%AE%97%E6%A9%9F%E8%83%BD-%E4%BD%BF%E3%81%84%E6%96%B9)を利用していること
* カスタムファイルをフォーマット仕様に合わせて作成していること  
[カスタムファイルの作成方法](https://support.cryptact.com/hc/ja/articles/360002571312-%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E4%BD%9C%E6%88%90%E6%96%B9%E6%B3%95)
* Google スプレッドシートを使用できること

### サポートするステーキング履歴
* Subscan / DOT / Staking (Rewarded)(※)
* Subscan / ASTR / dappsstaking (Reward)(※)
※ Reward&Slashページの**Download all data**より取得するCSVファイル

### 注意事項
* **サポートするステーキング履歴**以外の通貨は未サポートです
* ステーキング報酬のCSVファイルは文字コードをUTF-8としてください
* Subscanやクリプタクトのデータフォーマットは変わることがありますので、利用する際は自己責任でお願いします。
* 本スクリプトで対応するのは各通貨をクリプタクトのカスタム形式に書き出すところまでです。最終的に保存するカスタムファイルは個人で作成してください。

### 使い方
#### 事前準備
Google スプレッドシートで拡張機能からApps Scriptを実行し、下記4ファイルを`subscan/`指定で追加してください。
* subscan/FileOpenAction.gs
* subscan/FileOpen.html
* subscan/WriteDataAction.gs
* subscan/WriteData.html

#### ファイル展開時(onOpen関数)
① 展開したファイルのシートに**ファイル読み込み用のシート**と**データ書き出し用のシート**が追加されます
※ 既に同名のシートが存在する場合は追加処理は実行しません。
* 読込み用シート名：`tradingHist`
* 書き出し用シート名(DOT用)：`customDataDot`
* 書き出し用シート名(ASTR用)：`customDataAstar`

② メニューバーに**ファイル読み込みメニュー**と**ファイル展開メニュー**が追加されます

#### ファイル読み込みメニュー(FileOpenAction.gs / FileOpenAction.html)

メニューを実行するとファイル参照ボタンのHTMLが表示されます。  
ファイル参照ボタンからCSVファイルを選択して読み込むとHTMLにも読み込んだ内容を表示し、スプレッドシートにも表示します。

#### ファイル展開メニュー(WriteDataAction.gs / WriteDataAction.heml)

メニューを実行すると通貨毎の処理を選択するラジオボタンと書き出したい行数を入力するテキストボックスとシートへの書き込み処理を実行するボタンがHTMLで表示され、実行ボタンを押すとシートにデータを書込みます。  
書き込み対象の通貨とラジオボタンの選択が異なる場合はエラーを表示し、処理を中止します。  
入力する行数は正の整数です。0以下の値、CSVファイルの行数より大きい値の場合はエラーを表示し、処理を中止します。  
データは整形処理として文字列の結合、日時データの調整(UTC日本時間)を行います。  
その他はフォーマット形式に従い固定値を入力します。
固定値を変更する場合は`WriteDataAction.gs`から任意の文字列に変更してください。
