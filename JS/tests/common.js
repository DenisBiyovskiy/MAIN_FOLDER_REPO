/*var arrays = [[1, 2, 3], [4, 5], [6]];
// Your code here.
var array = [];

array = arrays.reduce(function(arr1, arr2) {
	return arr1.concat(arr2);
});
// → [1, 2, 3, 4, 5, 6]
console.log(array);*/
var i = 0;
var obj = (function(){
	var totalyPrivate = function (callback) {
		// console.log("totalyPrivate");
	}
	return {
		someValue: "myValue",
		protectedIGues: function (callback) {
			//console.log("protectedIGues");
			//console.log(this);
			callback.call(this);
			totalyPrivate(publicTwo);
		}
	};
})();
/*var obj = {
	someValue: "myValue",
	protectedIGues: function (callback) {
		 console.log("protectedIGues");
		 callback.call(this);
		 totalyPrivate(publicTwo);
	},
	var totalyPrivate = function (callback) {
		 console.log("totalyPrivate");
	}
};*/

function publicOne (callback) {
	 console.log("publicOne");
	 obj.protectedIGues(publicTwo);
	 callback();
}

var publicTwo = function (callback) {
	console.log(this);
	console.log(typeof(totalyPrivate));
	 if(this.totalyPrivate){
	 	console.log("gotcha");
	 } else {
	 	console.log("nope");
	 }
	 //console.log("publicTwo " + i + " ");
	 i++;
}	

//publicOne(publicTwo);
obj.protectedIGues(publicTwo);