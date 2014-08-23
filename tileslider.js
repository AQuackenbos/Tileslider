var Tileslider = function()
{
	var self = this;
	this.version = 0.1;
	
	this.container = null;
	//user-defined options
	this.options = 
	{
		'tileWidth'		: 100,
		'tileHeight'	: 100,
		'gravity'		: 'off',
		'gravityPull'	: 0,
		'mode'			: 'manual',
		'delay'			: 2.5,
		'transition'	: 3,
		'showPrevious'	: true,
		'showNext'		: true,
		'showNavigation': true,
		'order'			: 'random',
		'loop'			: true,
		'strictHeight'	: false,
		'strictWidth'	: false,
		'partialTiles'	: true,
		'handleExtra'	: 'ignore',
		'startingImg'	: 0,
		'inactiveTiles'	: 0,
		'inactiveSeq'	: 'random',
		'inactiveColor' : '#000000',
		'simultaneous'	: 5
	};
	//calculated settings
	this.settings = 
	{
		'width'			: 0,
		'height'		: 0,
		'tilesH'		: 0,
		'tilesW'		: 0,
		'totalTiles'	: 0,
		'transition'	: 0,
		'currentImg'	: 0,
		'backSpin'		: 0,
		'inTransition'	: false
	};
	this.images = [];
	this.tiles = [];
	
	var ts = function Tileslider(container,options)
	{
		if(container instanceof String || typeof container == 'string')
		{
			container = document.querySelector(container);
		}
		
		self.container = container;
		self.options = self.extend(self.options,options);
		
		self.init();
		
		this.getImages = function() { return self.images; };
		this.getOptions = function() { return self.options; };
		this.getSettings = function() { return self.settings; };
		
		this.next = function() { return self.changeImage(self.settings.currentImg+1); };
		this.prev = function() { return self.changeImage(self.settings.currentImg-1); };
	}
	
	//Slider functions
	this.init = function(starting) 
	{
		//store images and remove them
		for(var c in this.container.childNodes)
		{
			if(this.container.childNodes[c].tagName != 'IMG')
			{
				continue;
			}
			
			this.images.push(this.container.childNodes[c].src);
			if(this.images.length == 1)
			{
				this.container.childNodes[c].onload = function(){
					self.settings.width = window.getComputedStyle(this).width.replace('px','');
					self.settings.height = window.getComputedStyle(this).height.replace('px','');
					self.createStructure(starting);
					self.removeElement(this);
				};
			}
			else
			{
				this.removeElement(this.container.childNodes[c]);
			}
		}
	}

	this.createStructure = function(starting)
	{
		//now create our tile array
		var startingImg = (starting ? starting : this.options.startingImg);
		this.settings.currentImg = startingImg;
		
		var imgUrl = this.images[startingImg];
		
		var tilesW,tilesH,width,height = 0;
		
		if(this.options.partialTiles)
		{
			width = this.options.strictWidth ? this.options.strictWidth : this.settings.width;
			height = this.options.strictHeight ? this.options.strictHeight : this.settings.height;
			
			tilesW = Math.ceil(width / this.options.tileWidth);
			tilesH = Math.ceil(height / this.options.tileHeight);
			
		}
		else
		{
			//use this.options.handleExtra to deal with the rest.  This may affect the HxW
			width = this.options.strictWidth ? this.options.strictWidth : this.settings.width;
			height = this.options.strictHeight ? this.options.strictHeight : this.settings.height;
			
			tilesW = Math.floor(width / this.options.tileWidth);
			tilesH = Math.floor(height / this.options.tileHeight);
		}
		
		if(tilesW * this.options.tileWidth != width && !this.options.strictWidth)
		{
			width = tilesW * this.options.tileWidth;
		}
		
		if(tilesH * this.options.tileHeight != width && !this.options.strictHeight)
		{
			height = tilesH * this.options.tileHeight;
		}
		
		//this.container.style['position']	= 'relative';
		this.container.style['perspective']			= 1000;
		this.container.style['width']				= width+'px';
		this.container.style['height']				= height+'px';
		this.container.style['background-image']	= 'url('+imgUrl+')';
		
		this.settings.tilesW = tilesW;
		this.settings.tilesH = tilesH;
		this.settings.totalTiles = (tilesW * tilesH)
		this.settings.transition = this.options.transition / (this.settings.totalTiles / this.options.simultaneous);
		this.settings.backSpin = -180;
		var row = col = 0;
		while(true)
		{
			//Flipping Mechanism CSS credit David Walsh: http://davidwalsh.name/css-flip
			var tile = this.createElement('div',{'className':'tile front'});
			tile.style['transform-style']		= 'preserve-3d';
			tile.style['position']				= 'relative';
			tile.style['float']					= 'left';
			tile.style['background-repeat']		= 'no-repeat';
			tile.style['width']					= this.options.tileWidth+'px';
			tile.style['height']				= this.options.tileHeight+'px';
			tile.style['transition']			= this.settings.transition+'s';
			
			var front = this.createElement('div',{'className':'fr'});
			front.style['z-index']				= 2;
			front.style['position']				= 'absolute';
			front.style['width']				= '100%';
			front.style['height']				= '100%';
			front.style['top']					= 0;
			front.style['left']					= 0;
			front.style['transition']			= this.settings.transition+'s';
			front.style['backface-visibility']	= 'hidden';
			front.style['background-repeat']	= 'no-repeat';
			front.style['background-image']		= 'url('+imgUrl+')';
			front.style['background-position']	= ((-1*this.options.tileWidth*col)%this.settings.width)+'px '+((-1*this.options.tileHeight*row)%this.settings.height)+'px';
			
			var back = this.createElement('div',{'className':'bk'});
			back.style['z-index']				= 1;
			back.style['position']				= 'absolute';
			back.style['width']					= '100%';
			back.style['height']				= '100%';
			back.style['top']					= 0;
			back.style['left']					= 0;
			back.style['transition']			= this.settings.transition+'s';
			back.style['backface-visibility']	= 'hidden';
			back.style['background-repeat']		= 'no-repeat';
			back.style['background-position']	= ((-1*this.options.tileWidth*col)%this.settings.width)+'px '+((-1*this.options.tileHeight*row)%this.settings.height)+'px';
			back.style['transform']				= 'rotateY('+this.settings.backSpin+'deg)';
			
			tile.appendChild(front); 
			tile.appendChild(back);
			this.container.appendChild(tile);
			this.tiles.push(tile);
			
			col++;
			if(col >= tilesW)
			{
				col = 0;
				row++;
			}
			if(row >= tilesH)
			{
				break;
			}
		}
		
		if(this.options.showNavigation)
		{
			this.initNav();
		}
	};
	
	this.initNav = function() 
	{
		if(this.options.showPrevious)
		{
			var prev = this.createElement('div',{'className':'prev'});
			prev.style['z-index']				= 5;
			prev.style['position']				= 'absolute';
			prev.style['bottom']				= '5%';
			prev.style['left']					= '5%';
			
			prev.addEventListener('click',function(){this.changeImage(this.settings.currentImg-1);}.bind(this),false);
			this.container.appendChild(prev);
		}
		
		if(this.options.showNext)
		{
			var next = this.createElement('div',{'className':'next'});
			next.style['z-index']				= 5;
			next.style['position']				= 'absolute';
			next.style['bottom']				= '5%';
			next.style['right']					= '5%';
			
			next.addEventListener('click',function(){this.changeImage(this.settings.currentImg+1);}.bind(this),false);
			this.container.appendChild(next);
		}
		
		//@todo add 'gallery' links as well?
	}
	
	this.changeImage = function(imgIdx)
	{
		if(this.inTransition)
		{
			return false;
		}
		
		this.inTransition = true;
		
		if(imgIdx < 0)
		{
			imgIdx = this.images.length-1;
		}
		
		if(imgIdx >= this.images.length)
		{
			imgIdx = 0;
		}
		
		var newface = 0;
		if(this.tiles[0].className.indexOf('front') != -1)
		{
			newface = 1;
		}
		
		var flipList = this.createRange(0,this.tiles.length-1);
		
		if(this.options.order == 'random')
		{
			flipList = this.shuffle(flipList);
		}
		
		this.settings.backSpin += 180;
		
		//begin flip sequence
		this.flipTile(imgIdx,newface,flipList);
		
		this.settings.currentImg = imgIdx;
		this.container.style['background-image'] = 'url('+this.images[imgIdx]+')';
	}
	
	this.flipTile = function(index,newface,remaining)
	{
		var t = remaining.pop();
	
		if(newface)
		{
			this.tiles[t].className = this.tiles[t].className.replace('front','back');
		}
		else
		{
			this.tiles[t].className = this.tiles[t].className.replace('back','front');
		}
		
		//@todo add inactive tiles code
		
		this.tiles[t].childNodes[newface].style['background-image'] = 'url('+this.images[index]+')';
		
		this.tiles[t].childNodes[0].style['transform'] = 'rotateY('+(this.settings.backSpin+180)+'deg)';
		this.tiles[t].childNodes[1].style['transform'] = 'rotateY('+(this.settings.backSpin)+'deg)';
		
		if(remaining.length)
		{
			setTimeout(function(){
				self.flipTile(index,newface,remaining);
			},(this.settings.transition*1000)/this.options.simultaneous);
		}
		else
		{
			this.inTransition = false;
		}
	}
	
	//Library functions
	this.createElement = function(t, o) 
	{
		var e = document.createElement(t);
		for(var _ in o) 
		{
			e[_] = o[_];
		}
		return e;
	};
	
	this.removeElement = function(e) {
		e.parentElement.removeChild(e);
	};
	
	this.createRange = function(min,max) {
		var ret = [];
		
		for(var i = min; i <= max; i++)
		{
			ret.push(i);
		}
		
		return ret;
	};
	
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	this.shuffle = function(o){ //v1.0
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	
	//Prototype.js
	this.extend = function(d, s) 
	{
		for (var p in s) 
		{
			if (s.hasOwnProperty(p)) 
			{
				d[p] = s[p];
			}
		}
		return d;
	};
	
	//return constructor
	return ts;
}();