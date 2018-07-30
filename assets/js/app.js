
var socket = io();

var inputSequence = new Vue({
  el: "#vue-app",
  data: {
    job: "",
    email: "",
    seq: "",
    seq2: "",
    selected: "",
    arr: "",
    arr2: "",
    loading: false,
    result: false,
    matches: 0
  },
  methods: {

    alignment: function(seq) {
      var input = seq.split("\n");
      this.seq = input[0];
      this.seq2 = input[1];
      console.log("Sequence 1 :" + this.seq);
      console.log("Sequence 2 :" + this.seq2);
      var temp = this.seq;
      var temp2 = this.seq2;
      console.log("Temp : " + temp);
      console.log("Temp2 : " + temp2);
      var all = "";
      var all2 = "";
      // intialize all which is to reperesent allignment and all2 to reperesent matches
      for (i = 0; i < this.seq.length; i++) {
        all += "-";
      }
      for (i = 0; i < this.seq2.length; i++) {
        all2 += "0";
      }
      // split the two strings into array to change the characters inside
      this.arr = all.split("");
      this.arr2 = all2.split("");
      console.log(this.arr);
      console.log(this.arr2);
      inputSequence.comp(temp, temp2);
      this.result = true;
      console.log("The button was clicked");
    },


    comp: function(str1, str2) {
      //loop to loop over the number of words in the small string and perform allignment in each
      console.log("Entered Comp Function.");
      for (i = 0; i < Math.ceil(str2.length / 6); i++) {
        //substrr is the word that we compare with the large seq each iteration
        substrr = str2.substring(i * 6, (i * 6) + 6);
        var align = inputSequence.bestMatch(substrr, str1);
        //console.log(align.matc.toString());

        for (j = 0; j < substrr.length; j++) {
          if (align.matc[j] != 0) {
            this.arr[align.start + j] = substrr.charAt(j);
            this.arr2[align.start + j] = '1';
          }
        }
      }
    },


    bestMatch: function(substr,str){
      //starting and ending index of the Best match
        var start = 0;
        var end = 0;
        //number of matches in the best match
        var max = 0;
        //array containing matches and mismatches (0 if mismatch)
        var matc =[substr.length];
        var fina =[substr.length];
        var sum = 0;
        // console.log("first word:  "+ substr);
        for(l=0;l<str.length;l++){
          var c = 0;

            for(j=0;j<substr.length;j++){
                if(substr.charAt(j) == str.charAt(l+j)){
                    c++;
                    //console.log(c);
                    matc[j]= c;
                }
                else {
                  matc[j]= 0;
                }

            }
            //comparison to check if this iteration was better match than the last one.
            if (max < c){
                max = c;
                start = l;
                end = l+5;
                fina = matc.slice();

            }
                //console.log(fina.toString());
            //  console.log(end);
        }
        // object created to be returned to calling function
        var align = {
        max: max,
        start: start,
        end: end,
        matc: fina
      };
      //console.log(matc.toString());
      console.log("Maximum Alignment is : " + align.max);
      this.matches = align.max;
        return align;
    },
    another: function(){
      this.job = "";
      this.email = "";
      this.seq= "";
      this.result = false;
    }
  },
  computed: {
    map: function(){

    }
  }
});

var database = new Vue({
  el: "#vue-database",
  data: {
    database: "",
    sequences: [{
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      },
      {
        sequence: 'ACGACTAGCACGA'
      }
    ]
  },
  methods: {
    log: function() {
      console.log("Clicked :");
    }
  }
});


var about = new Vue({
  el: "#vue-about",
  data: {
    message: "This is a test welcome message that will be in the about section of the website, that i want to make it too long so that it can take a alot of space in the container. "
  }
});
