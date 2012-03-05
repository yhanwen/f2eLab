<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
		Remove this if you use the .htaccess -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<title>cavasDraw</title>
		<meta name="description" content="" />
		<meta name="author" content="杨翰文" />
		<meta name="viewport" content="width=device-width; initial-scale=1.0" />
		<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
		<link rel="shortcut icon" href="/favicon.ico" />
		<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
		<script type="text/javascript" src="base.js"></script>
	</head>
	<body>
		<div>
			<header>
				<h1>cavasDraw</h1>
			</header>
			<div>
				<form action="upload.php" enctype="multipart/form-data" method="post">
					<input type="file" name="myfile" id="test" />
				</form>
				<img src="pic01.jpg" alt="" />
				<script type="text/javascript">
					
					getImages();
				</script>
			</div>
			<footer>
				<p>
					&copy; Copyright  by 杨翰文
				</p>
			</footer>
		</div>
	</body>
</html>
