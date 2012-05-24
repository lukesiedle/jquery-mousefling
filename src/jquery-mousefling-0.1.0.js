
/*
 *	@version
 *	0.1.0
 *	
 *	@author
 *	Luke Siedle
 *	http://lukesiedle.me
 *	https://github.com/luke-siedle/jquery-mousefling
 *
 *	@license
 *	FreeBSD Licensed
 *
 *	@description
 *	Mousefling allows you to measure
 *	the power of a mouse movement
 *	when dragging.
 *
 *	@requires
 *	jQuery 1.4 or above
 *
 *	@options
 *	onFling		-	fires when fling completes
 *					returns X and Y percentages indicating
 *					strength of fling.
 *					
 *	threshold	-	float that specifies the number of
 *					pixels per ms that would indicate 100% power
 *
 *	minTravel	-	optional object specifying minimum
 *					travelling distance of x and y,
 *					
 */

( function( $ ){
	
	$.fn.mousefling = function( opts, threshold, minTravel ){

		var plugin = function( opts, $el ){

			// Initialize the methods //
			init.call( this );

			// Construct //
			this.construct();

			function init(){

				// Construction //

				/*
				 *	Arguments yielded in different
				 *	ways to allow for the short syntax
				 *	capability.
				 */

				this.construct = function(){
					this.opts	= $.extend( {}, this.defaults, opts );
					this.el		= $el;

					if( typeof(opts) == 'function' ){
						this.opts.onFling = opts;
						if( threshold ){
							this.opts.threshold = threshold;
						}
						if( minTravel ){
							this.opts.minTravel = minTravel;
						}
					}
					
					this.bindEvents();
				}
				
				// DOM events //

				this.bindEvents	= function(){
					var con = this;
					$el.mousedown(function( e ){
						con.event.mousedown.call( con, e );
					});
					$( document ).mouseup(function( e ){
						con.event.mouseup.call( con, e );
					});
				}

				this.event		= {
					mouseup		: function( e ){
						if( this.dragging ){
							this.dragging = false;
							this.end( e.pageX, e.pageY );
						}
					},
					mousedown	: function( e ){
						if( !this.dragging ){
							this.start( e.pageX, e.pageY );
						}
						this.dragging = true;
					}
				};

				// Starts fling //

				this.start		= function( x, y ){
					this.startX = x;
					this.startY = y;
					this.startTime	= new Date().getTime();
				}

				// Ends fling //

				this.end		= function( x, y ){
					this.endX	= x;
					this.endY	= y;
					this.endTime	= new Date().getTime();
					this.setPower();
				}

				// Calculates power //

				this.setPower	= function(){

					this.distX	= this.endX - this.startX;
					this.distY	= this.endY - this.startY;

					if( this.distX < 0 ){
						this.distX = - this.distX;
					}

					if( this.distY < 0 ){
						this.distY = - this.distY;
					}

					var cont	= true, travel = this.opts.minTravel;
					if( this.opts.minTravel ){
						if( travel.x && this.distX < travel.x ){
							cont = false;
						}
						if( travel.y && this.distY < travel.y ){
							cont = false;
						}
					}

					if( !cont ){
						return;
					}

					if( this.distX > this.el.width() ){
						this.distX = this.el.width();
					}

					if( this.distY > this.el.height() ){
						this.distY = this.el.height();
					}

					this.time				= this.endTime - this.startTime;
					this.powerX				= (this.distX * this.opts.threshold) / this.time * 100;
					this.powerY				= (this.distY * this.opts.threshold) / this.time * 100;

					if( this.opts.onFling ){
						this.opts.onFling.call( this, Math.round(this.powerX), Math.round(this.powerY) );
					}
				}

				this.defaults			= {
					threshold			: 0.4
				}

			}

		};

		return this.each( function(){
			var $each = $( this );
			$each.data('fling', new plugin( opts, $each ) );
		});
	}
	
})( jQuery );