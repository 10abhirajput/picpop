<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<?php
		//$product_id = $_GET['product_id'];
		// $CarID = base64_decode($car_id);

		// $sender_id = $_GET['sender_id'];
		// $SenderID = base64_decode($sender_id);

		//Detect special conditions devices
		$iPod = stripos($_SERVER['HTTP_USER_AGENT'], "iPod");
		$iPhone = stripos($_SERVER['HTTP_USER_AGENT'], "iPhone");
		$iPad = stripos($_SERVER['HTTP_USER_AGENT'], "iPad");
		$Android = stripos($_SERVER['HTTP_USER_AGENT'], "Android");
		$webOS = stripos($_SERVER['HTTP_USER_AGENT'], "webOS");
		$window = stripos($_SERVER['HTTP_USER_AGENT'], "Gecko");

		if (strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') && !strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
			$iPhone = strpos($_SERVER['HTTP_USER_AGENT'], 'Safari');
		}

		//$android_app_link = "intent://view/#Intent;package=com.CeedPage;end";
		// $android_app_link = "market://details?id=com.elitem.carswap.me";
		// $android_app_link = "https://play.google.com/store/apps/details?id=com.salameh";
		$android_app_link = "market://details?id=com.mypicpop";
		// $ios_app_link = "com.serra.mender://";


		// $android_app_link = "market://details?id={$android_id}&sender_id={$SenderID}";
		// $ios_app_link = "com.live.magknit://details?sender_id={$SenderID}";
		
		//$android_app_link = "intent://host/#Intent;scheme=ceedpage;package=com.CeedPage;end";
		//$android_app_link = "https://play.google.com/store/apps/details?id=com.CeedPage&hl=en";
		// $ios_app_link = "CarSwap://sender_id={$SenderID}\&car_id={$CarID}";
		// $ios_app_link = "roomerresume://details?id=1392857337&product_id={$product_id}";

		
		// pr($android_app_link); die;
	

		$app_id = '1459964101';
		// $app_id = '1504847194';
		// $play_store_link = "https://play.google.com/store/apps/details?id=com.salameh";
		$play_store_link = "https://play.google.com/store/apps/details?id=com.mypicpop";
		// $app_store_link = "https://apps.apple.com/us/app/salameh/id1481548048?ls=1";
		$app_store_link = "https://apps.apple.com/in/app/mender-app/id1459964101";
		// $app_store_link = "https://itunes.apple.com/us/app/roomerresume/id{$app_id}?ls=1&mt=8";
		echo "<title>Please wait... Mender App</title>";
		$app_link = $iPod || $iPhone || $iPad ? $ios_app_link : ($Android ? $android_app_link : $ios_app_link);
		$store_link = $iPod || $iPhone || $iPad ? $app_store_link : ($Android ? $play_store_link : $app_store_link);
		?>

		<meta property="al:ios:url" content="<?php echo $app_link; ?>" />
		<meta property="al:android:url" content="<?php echo $app_link; ?>" />

		<meta property="al:ios:app_store_id" content="1504847194" />
		<meta property="al:ios:app_name" content="Mender App" />
		<meta property="og:title" content="Mender App" />
		<meta property="og:type" content="Mender App" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width,minimum-scale=1.0, maximum-scale=1.0" />

		<!--<meta property="al:web:should_fallback" content="true" />
		<hta:application applicationname="HTA Test" scroll="yes" singleinstance="yes">
			implement javascript on web page that first first tries to open the deep link
			1. if user has app installed, then they would be redirected to open the app to specified screen
			2. if user doesn't have app installed, then their browser wouldn't recognize the URL scheme
			and app wouldn't open since it's not installed. In 1 second (1000 milliseconds) user is redirected
			to download app from app store.
		-->
		<script>


			(function () {
				var app = {
					launchApp: function () {
						//var shell = new ActiveXObject("WScript.Shell");
						//shell.run('Firefox <?php echo $app_link; ?>');
						//window.open('android-app://com.CeedPage',"_self");
						window.parent.location.href = '<?php echo $app_link; ?>';
						// window.open(<?php echo $app_link; ?>,'_system');
						//window.open('<?php echo $app_link; ?>','_blank');
//location.assgin('<?php echo $store_link ?>');
						//alert('Waiting to close the dialog');
						setTimeout(this.openWebApp, 1000);

						//setTimeout();
					},
					openWebApp: function () {
						//alert('App not installed. Redirecting to URL instead
						//location.assgin('<?php echo $store_link ?>');
						window.parent.location.href = "<?php echo $store_link ?>";
					}
				};
				//setTimeout(function(){document.location.href = "<?php echo $app_link; ?>;"},100);
				setTimeout(app.launchApp(), 100);
				//app.launchApp();
			})();
		</script>
	</head>
	<body>

		<!-- button to Download App for new app users -->
		<form action="<?php echo $app_store_link ?>" target="_blank">
			<input type="submit" style="display: none;" value="Download Mender App" />
		</form>

		<!-- button to Open App to specific screen for existing app users -->
		<form action="<?php echo $app_link; ?>" target="_blank">
			<input type="submit" style="display: none;" value="Open Mender App" />
		</form>

	</body>
</html>