

var alignment = function(seq1,seq2){
  var dynMatx = new Array();
  var seq1align = "";
  var seq2align = "";
  var numbers = 0;

  for(i=0;i<=seq2.length;i++){
    dynMatx[i] = [];

  }
  var node = {
    number: 0,
    direction: "left",
    flag:0
  };
  dynMatx[0][0] = node;
  //console.log(dynMatx[0,0]);
  for(i = 1;i<=seq2.length;i++){
      var node = {
      number: dynMatx[i-1][0].number - 2,
      direction: "above",
      flag: 0
    };
    dynMatx[i][0] = node;
  }

  for(j = 1;j<=seq1.length;j++){
    var node = {
      number: dynMatx[0][j-1].number - 2,
      direction: "left",
      flag: 0
    };
    dynMatx[0][j] = node;
  }
  //console.log(dynMatx[3][0]);
  //console.log(Math.max(5,3));
  var fillCells = function (dynMatx){
      for(i=1;i<=seq2.length;i++){

        for(j=1;j<=seq1.length;j++){
          if(seq1[j-1] == seq2[i-1]){
            // console.log("letters are "+seq1[j-1]+", "+seq2[i-1]);
          var   node = {

              number: dynMatx[i-1][j-1].number +1,
              direction: "diagonal",
              flag: 1
            };
            dynMatx[i][j] = node;
            continue;
          }
          else if(Math.max(dynMatx[i-1][j].number,dynMatx[i][j-1].number,dynMatx[i-1][j-1].number) == dynMatx[i-1][j-1].number){
              var node = {
                number : dynMatx[i-1][j-1].number -1,
                direction: "diagonal",
                flag: 0
              };
              dynMatx[i][j] = node;
              continue;
          }
          else if(Math.max(dynMatx[i-1][j].number,dynMatx[i][j-1].number,dynMatx[i-1][j-1].number) == dynMatx[i-1][j].number){
              var node = {
                number : dynMatx[i-1][j].number -2,
                direction: "above",
                flag: 0
              };
              dynMatx[i][j] = node;
              continue;
          }
          else{
            var node = {
              number : dynMatx[i][j-1].number -2,
              direction: "left",
              flag: 0
            };
            dynMatx[i][j] = node;
            continue;
          }
        }
      }
  }
  var align = function (dynMatx){

    j = seq1.length;


    for(i=seq2.length;i> 0 && j >0;){
      //console.log(i+" "+j);
      //console.log(dynMatx[i][j].direction );
      if(dynMatx[i][j].direction  == "diagonal"){
        seq1align += seq1[j-1];

        seq2align += seq2[i-1];
        if(dynMatx[i][j].flag == 1){
          numbers++;
        }
        i = i-1;
        j = j-1;
      }
      else if(dynMatx[i][j].direction == "above"){

        seq2align += seq2[i-1];
        seq1align += "-";
        i = i-1;
      }
      else{

        seq1align += seq1[j-1];
        seq2align += "-";
        j = j-1;
      }

  }}
  var reverse = function(str) {

      var splitStr = str.split("");


      var reversed= splitStr.reverse();


      var joined = reversed.join("");

      return joined;
  }
  fillCells(dynMatx,seq1,seq2);
  align(dynMatx);
  for(i=0 ; i <= seq2.length;i++){
    for(j=0;j<=seq1.length;j++){
    //console.log(dynMatx[i][j]);

  }
  }
  seq1align = reverse(seq1align);
  seq2align = reverse(seq2align);
  // console.log("result is "+ dynMatx[seq2.length][seq1.length].number);
  //
  // console.log(seq1align);
  // console.log(seq2align);
  //console.log("end of row");
  var align= {
    seq1: seq1align,
    seq2: seq2align,
    score :dynMatx[seq2.length][seq1.length].number,
    result :numbers
  };
  return align;
}
module.exports.alignment = alignment;
