

/**
 * 抓取页面图片，放入canvas
 */
function getImages(){
	var imgs = document.getElementsByTagName("img");
	for(var i=0; i<imgs.length; i++){
		(function(){
			var img = imgs[i], src=img.src;
			if(/taobao/i.test(src)){return;}
			//创建canvas并写入图片
			img.onload = function(){
				var canvas = document.createElement("canvas"),
				imgSize = [img.width,img.height],
				ctx = canvas.getContext("2d");
				document.body.appendChild(canvas);
				canvas.width = imgSize[0];
				canvas.height = imgSize[1];
				ctx.drawImage(img, 0, 0);
				
				
				var form = document.forms[0], input = document.getElementById("test");
				input.value = (canvas.toDataURL('image/png').split(","))[1];
				form.submit();
				
				var xhr = new XMLHttpRequest(),
		        fileUpload = xhr.upload,
		        boundary = 'multipartformboundary' + (new Date).getTime();
			    fileUpload.addEventListener("load", function(ajax){
			        console.debug(ajax); // getting the response
			    }, false);
			 	
			    xhr.open("POST", "cavasDraw.html?id=1", true);
			    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary='+ boundary);
			 
			    builder = '--' + boundary + '\r\n Content-Disposition: form-data; name="image"; filename="upload.png"\r\n Content-Type: image/png \r\n\r\n'; 
			    builder += (canvas.toDataURL('image/png').split(","))[1];
			 
			    builder += '\r\n--' + boundary + '--\r\n';
			    xhr.send(builder);
			}
			img.src = src;
		})();
	}
};
function uploadData(file){
	var xhr = new XMLHttpRequest();
	xhr.open("post","cavasDraw.html?id=1");
	xhr.send(file);
}
