function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });
  
  slides.single_trial = slide({
    name: "single_trial",
    start: function() {
      $(".err").hide();
      $("span.context").text(exp.context);
    },
    button : function() {
      $(".err").hide();
      this.choice1 = $('input[name="choice-2"]:checked').val();
      this.choice2 = $('input[name="choice-3"]:checked').val();
      this.comment = $('textarea[name="comment-1"]').val();
      
      if (this.choice1 == undefined) {
        $("#err-1").show();
      } else if(this.choice2 == undefined) {
        $("#err-2").show();
      } else {
        this.log_responses();
        exp.go();
      }
    },
    log_responses : function() {
      exp.data_trials.push({
        "choice1" : this.choice1,
        "choice2" : this.choice2,
        "comment" : this.comment,
        "context" : exp.context,
      });
    }
  });

  
  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "system" : exp.system,
          "condition" : exp.context,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.context = _.sample(contexts);

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0",  "single_trial", 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
