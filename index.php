<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title><?php bloginfo('name');?></title>

  <!-- Application styles. -->
  <link rel="stylesheet" href="<?php bloginfo('template_directory');?>/app/styles/index.css">

  <script src="<?php bloginfo('template_directory');?>/vendor/js/libs/modernizr.js"></script>
</head>

<body>
  <img class="background" src='<?php bloginfo('template_directory');?>/assets/img/background/radialGradientBack.jpg'>
  <!-- Main container. -->
  <div role="main" id="main"></div>

  <script type="text/javascript">
    function getThemeDirectory() {
      themeDirectory = '<?php bloginfo('template_directory');?>/'
      apiDir = '<?php bloginfo('wpurl');?>/';
      appRoot = apiDir.replace(window.location.origin, "");
    }
    getThemeDirectory();
  </script>

  <!-- Application source. -->
  <script data-main="<?php bloginfo('template_directory');?>/app/config" src="<?php bloginfo('template_directory');?>/vendor/js/libs/require.js"></script>
</body>
</html>
