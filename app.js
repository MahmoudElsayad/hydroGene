var socket = io.connect();

var inputSequence = new Vue({
  el: "#vue-app",
  data: {
    job: "",
    email: "",
    seq: "",
    seq2: "",
    expertSeq: "",
    expertResult: "Results",
    selected: "",
    loading: false,
    result: false,
    advanced: false,
    alignmentSelected: false,
    welcome: "",
    matches: 0,
    numberOfMatches: 0,
    timeTaken: 0,
    score: 0,
    dp: false,
    warning:false,
    intro1: 0,
    intro2:0
  },
  created: function() {
    // socket.on('User Joined', function(socketId) {
    //   this.welcome = "New User joined with ID: " + socketId;
    // }.bind(this));

    socket.on('dp.result', function(result){
      this.matches = result;

      var m = msa({
        	el: "#msaResult",
          colorscheme: {"scheme": "No color"}
        });
        m.seqs.add({seq: this.matches.seq1});
        m.seqs.add({seq: this.matches.seq2});
        m.render();

        var defMenu = new msa.menu.defaultmenu({
          el: menuDiv,
          msa: m
        });
        defMenu.render();

        this.numberOfMatches = this.matches.result;
        this.score = this.matches.score;
        console.log(this.matches.score);
        this.dp = true;
        this.loading = false;
        this.result = true;

    }.bind(this));

    socket.on('word.result', function(result){
      this.dp = false;
      this.matches = result;

      var m = msa({
        	el: "#msaResult",
          colorscheme: {"scheme": "No color"}
        });
        m.seqs.add({seq: this.matches.seqAlignment1});
        m.seqs.add({seq: this.matches.seqAlignment2});
        m.render();

        var defMenu = new msa.menu.defaultmenu({
          el: menuDiv,
          msa: m
        });
        defMenu.render();

        this.numberOfMatches = result.matches;
        this.loading = false;
        this.result = true;

    }.bind(this));


    socket.on('bitwiseOp.result', function(result){
      this.dp = false;

      this.matches = result;
      console.log(result);
      var m = msa({
        	el: "#msaResult",
          colorscheme: {"scheme": "No color"}
        });
        m.seqs.add({seq: result.seqAlignment1});
        m.seqs.add({seq: result.seqAlignment2});
        m.render();

        var defMenu = new msa.menu.defaultmenu({
          el: menuDiv,
          msa: m
        });
        defMenu.render();

        this.numberOfMatches = result.matches;
        this.loading = false;
        this.result = true;

    }.bind(this));
    socket.on('bitwise.result', function(result){
      this.dp = false;

      this.matches = result;
      console.log(result);
      var m = msa({
        	el: "#msaResult",
          colorscheme: {"scheme": "No color"}
        });
        m.seqs.add({seq: result.seqAlignment1});
        m.seqs.add({seq: result.seqAlignment2});
        m.render();

        var defMenu = new msa.menu.defaultmenu({
          el: menuDiv,
          msa: m
        });
        defMenu.render();

        this.numberOfMatches = result.matches;
        this.loading = false;
        this.result = true;

    }.bind(this));


    socket.on('alignment.error', function (message){
      this.matches = message ;
      this.result = true;
    }.bind(this));

    socket.on('advanced.result', function(result){
      this.expertResult = result;
    }.bind(this));

  },
  methods: {

    send: function(){
      if (this.selected == 'hydroGene Bitwise Alignment Optimized') {
        socket.emit('bitwiseOp.message', this.seq);
        console.log("Emitted: " + this.seq);
        this.loading = true;
      }
      else if (this.selected == 'Dynamic Programming Algorithm') {
        socket.emit('dp.message', this.seq);
        console.log("Emitted: " + this.seq);
        this.loading = true;
      }
      else if (this.selected == 'Word Method Algorithm') {
        socket.emit('word.message', this.seq);
        console.log("Emitted: " + this.seq);
        this.loading = true;
      }
      else if (this.selected == 'hydroGene Bitwise Alignment') {
        socket.emit('bitwise.message', this.seq);
        console.log("Emitted: " + this.seq);
        this.loading = true;
      }
      else {
        this.alignmentSelected = true;
        this.warning = true;
        console.log("Emitted: " + "Alignment wasn't chosen");
      }
      var input = this.seq.split("\n");
      this.seq = input[0];
      this.seq2 = input[1];
    },
    another: function() {
      this.job = "";
      this.email = "";
      this.seq = "";
      this.result = false;
      this.advanced = false;
      this.alignmentSelected = false;
      this.warning = false;

    },
    expert: function(){
      this.result = false;
      this.advanced = true;
      this.alignmentSelected = false;
    },
    checkType: function(){
      socket.emit("checkType.seq", this.expertSeq);
    },
    translate: function(){
      socket.emit("translate.seq", this.expertSeq);
    },
    codon: function(){
      socket.emit('codon.seq', this.expertSeq);
    },
    introns: function(){
      var input = this.expertSeq.split("\n");
      socket.emit('introns.seq', input[0],input[1],input[2]);
    }

  }
});

var database = new Vue({
  el: "#vue-database",
  data: {
    database: "",
    search: ['bioproject','biosample','biosystems','gene','genome','ncbisearch','protein','nucest'],
    terms: "",
    results: [],
    tempResult: ''
  },
  created: function(){
    socket.on('navigate.result', function(data){
      console.log(data.id + " --- " + data.seq);
      this.tempResult = {'id': data.id , 'seq': data.seq};
      this.results.push(this.tempResult);
      this.tempResult = "";
      // console.log(this.results[0]);
    }.bind(this));
  },
  methods: {
    log: function() {
      console.log("Clicked :");
    },

    navigate: function(){
      var data = this.database + "," + this.terms;
      socket.emit('navigate.db',data);
      console.log("send DB name and search terms to the server. ");
    }
  }
});


var about = new Vue({
  el: "#vue-about",
  data: {
    message: "We hope that what we are offering a good service for the community of Bioinformatics, and that our work to be appreciated, and used to help in the scientific research, and academic use. "
  }
});
