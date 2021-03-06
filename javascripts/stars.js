(function() {
	'use strict';

	var scene, camera, renderer;

	var container, aspectRatio,
		HEIGHT, WIDTH, fieldOfView,
		nearPlane, farPlane,
		mouseX, mouseY, windowHalfX,
		windowHalfY, stats, geometry,
		starStuff, materialOptions, stars;

	init();
	animate();

	function init() {
		container = document.createElement('div');
		container.setAttribute("id", 'stars-container')
		document.body.appendChild( container );
		document.body.style.overflow = 'auto';

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		aspectRatio = WIDTH / HEIGHT;
		fieldOfView = 75;
		nearPlane = 1;
		farPlane = 1000;
		mouseX = 0;
		mouseY = 0;

		windowHalfX = WIDTH / 2;
		windowHalfY = HEIGHT / 2;

		camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

		//Z positioning of camera

		camera.position.z = farPlane / 2;
		
		scene = new THREE.Scene({antialias:true});
		scene.fog = new THREE.FogExp2( 0x000000, 0.0003 );

		// The wizard's about to get busy.
		starForge();
		
		//check for browser Support
		if (webGLSupport()) {
			//yeah?  Right on...
			renderer = new THREE.WebGLRenderer({alpha: true});

		} else {
			//No?  Well that's okay.
			renderer = new THREE.CanvasRenderer();
		}

		renderer.setClearColor(0x000011, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize( 1400, 805 );
		container.appendChild(renderer.domElement);

		// stats = new Stats();
		// stats.domElement.style.position = 'absolute';
		// stats.domElement.style.top = '0px';
		// stats.domElement.style.right = '0px';
		// container.appendChild( stats.domElement );

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onMouseMove, false );
		
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
		// stats.update();
	}


	function render() {
		camera.position.x += ( mouseX - camera.position.x ) * 0.005;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.005;
		camera.lookAt( scene.position );
		renderer.render(scene, camera);
	}

	function webGLSupport() {
		/* 	The wizard of webGL only bestows his gifts of power
			to the worthy.  In this case, users with browsers who 'get it'.		*/

		try {
			var canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
			);
		} catch(e) {
			// console.warn('Hey bro, for some reason we\'re not able to use webGL for this.  No biggie, we\'ll use canvas.');
			return false;
		}
	}

	function onWindowResize() {
		// Resize 
	  	var WIDTH = window.innerWidth,
	  		HEIGHT = window.innerHeight;

	  	camera.aspect = aspectRatio;
	  	camera.updateProjectionMatrix();
	  	renderer.setSize(1400, 805);
	}

	function starForge() {
		var starQty = 45000;
			geometry = new THREE.SphereGeometry(1000, 100, 50);

	    	materialOptions = {
	    		size: 1.0, //I know this is the default, it's for you.  Play with it if you want.
	    		transparency: true, 
	    		opacity: 0.7
	    	};

	    	starStuff = new THREE.PointCloudMaterial(materialOptions);

		// The wizard gaze became stern, his jaw set, he creates the cosmos with a wave of his arms

		for (var i = 0; i < starQty; i++) {		

			var starVertex = new THREE.Vector3();
			starVertex.x = Math.random() * 2000 - 1000;
			starVertex.y = Math.random() * 2000 - 1000;
			starVertex.z = Math.random() * 2000 - 1000;

			geometry.vertices.push(starVertex);

		}


		stars = new THREE.PointCloud(geometry, starStuff);
		scene.add(stars);
	}

	function onMouseMove(e) {

		mouseX = e.clientX - windowHalfX;
		mouseY = e.clientY - windowHalfY;
	}	

})();