
        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
            center: [campground.geometry.coordinates[0],campground.geometry.coordinates[1]], // starting position [lng, lat]
            zoom: 4, // starting zoom
            projection: 'globe' // display the map as a 3D globe
        });

        new mapboxgl.Marker()
        .setLngLat([campground.geometry.coordinates[0],campground.geometry.coordinates[1]])
        .setPopup(
            new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h2>${campground.title}</h2><h6>${campground.location}</h6>`
            )
        )
        .addTo(map)
        map.addControl(new mapboxgl.NavigationControl());


        // map.on('style.load', () => {
        //     map.setFog({}); // Set the default atmosphere style
        //     });
