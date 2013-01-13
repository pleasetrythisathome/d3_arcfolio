<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title><?php bloginfo('name');?></title>

  <!-- Application styles. -->
  <link rel="stylesheet" href="<?php bloginfo('template_directory');?>/dist/release/index.css">

  <script src="<?php bloginfo('template_directory');?>/vendor/js/libs/modernizr.js"></script>

	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(
			['_setAccount', 'UA-37080472-1'],
		  ['_trackPageview']
		);
	</script>
</head>

<body>
  <img class="background" src='<?php bloginfo('template_directory');?>/assets/img/background/radialGradientBack.jpg'>
  <!-- Main container. -->
  <div role="main" id="main"></div>

  <!-- Application source. -->
  <script src="<?php bloginfo('template_directory');?>/dist/release/require.js"></script>

	<script type="text/javascript">
	  function getThemeDirectory() {
	    themeDirectory = '<?php bloginfo('template_directory');?>/'
	    apiDir = '<?php bloginfo('wpurl');?>/';
	    appRoot = apiDir.replace(window.location.origin, "");
	  }
	  getThemeDirectory();

	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();

  	var alertFallback = false;
		if (typeof console === "undefined" || typeof console.log === "undefined") {
			console = {};
			if (alertFallback) {
			   console.log = function(msg) {
			        alert(msg);
			   };
			} else {
			   console.log = function() {};
			}
		}
	</script>
</body>
</html>
