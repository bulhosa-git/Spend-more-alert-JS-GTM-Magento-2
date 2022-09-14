//Cart Free Shipping
//Init vars
var cfsActive = true; 
var cfsValue = 19.99;

//Language
var lang = "pt";
if(location.href.includes("/es/")) { lang = "es"; }

if(lang == "pt") {
    var msgCFS = "Faltam {EUROS}€ para teres portes grátis";
} else {
    var msgCFS = "Faltan {EUROS}€ para envío gratis";
}

//Init
//Wait for DOM content to be ready
if( document.readyState !== 'loading' ) {
    //console.log("Document is already ready");
    //Run script
    cartFS();
    
} else {
    //console.log("Document was not ready");
    window.addEventListener("load", function () {
        //console.log("Document is now ready");
        //Run script
        cartFS();
    });
}

function cartFS() {
	if(!cfsActive) { return false; }
	cacheCFS();

	//StorageEvent won't work so listening for clicks instead ;-)
	var cacheCFSAuxTimeout;
	document.addEventListener('click', cacheCFSHandler = function() {
		clearTimeout(cacheCFSAuxTimeout);
		console.log("Click!");

		//Wait for Magento to update DOM (1500)
		cacheCFSAuxTimeout = setTimeout(function() {
			clearTimeout(cacheCFSAuxTimeout);
    		cacheCFS();
		}, 1500);
	});
}

function cacheCFS() {
	//Wait for Magento to update DOM (1500)
	setTimeout(function() {
		var cacheMageObject = localStorage.getItem("mage-cache-storage");

		if(cacheMageObject === null) {
			console.log("localStorage [cacheMageObject] not found");
			return false;
		} else {
			//Proceed
			cacheMageObject = JSON.parse(cacheMageObject);

			if(!cacheMageObject.hasOwnProperty("cart")) {
				console.log("localStorage [cart] not found");
				return false;
			} 

			if(!cacheMageObject.cart.hasOwnProperty("subtotalAmount")) {
				console.log("localStorage [subtotalAmount] not found");
				return false;
			} 

			//Get subtotalAmount
			var cacheSubtotal = cacheMageObject.cart.subtotalAmount;
			console.log("Cart total: " + cacheSubtotal);

			//Apagou carrinho
			if(cacheSubtotal == 0) {
				console.log("Carrinho vazio :-(");
				return false;
			}

			var fsCartExists = document.querySelector("p.fsCart");

			if(parseFloat(cacheSubtotal) < cfsValue) {
	        	var spendMore = parseFloat(parseFloat(cfsValue) - parseFloat(cacheSubtotal)).toFixed(2);

	        	if(Number.isInteger(parseFloat(spendMore))) {
	        		spendMore = parseInt(spendMore);
	        	}

	        	//Replace placeholder
	        	msgCFS = msgCFS.replace("{EUROS}", spendMore);

	        	//Escreve
	        	if(fsCartExists) {
	        		//Update
	        		fsCartExists.innerHTML = "<p class=\"fsCart\">" + msgCFS + "</p>";
	        	} else {
	        		var btnWrapper = document.querySelector(".columns .column.main");
	        		btnWrapper.insertAdjacentHTML('beforeend', "<p class=\"fsCart\">" + msgCFS + "</p>");
	        	}
	        	console.log(msgCFS);
	    	} else {
	    		//Escreve
	        	if(fsCartExists) { fsCartExists.innerHTML = ""; }
	    	}
	    }
    }, 1500);
}