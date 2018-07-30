var fs  = require('fs');



//compare function that will call the bestMatch and then update the result in the all and all2 arrays
var comp = function (str1,str2){
  strarr = str1.split("");
  var bestsubstr;
  var emptyarr = new Array(str1.length);
  for (var i = 0; i < emptyarr.length; i++) {
    emptyarr[i] = "-";
  }
  //loop to loop over the number of words in the small string and perform allignment in each
  var matches = 0;
  for(j = 0;j<str2.length;j+=3){

    var maxPer = 0;
    var start;

  for(i=0;i<str1.length;i+=3){
    var count = 0;

    for(l =0;l<3;l++){

      if(strarr[i+l]== undefined || str2[j+l] == undefined)
        continue;

      if(str2[j+l] == strarr[i+l]){
        count ++;
      }

    }
    if(count == 0){
      continue;
    }
    if(count > maxPer ){
      maxPer = count;
      start = i;

    }

  }
if(count > 0){
  emptyarr[start] = str2[j];
  emptyarr[start+1] = str2[j+1];
  emptyarr[start+2] = str2[j+2];
}
// console.log(str2);
  matches += maxPer;

  for (l=0;l<3;l++){
    strarr[l+start] = "-";
  }
//console.log(strarr);
//console.log(matches);
}

var align = "";

align = emptyarr.toString().replace(/,/gi,"");
console.log(align);
var res = {
    matches: matches,
    seqAlignment1: str1,
    seqAlignment2: align
  };
  return res;
};



module.exports.comp = comp;
