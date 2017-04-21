  window.onload = function() {

    function Pixel (r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }

    function obj_list(flat_array) {
      var new_obj = [];
      var len = flat_array.length;
      for(var i = 0; i < len; i += 4) {
        new_obj.push(new Pixel(
            flat_array[i],
            flat_array[i + 1],
            flat_array[i + 2],
            flat_array[i + 3]
          ));
      }

      return new_obj
    }

    function imageLoaded(ev) {
        var element = document.getElementById("myCanvas");
        var c = element.getContext("2d");

        // read the width and height of the canvas
        element.width = this.width;
        element.height = this.height;
        var width = this.width;
        var height = this.height;

        // stamp the image on the left of the canvas:
        c.drawImage(im, 0, 0);

        // get all canvas pixel data
        var imageData = c.getImageData(0, 0, width, height);
        var oldImageData = imageData.data;
        var old_pixelSequence = obj_list(imageData.data)

        //process
        // var new_pixelSequence = bubblesort(old_pixelSequence, "g");
        // imageData.data.set(unwrap(new_pixelSequence));
        var new_pixelSequence = channel_shuffle(old_pixelSequence, width);
        // var test = sort_some(new_pixelSequence);
        imageData.data.set(unwrap(new_pixelSequence));
        c.putImageData(imageData, 0, 0);
    }

    function bubblesort(list, channel) {
      list.sort(function(a, b) {
        if(a[channel] > b[channel]) {
          return 1;
        }

        if (a[channel] < b[channel]) {
          return -1;
        }

        return 0;
      });

      return list
    }

    function channel_shuffle(list, width) {

      var dark =  {};
      var light = {};
      sort_some(list, dark, light);
      var len = list.length;
      for(var i = 0; i < len; i++) {

        //simple swap
        if(i+3 < len) {
          if(list[i].b > list[i+3].g) {
            var temp_var = list[i].b;
            list[i].b = list[i+3].g;
            list[i+3].g = temp_var;
          }
        }

        //comparison
        if (list[i].g > list[i].b) {
          list[i].r = list[i].a;
        } else {
          list[i].b = list[i].g;
        }

        //ranges
        if((list[i].r > 200) && (list[i].r < 255)) {
          list[i].r = 40;
          list[i].g = 100;
          list[i].b = 200;
        }

        //gray scaling
        var avg = ((list[i].r + list[i].g + list[i].b)/3);

        if(avg < list[i].r) {
          list[i].b = avg;
        }

        //check if this pixel is in light/dark list
        if(i in light) {

          list[i].r = 0;
          if(i-15 > len) {
            list[i-15].b = list[i+3].b + 35;
          }
        }

        else if(i in dark) {
          list[i].g = 255;
          list[i].r = 0;
          list[i].b += 25;
          //shift pixels
          if(i-30 < len) {
            list[i-30] = list[i];
          }
        }

      }
      return list
    }

    function sort_some(list, dark, light) {

      //select pieces of the list based off of dark or lightness
      var len = list.length;
      for(var i = 0; i < len-1; i++) {

        var bright = brightness(list[i].r,list[i].g,list[i].b);
        if(bright <= 100) {
          light[i] = 1;
          // list[i].r = 50;
          // list[i].g = list[i].g + 40;
          // list[i].b = 255;
        }
        if(bright >= 200) {
          dark[i] = 1;
        }

      }
    }

    function brightness(r, g, b) {
      r = (r*r*0.241);
      g = (g*g*0.691);
      b = (b*b*0.068);
      var brightness = Math.floor(Math.sqrt(r+g+b));
      return brightness
    }

    function unwrap(data) {
      unwrapped_list = [];
      var len = data.length;
      for(var i = 0; i < len; i++) {
        unwrapped_list.push(data[i].r);
        unwrapped_list.push(data[i].g);
        unwrapped_list.push(data[i].b);
        unwrapped_list.push(data[i].a);
      }

      return unwrapped_list
    }


    im = new Image();
    im.onload = imageLoaded;
    im.src = "bees.jpg"; 
  };