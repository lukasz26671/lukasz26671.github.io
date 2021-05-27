$packaging_source = ".\unminified"
$packaging_destination = ".\dist"


function m-file($file, $out, $jscss) {
    minify "$packaging_source\$jscss\$file.$jscss" > "$packaging_destination\$jscss\$out.$jscss"
}

#js
m-file AudioPlayer AudioPlayer.min js
m-file main main.min js
m-file main2 main2.min js
m-file Redirect Redirect.min js
m-file swiped-events swiped-events.min js
m-file util util.min js

#css
m-file incl incl.min css
m-file main main.min css
m-file style style.min css
m-file styles styles.min css

