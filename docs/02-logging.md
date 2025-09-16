# JS Live API » #2 Logging & Debugging

> Attribution: Content adapted from Adam Murray’s “JS in Live” tutorials, licensed under CC BY-NC-SA 4.0. Original: https://adammurray.link/max-for-live/js-in-live/ — Changes have been made. Not endorsed by Adam Murray or Cycling '74. License: https://creativecommons.org/licenses/by-nc-sa/4.0/

This is the 2nd of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article we'll iteratively build some utility code for logging that will be useful for debugging purposes in all our projects. This will be a good practice session for coding JavaScript inside Ableton Live.

If you're eager to start hacking on Live ASAP and don't care about how this logging/debugging stuff works, you can skip ahead to the next article.

If you aren't sure how to get started, try the 1st article in this series.

## Getting to know post()

Max's JavaScript API provides a method post() for printing to the Max window. Let's make a simple "Hello World" program to try it out. Enter the following into Max's JavaScript editor, and save it to run it:

```javascript
post("Hello World!");
```

Over in the Max Window, you should see: Hello World! So far so good. But, as you'll see, the post() method isn't the best for logging. What if we print something multiple times? Enter this code and save again to run the updated script:

```javascript
post("Hello World!");
post("Goodbye World!");
```

All this text appears on one line in the Max window. This can be useful, but we'll usually want a logger to print each message on its own line. We can do this by appending a newline ("\n") to each message we post(), like this:

```javascript
post("Hello World!\n");
post("Goodbye World!\n");
```

## Introducing log()

We don't want to have to manually type "\n" all the time, so we can create a logging function that will do it for us:

```javascript
function log(message) {
  post(message);
  post("\n");
}

log("Hello World!");
log("Goodbye World!");
```

Easy enough. What about logging objects that aren't strings?

```javascript
function log(message) {
  post(message);
  post("\n");
}

log( new Date() );
```

That will print something like `jsobject -1266632764615976`, which is not particularly useful. To address this, we can call toString() on the message parameter:

```javascript
function log(message) {
  post(message.toString());
  post("\n");
}

log( new Date() );
```

Now this outputs something like `Mon Apr 21 2014 19:29:07 GMT-0700 (PDT)`. Much better!

Note that if we design some custom classes in our scripts, we can give them a toString() method to make them show whatever we want when logging. We'll see an example near the end of this article.

## A more robust log()

We've introduced a bug. What happens if we run this?

```javascript
function log(message) {
  post(message.toString());
  post("\n");
}

log( null );
```

We get an error: `Javascript TypeError: message is null, line 2`. We have to be more careful. A simple check avoids the bug:

```javascript
function log(message) {
  if(message && message.toString) {
    post(message.toString());
  }
  else {
    post(message);
  }
  post("\n");
}

log( new Date() );
log( null );
```

In other words, if the message isn't null/undefined, and it has a toString() method, then call its toString(). Now there's no error, but the log( null ) is printing `jsobject -1266632764615976`. Let's fix that:

```javascript
function log(message) {
  if(message && message.toString) {
    post(message.toString());
  }
  else if(message === null) {
    post("<null>");
  }
  else {
    post(message);
  }
  post("\n");
}

log( new Date() );
log( null );
log( {}['non-existent-property'] );
```

Why the triple === in the comparison with null? If we just used double ==, it allows for automatic type conversions, which can cause some confusion. <undefined> values (such as {key:'value'}['non-existent-key']) are == null, but are not === null. So we can distinguish between null and undefined values by using ===, which can be helpful when debugging.

## Logging objects as JSON

We haven't covered every edge case yet. Most objects don't log in a reasonable way:

```javascript
function log(message) {
  if(message && message.toString) {
    post(message.toString());
  }
  else if(message === null) {
    post("<null>");
  }
  else {
    post(message);
  }
  post("\n");
}

log( {myObject:123} );
```

This prints `[object Object]`. Thankfully, we can use built-in JSON functions to easily log something useful:

```javascript
function log(message) {
  if(message && message.toString) {
    var s = message.toString();
    if(s == "[object Object]") {
      s = JSON.stringify(message);
    }
    post(s);
  }
  else if(message === null) {
    post("<null>");
  }
  else {
    post(message);
  }
  post("\n");
}

log( {myObject:123} );
```

This prints `{"myObject":123}`. Cool, now we log data structures. Unfortunately, it's more complicated with nested data structures. Try this:

```javascript
log( [1,{key:'value'},3] );
```

That logs `1,[object Object],3`. We need a better solution. JavaScript documentation indicates:

> the toString() method is inherited by every object descended from Object. If this method is not overridden in a custom object, toString() returns "[object type]", where type is the object type.

Ok... Besides [object Object], we might see things like [object SomeType]. Let's convert an object to JSON when we see "[object " anywhere in its toString() value:

```javascript
function log(message) {
  if(message && message.toString) {
    var s = message.toString();
    if(s.indexOf("[object ") >= 0) {
      s = JSON.stringify(message);
    }
    post(s);
  }
  else if(message === null) {
    post("<null>");
  }
  else {
    post(message);
  }
  post("\n");
}

log( {myObject:123} );
log( [1,{key:'value'},3] );
log( [1,2,3] );
```

This outputs:
```
{"myObject":123}
[1,{"key":"value"},3]
1,2,3
```

It's inconsistent that `log( [1,2,3] );` outputs `1,2,3` instead of `[1,2,3]`. We could handle that case too (such as with an `if(message instanceof Array)` check). As you can see, it's difficult to make a comprehensive logging function, and we could waste a lot of time trying to make this "perfect". At this point, I say "good enough" and move on, so we can start hacking on Live soon.

## Can't we simplify?

A simpler implementation of log() wouldn't even bother with toString() and would blindly call JSON.stringify(message) on everything. That's certainly a viable approach and a lot simpler than what we've built here. I have tried writing log() that way...

There's a few problems with that approach.

Some objects, like Date, have a nice toString() representation like `Sat Apr 26 2014 11:49:42 GMT-0700 (PDT)`. If we call JSON.stringify() on Date, we get a less readable format `"2014-04-26T18:49:42.694Z"`. You'll find many oddities like that, and to address them you'd need to handle various special cases like in our current log() implementation.

Also, when we start making custom classes and we want to print them out, it conceptually makes more sense to provide a toString() method than it does to provide a toJSON() method (which might not even convert to valid JSON because we're just trying to print some debugging info).

For these reason, I prefer toString() over toJSON() in our log() function. I've tried to keep the special cases to a minimum.

## Multiple parameters

One more tweak and then we're done building our log() function. Let's enhance log() to support a variable number of arguments. This is a small convenience that will allow us to do things like log(x, y, z) instead of log("" + x + y + z)

In javascript, every function call has access to an arguments array that contains the values of all the parameters passed to the function. So we can loop over that and apply the same logic as before. Here is the final version:

```javascript
function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}

log("___________________________________________________");
log("Reload:", new Date);
```

What's with the last 2 lines? I like to show a divider line and the current time every time I re-run the script. It helps keep track of different runs of the JavaScript program while you are working on the code and saving/re-running repeatedly. Pro-tip: you can also clear the Max window at any time.

Note the final "\n" is outside the loop. This has the effect of joining all the arguments with a space and printing them together on one line.

Let's test it out. Add the following lines to the end of the script:

```javascript
log( 123, 1.23, 'some text' );
log( null, {}['nothing here'] );

log( 1,2,3 ); 
log( [1,2,3] );
log( [1,{A:2},3] );
log( {key:{nestedKey:[1,2,3]}, anotherKey:'value'} );
 
// Example of a custom class with a toString() method
MyClass = function(value) {
  this.value = value;
  this.toString = function() {
    return 'MyClass(value=' + this.value + ')';
  }
}
log( new MyClass(123) );
```

Which prints this in the Max window:
```
___________________________________________________
Reload:  Sat Apr 26 2014 12:05:55 GMT-0700 (PDT)
123  1.23  some text
<null>  <undefined>
1  2  3
1,2,3
[1,{"A":2},3]
{"key":{"nestedKey":[1,2,3]},"anotherKey":"value"}
MyClass(value=123)
```

## Wrapping up

We just wrote some general-purpose utility code that's useful in any project. I tend to paste this into the top of all my Live JS projects when I'm setting them up.

One last tip. I've done a lot of web development, and I've been conditioned to type console.log() to log messages in the web browser and on Node.js. I got tired of accidentally typing that in my Max projects, so I added this line of code:

```javascript
console = {log: log}
```

This way, either log() or console.log() will work. Those of you with a web development background may appreciate this trick.

## Next Steps

Now you're prepared to start using the Live API to extend Live's functionality with your own JavaScript programs. The next article in the series explores the basics of using the Live API.

