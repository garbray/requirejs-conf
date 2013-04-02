define(['libs/mootools'],'widgets/tweets', function() {
	/********************************
	Tweets
	*********************************/

	return new Class ({
		Implements: Options,
		options : {
			username:'bogotaJS',
			count: 4,
			include_entities:'true',
			include_rts : 'true',
			container: 'tweets-container'
		},
		Binds:['render'],
		/**
		* @initialize
		* Load crossbrowser json from twitter
		* options
		* username : acount twitter
		* count : number of tweets
		* the others is easy
		**/
		initialize: function(options){
			console.log('here');
			this.setOptions(options);
			var jp = new Request.JSONP({
				url: 'http://api.twitter.com/1/statuses/user_timeline.json',
				data : {
					count: 6,
					screen_name: 'garbray',
					include_entities: this.options.include_entities,
					include_rts: this.options.include_rts
				},
				onComplete: this.render
			}).send();
		},
		/**
		* @load 
		* data : comes from the callback of the twitter api
		* el : element who contains the tweets
		**/
		render: function(data){
			var result = data,
			tweets = [],
			node = $(this.options.container),
			numTweet=0,
			res, view, html;
			/*loop for walk through the tweets */
			for (var i = 0, len = result.length; i < len; i++) {
				res = result[i];
				tweets[i] = {
					'text': res.text, /* text of the tweet */
					'user': res.user.screen_name, /* username */
					'date': this.parseTweetTextDate(res.created_at) /* render date tweet */
				};
			}
			/* loop for add the tweets into a div inside of node */
			for(var i=0, len = tweets.length; i < len; i++){
				node.innerHTML += '<div class="content-msg" style='+(i==0?'"display: block"':'"display: none"')+'"><p class="text">'+this.renderTweet(tweets[i].text)+'</p></div>';
			}
			var cont = node.getElements('.content-msg');
			/* animation and time loop */
			setInterval(function(){
				cont[numTweet].dissolve();
				if(numTweet >= cont.length - 1) {
					numTweet = 0;
				}else {
					numTweet++;
				}
				cont[numTweet].reveal();
			}, 10000);/* time duration of tweet */
		},
		/**
		* @parseTweetTextDate
		* render date of the tweets
		**/
		parseTweetTextDate: function(date_text){
			var date_arr = date_text.split(" "),
				now = new Date(),
				tdate = new Date(date_arr[2] + " " + date_arr[1] + ", " + date_arr[3] + " " + date_arr[4] + " UTC");

			if (tdate.getDate() < (now.getDate() - 1)) {
				return tdate.getDate() + "/" + (tdate.getMonth() + 1) + "/" + tdate.getFullYear() + " " + (tdate.getHours() > 12 ? tdate.getHours() - 12 : tdate.getHours()) + ":" + (tdate.getMinutes() <= 9 ? '0' + tdate.getMinutes() : tdate.getMinutes()) + (tdate.getHours() > 12 ? "pm" : (tdate.getHours() == 12 ? "m" : "am"));
			} else {
				if (tdate.getDate() < now.getDate()) { //tdate.getDate() == (now.getDate()-1)
					return "Ayer"; /* can you change for your language */
				} else {
					if (tdate.getHours() === now.getHours()) {
						return "Ahora";
					} else {
						return "Ago " + (now.getHours() - tdate.getHours()) + " horas";
					}
				}
			}
		},
		renderTweet:function(tweet){
			tweet = tweet.replace(/@\w+/g, function(data){ 
				return '<span>'+data+'</span>';
			});
			tweet = tweet.replace(/#\w+/g, function(data){ 
				return '<span>'+data+'</span>';
			});
			tweet = tweet.replace(/https?:\/\/\w+\.\w+\/\w+/g, function(data){ 
				return '<a href='+data+' target="_blank">'+data+'</a>';
			});
			return tweet;
		}
		
	});
/* end class tweets */
});