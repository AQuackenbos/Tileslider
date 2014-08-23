Tileslider
==========

A javascript image slider with tiles

## Usage

    var slider = new Tileslider('#selector',{/* options */});

Required Markup:

    <element id="selector"><img/><img/>...<img/></element>

Takes images found in the container, using the first as a size guide (unless a strictWidth/strictHeight is set), then creates tiles to use as a transition feature.  Should work in most surrounding markup but has not been tested yet.

## Release Notes

v0.1 / 2014 Aug 22
Initial release.  "Functions".

## Options

* *tileWidth*: Width of the tiles created.  Default: 100
* *tileHeight*: Height of the tiles created.  Default: 100
* *gravity*: Whether or not the tiles have a gravitation pull.  **Not yet implemented**.  Default: 'off'
* *gravityPull*: Strength of gravitation pull.  **Not yet implemented**.  Default: 0
* *mode*: Transition mode ('manual' or 'auto').  **Not yet implemented**. Default: 'manual'
* *delay*: Delay in 'auto' mode, in seconds.  **Not yet implemented**. Default: 2.5
* *transition*: Length of transition, in seconds. Default: 3
* *showPrevious*: Whether to show the 'Previous' button.  Default: true
* *showNext*: Whether to show the 'Next' button.  Default: true
* *showNavigation*: Whether to disable the navigation area entirely.  Supercedes *showPrevious* and *showNext*.  Default: true
* *order*: The order in which tiles should flip.  **Only 'random' fully configured.**.  Default: 'random'
* *loop*: Whether the last picture should loop to the first.  **Not yet implemented**. Default: true,
* *strictHeight*: An absolute height to use instead of calculating it.  False or an integer.  Default: false
* *strictWidth*: An absolute width to use instead of calculating it.  False or an integer.	Default: false,
* *partialTiles*: Whether incomplete edges should act as tiles.  Default: true
* *handleExtra*: How to handle incomplete edges ('ignore', 'remove', 'color').  **Not yet implemented**. Default:'ignore'
* *startingImg*: Index of the image to start with.  Default: 0
* *inactiveTiles*: Number of tiles to randombly become 'inactive' during a transition.  **Not yet implemented**. Default: 0
* *inactiveSeq*: Sequence to select inactive tiles with ('random' or a list of indexes).  **Not yet implemented**. Default:'random'
* *inactiveColor*: Color for inactive tiles.  **Not yet implemented**.  Default:'#000000'
* *simultaneous*: Number of tiles that will be simultaneously flipping.  Default: 5


## Known Issues
* Most settings do nothing right now
* Math does not always work out properly for some combinations of simultenous tiles flipping and finishing the transition at the desired time.
* Small tiles result in sluggishness
