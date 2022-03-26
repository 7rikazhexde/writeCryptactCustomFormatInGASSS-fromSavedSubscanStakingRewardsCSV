/**
 * データ書き出し用HTML作成
 */
function writeData() {
  var html = HtmlService.createHtmlOutputFromFile("subscan/WriteData");
  SpreadsheetApp.getUi().showModalDialog(html, "カスタムシート書出し");
}

/**
 * customDataDotシートクリア処理
 */
function customDataDotSheetClear(){
  // シート名指定でシートを取得する
  var cdsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("customDataDot");
  // シートのすべてをクリアする
  cdsh.clear();
}

/**
 * customDataAstarシートクリア処理
 */
function customDataAstarSheetClear(){
  // シート名指定でシートを取得する
  var cdsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("customDataAstar");
  // シートのすべてをクリアする
  cdsh.clear();
}

/**
 * データ書き出し判定処理
 * @param {number} num - 書き出し件数
 * 
 * WriteData.html内のJSに指定して呼び出す
 */
function checkWriteNum(num,checkValue){
  var thsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tradingHist");
  var lastRow = thsh.getLastRow();
  // 下記メッセージの形式であればlastRow -1でもNaNとはならず表示されますが、readTextGASFileOpen関数と合わせてデクリメントします。
  lastRow--;

  var dotAction = thsh.getRange(2, 7).getValue()
  var astarAction = thsh.getRange(2, 6).getValue()

  if(checkValue == "DOT"){
    if(dotAction != "Staking(Rewarded)"){
      // Uiクラスを使用して書込み上限エラーメッセージダイアログ(タイトルとOKボタン）を表示
      var ui = SpreadsheetApp.getUi();
      var title = "書き込みファイルエラー"
      var message = "DOTの指定で入力してください"
      ui.alert(title, message, ui.ButtonSet.OK);
      return;
    }
  }

  if(checkValue == "ASTR"){
    if(astarAction != "dappsstaking(Reward)"){
      // Uiクラスを使用して書込み上限エラーメッセージダイアログ(タイトルとOKボタン）を表示
      var ui = SpreadsheetApp.getUi();
      var title = "書き込みファイルエラー"
      var message = "ASTRの指定で入力してください。"
      ui.alert(title, message, ui.ButtonSet.OK);
      return;
    }
  }

  // 件数チェック
  if(num <= 0){
    // Uiクラスを使用して書込み上限エラーメッセージダイアログ(タイトルとOKボタン）を表示
    var ui = SpreadsheetApp.getUi();
    var title = "読み込み数値エラー"
    var message = "正の整数で入力してください。"
    ui.alert(title, message, ui.ButtonSet.OK);
    return;
  }
  // 読込み件数が最終行(項目行を除く)より大きい場合
  else if (num > lastRow){
    // Uiクラスを使用して書込み上限エラーメッセージダイアログ(タイトルとOKボタン）を表示
    var ui = SpreadsheetApp.getUi();
    var title = "読み出し上限エラー"
    var message = lastRow + "件以下で入力してください。"
    ui.alert(title, message, ui.ButtonSet.OK);
    return;
  }

  // ステーキング報酬履歴を入力件数分customDataシートに書き出す
  if(checkValue == "DOT"){
    // 書き出し前にシートを全てクリアする
     customDataDotSheetClear();
     writeDataCryptactFormatFromDotSubscan(num);
  }
  else if(checkValue == "ASTR"){
    // 書き出し前にシートを全てクリアする
    customDataAstarSheetClear();
    writeDataCryptactFormatFromAstarSubscan(num);
  }
  // Uiクラスを使用して書き出し成功メッセージダイアログ(タイトルとOKボタン）を表示
  var ui = SpreadsheetApp.getUi();
  var title = "書き出し成功"
  if(checkValue == "DOT"){
    var message = "customDataDotシートに" + checkValue + "を" + num + "件書き出しました。"
  }
  else if(checkValue == "ASTR"){
    var message = "customDataAstarシートに" + checkValue + "を" + num + "件書き出しました。"
  }
  ui.alert(title, message, ui.ButtonSet.OK);
}

/**
 * データ書き出し処理
 * @param {number} num - 書き出し件数
 * 
 * カスタムファイル用にtradingHistシートからcustomDataDotシートに書き出す
 */
function writeDataCryptactFormatFromDotSubscan(num) {
  // 作業中のシート
  var thsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tradingHist");
  // 変換後結果出力先シート
  var cdsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("customDataDot");
  // 参照する最終行数
  var lastRow = num;
  // 行数調整(1加算)
  lastRow++; //num + 1;だと10乗算されてしまうのでインクリメントすること

  // 項目名設定(A-J列)
  cdsh.getRange(1,1).setValue("Timestamp");
  cdsh.getRange(1,2).setValue("Action");
  cdsh.getRange(1,3).setValue("Source");
  cdsh.getRange(1,4).setValue("Base");
  cdsh.getRange(1,5).setValue("Volume");
  cdsh.getRange(1,6).setValue("Price");
  cdsh.getRange(1,7).setValue("Counter");
  cdsh.getRange(1,8).setValue("Fee");
  cdsh.getRange(1,9).setValue("FeeCcy");      
  cdsh.getRange(1,10).setValue("Comment");

  // 項目名設定(固定値)
  cdsh.getRange(2,2,lastRow-1).setValue("STAKING");
  cdsh.getRange(2,3,lastRow-1).setValue("KZ8_DW_DOT_4ID1");
  cdsh.getRange(2,4,lastRow-1).setValue("DOT");
  cdsh.getRange(2,7,lastRow-1).setValue("JPY");
  cdsh.getRange(2,8,lastRow-1).setValue(0);
  cdsh.getRange(2,9,lastRow-1).setValue("JPY");

  // lastRowまで繰り返す
  for(var i = 2; i <= lastRow ; i++){
    // Date取得
    var rawDate = thsh.getRange(i, 3).getValue();
    // UTC日本時間(+9:00)に調整
    var addDate = new Date(rawDate.setHours(rawDate.getHours() + 9));
    // フォーマット変更
    var formatedDate = Utilities.formatDate(addDate, "JST","yyyy/MM/dd HH:mm:ss");
    // Timestamp列に追加(フォーマットに合わせるため文字列指定)
    cdsh.getRange(i,1).setValue("'"+formatedDate);

    // Valueを取得
    var stkValue = thsh.getRange(i, 6).getValue()
    // Volume列に追加
    cdsh.getRange(i, 5).setValue(stkValue);

    // Event Indexを取得
    var eventIndex = thsh.getRange(i, 1).getValue()
    // Eraを取得
    var era = thsh.getRange(i, 2).getValue()
    // 履歴を区別するためeventIndexとeraを結合した値をcomment列に追加
    cdsh.getRange(i, 10).setValue(eventIndex + " " + era);
  }
  // customDataシートの最終行取得
  var cdshLastRow = cdsh.getLastRow();
  // シート内でソートしたいセル範囲を指定
  var sortData = cdsh.getRange(2, 1, cdshLastRow - 1, 10);
  // 列Aを基準に昇順でソートする
  sortData.sort({column: 1, ascending: true});
}

/**
 * データ書き出し処理
 * @param {number} num - 書き出し件数
 * 
 * カスタムファイル用にtradingHistシートからcustomDataAstarシートに書き出す
 */
function writeDataCryptactFormatFromAstarSubscan(num) {
  // 作業中のシート
  var thsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tradingHist");
  // 変換後結果出力先シート
  var cdsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("customDataAstar");
  // 参照する最終行数
  var lastRow = num;
  // 行数調整(1加算)
  lastRow++; //num + 1;だと10乗算されてしまうのでインクリメントすること

  // 項目名設定(A-J列)
  cdsh.getRange(1,1).setValue("Timestamp");
  cdsh.getRange(1,2).setValue("Action");
  cdsh.getRange(1,3).setValue("Source");
  cdsh.getRange(1,4).setValue("Base");
  cdsh.getRange(1,5).setValue("Volume");
  cdsh.getRange(1,6).setValue("Price");
  cdsh.getRange(1,7).setValue("Counter");
  cdsh.getRange(1,8).setValue("Fee");
  cdsh.getRange(1,9).setValue("FeeCcy");      
  cdsh.getRange(1,10).setValue("Comment");

  // 項目名設定(固定値)
  cdsh.getRange(2,2,lastRow-1).setValue("STAKING");
  cdsh.getRange(2,3,lastRow-1).setValue("KZ8_DW_ASTR_4ID1");
  cdsh.getRange(2,4,lastRow-1).setValue("ASTR");
  cdsh.getRange(2,7,lastRow-1).setValue("JPY");
  cdsh.getRange(2,8,lastRow-1).setValue(0);
  cdsh.getRange(2,9,lastRow-1).setValue("JPY");

  // lastRowまで繰り返す
  for(var i = 2; i <= lastRow ; i++){
    // Date取得
    var rawDate = thsh.getRange(i, 2).getValue();
    // UTC日本時間(+9:00)に調整
    var addDate = new Date(rawDate.setHours(rawDate.getHours() + 9));
    // フォーマット変更
    var formatedDate = Utilities.formatDate(addDate, "JST","yyyy/MM/dd HH:mm:ss");
    // Timestamp列に追加(フォーマットに合わせるため文字列指定)
    cdsh.getRange(i,1).setValue("'"+formatedDate);

    // Valueを取得
    var stkValue = thsh.getRange(i, 5).getValue()
    // Volume列に追加
    cdsh.getRange(i, 5).setValue(stkValue);

    // Event Indexを取得
    var eventID = thsh.getRange(i, 1).getValue()
    // Extrinsic Hashを取得
    var exHash = thsh.getRange(i, 4).getValue()
    // 履歴を区別するためEvent IDとExtrinsic Hashを,区切りでcomment列に追加
    cdsh.getRange(i, 10).setValue("Event ID:" + eventID + "," + "Extrinsic Hash:" + exHash);
  }
  // customDataシートの最終行取得
  var cdshLastRow = cdsh.getLastRow();
  // シート内でソートしたいセル範囲を指定
  var sortData = cdsh.getRange(2, 1, cdshLastRow - 1, 10);
  // 列Aを基準に昇順でソートする
  sortData.sort({column: 1, ascending: true});
}
