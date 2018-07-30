var fs = require('fs');

var hydroGene = function(seq1,seq2) {

  function makeArray(length, val) {
    if (val === undefined) {
      val = 0 | 0;
    }
    if (val < 0) {
      val = 0;
    }
    length |= 0;
    var max = 0;
    for (var i = length; i !== 0; i >>>= 1) {
      max++;
    }
    var n = Array(max);
    n[0] = [val];
    for (i = 1; i < max; i++) {
      n[i] = n[i - 1].concat(n[i - 1]);
    }
    var a = [];
    for (var i = 0, l = length; l !== 0; l >>>= 1, i++) {
      if (l & 1) {
        a = a.concat(n[i]);
      }
    }
    return a;
  };

  // Map --> Protein to 5 bit
  var __proteinTo5Bit = {
    'A': 1,
    'R': 2,
    'N': 3,
    'D': 4,
    'C': 5,
    'E': 6,
    'Q': 7,
    'G': 8,
    'H': 9,
    'I': 10,
    'L': 11,
    'K': 12,
    'M': 13,
    'F': 14,
    'P': 15,
    'S': 16,
    'T': 17,
    'W': 18,
    'Y': 19,
    'V': 20,
    '-': 21,
    '_': 22
  };

  //  Reverse Map for mapping each Integer to a Character again
  var reverseMap = {};
  for (var key in __proteinTo5Bit) {
    if (__proteinTo5Bit.hasOwnProperty(key)) {
      reverseMap[__proteinTo5Bit[key]] = key;
    }
  }

  /* Double up to form bytes */
  var __proteinTo2Bytes;
  var __2BytesToProtein;
  var __byteNucleotideContent;


  void function() {

    var a = Object.create(null);
    var c = new makeArray(256);
    var d = new makeArray(256);

    var keys = Object.keys(__proteinTo5Bit);
    var len = keys.length;
    var ki;
    var kj;
    var kk;
    var byte;

    for (var i = 0; i < len; i++) {
      ki = keys[i];
      for (var j = 0; j < len; j++) {
        kj = keys[j];
        for (var k = 0; k < len; k++) {
          kk = keys[k];
          byte = __proteinTo5Bit[kk] << 10 | (__proteinTo5Bit[kj] << 5) | __proteinTo5Bit[ki];
          a[kk + kj + ki] = byte;
          c[byte] = kk + kj + ki;
          d[byte] = [kk, kj, ki];
        }
      }
    }

    __proteinTo2Bytes = a;
    __2BytesToProtein = c;
    __byteNucleotideContent = d;

  }();

  function proteinTo2Bytes(ss) {
    return __proteinTo2Bytes[ss] | 0;
  }

  function Seq() {

    this.__endPadding = 0;

    //Initialization for the buffer
    this.__buffer = new ArrayBuffer(4);

  };

  Seq.prototype.read1 = function(sequence) {

    var proteinString = sequence.toUpperCase()
      .replace(/\s/g, '');

    var length = proteinString.length;
    var max = Math.ceil(length / 3);
    var endPadding = (4 - (max) % 4) % 4;
    this.__endPadding = endPadding;

    var buffer = new ArrayBuffer((max*2));
    // console.log('max : ' + max);
    var dataArray = new Int16Array(buffer);
    var n;
    var byte;
    var content;
    for (var i = 0; i < dataArray.length; i++) {
      // Increment this variable by 3 every iteration in the loop
      n = (i << 1) + i;
      if (sequence[n+1] == undefined) {
        dataArray[i] = proteinTo2Bytes(sequence[n] + '-' + '-');
        // console.log('dataArray: ' + dataArray[i]);
        // console.log('Sequence: ' + __2BytesToProtein[dataArray[i]]);
        continue;
      }
      if (sequence[n+2] == undefined) {
        dataArray[i] = proteinTo2Bytes(sequence[n] + sequence[n+1] + '-');
        // console.log('dataArray: ' + dataArray[i]);
        // console.log('Sequence: ' + __2BytesToProtein[dataArray[i]]);
        continue;
      }
      dataArray[i] = proteinTo2Bytes(sequence[n] + sequence[n + 1] + sequence[n + 2]);
      // console.log('dataArray: ' + dataArray[i]);
      // console.log('Sequence: ' + __2BytesToProtein[dataArray[i]]);
    }
    this.__buffer = buffer;
    this.__length = length;
    // console.log("Successfully loaded sequence : " + this.sequence() + "  -- Size : " + this.size());
    return this;

  };

  Seq.prototype.read2 = function(sequence) {

    var proteinString = sequence.toUpperCase()
      .replace(/\s/g, '');

    var length = proteinString.length;
    var max = Math.ceil(length / 3);
    var endPadding = (4 - (max) % 4) % 4;
    this.__endPadding = endPadding;

    var buffer = new ArrayBuffer((max*2));
    // console.log('max : ' + max);
    var dataArray = new Int16Array(buffer);
    var n;
    var byte;
    var content;
    for (var i = 0; i < dataArray.length; i++) {
      // Increment this variable by 3 every iteration in the loop
      n = (i << 1) + i;
      if (sequence[n+1] == undefined) {
        dataArray[i] = proteinTo2Bytes(sequence[n] + '_' + '_');
        // console.log('dataArray: ' + dataArray[i]);
        // console.log('Sequence: ' + __2BytesToProtein[dataArray[i]]);
        continue;
      }
      if (sequence[n+2] == undefined) {
        dataArray[i] = proteinTo2Bytes(sequence[n] + sequence[n+1] + '_');
        // console.log('dataArray: ' + dataArray[i]);
        // console.log('Sequence: ' + __2BytesToProtein[dataArray[i]]);
        continue;
      }
      dataArray[i] = proteinTo2Bytes(sequence[n] + sequence[n + 1] + sequence[n + 2]);
      // console.log('dataArray: ' + dataArray[i]);
      // console.log('Sequence: ' + __2BytesToProtein[dataArray[i]]);
    }
    this.__buffer = buffer;
    this.__length = length;
    // console.log("Successfully loaded sequence : " + this.sequence() + "  -- Size : " + this.size());
    return this;

  };

  Seq.prototype.readFASTA = function(strFASTA) {

    var data = strFASTA.split(/\n\r?/gi);

    while (data.length && data[0][0] === '>') {
      data.shift();
    }

    return this.read(data.join(''));

  };

  Seq.prototype.loadFASTA = function(path) {

    return this.readFASTA(fs.readFileSync(path).toString());

  };

  Seq.prototype.size = function() {
    return this.__length;
  };

  Seq.prototype.sequence = function() {

    var __bytesToProtein = __2BytesToProtein;
    var buffer = this.__buffer;

    if (buffer.byteLength < 4) {
      return '';
    }

    var dataArray = new Uint16Array(buffer);
    var len = (buffer.byteLength);

    var nts = makeArray(len);

    for (var i = 0; i < len; i++) {
      nts[i] = __bytesToProtein[dataArray[i]];
    }

    var returnString;

    returnString = nts.join('');

    if (returnString.includes("undefined")) {
      returnString = returnString.replace(/undefined/gi, '');
    }
    // if (returnString.includes("-")) {
    //   returnString = returnString.replace(/-/gi, '');
    // }


    return returnString.replace(/-/gi,'').replace(/_/gi,'');

  };
  // This Function retreives the buffer of a sequence type object
  Seq.prototype.getBuffer = function() {

    var buffer = this.__buffer;

    return buffer;

  };

  Seq.prototype.align = function(tBuffer) {


    var searchBuffer = this.__buffer;
    var queryBuffer = tBuffer;
    var result = 0;
    var tempResult = 0;
    var finalResult = 0;
    var index = 0;
    var searchView = new Int16Array(searchBuffer);
    var queryView = new Int16Array(queryBuffer);
    for (var i = 0; i < queryView.length; i++) {
      result = 0 ;
      for (var j = i; j < searchView.length; j++) {
          tempResult = compare(queryView[i],searchView[j]);

          if (tempResult == 3) {
            result = tempResult;
            // console.log(result);
            break;
          }

          else if (tempResult > result) {
            result = tempResult;
          }
          // console.log('No. of matches is : ' + result);
      }
      // console.log('Final Result before increment: ' + finalResult);
      finalResult += result;
      // console.log('Final Result after increment: ' + finalResult);
    };

    return finalResult;
  };

  var compare = function(num1, num2) {
    var matches = num1 ^ num2;
    var result = 0;
    matches |= matches >>> 1;
    matches |= matches >>> 1;
    matches |= matches >>> 2;
    matches = ~matches & 1057;
    matches |= matches >>> 4;
    matches |= matches >>> 4;
    matches = matches & 7;

    if (matches == 1 | matches == 2 | matches == 4) result = 1;
    else if (matches == 3 | matches == 6 | matches == 5) result = 2;
    else if (matches == 7) result = 3;
    else result = 0;
    // console.log('Result for comparing ' + __2BytesToProtein[num1] + "  -->" + num1 + " and " + __2BytesToProtein[num2] + "  -->" + num2  + " is: " + result );
    return result;
  };
  var sequence1 = seq1 || "";
  var sequence2 = seq2 || "";
  var a = new Seq().read1(sequence1);
  // console.log("Done Reading Sequence.");
  // console.log(a.sequence().length);

  var b = new Seq().read2(sequence2);
  // console.log("Done Reading Sequence.");
  // console.log(b.sequence().length);

  console.log("Starting the Comparison ...");

  console.time('align');
  var numberOfMatches = a.align(b.getBuffer());
  console.timeEnd('align');

  var res = {
    matches: numberOfMatches,
    seqAlignment: ""
  };
  return res;

  // console.log("Finished the Comparison");
  //
  // console.log("Maximum number of matches is " + res);

//Testing function Compare
  // console.log(compare(proteinTo2Bytes("AGC"),proteinTo2Bytes("TTA")));

};

module.exports = hydroGene;
