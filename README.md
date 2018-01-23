Creole Forth for JavaScript
---------------------------

Intro
-----

This is a Forth-like scripting language built in JavaScript. iT is similar in design to Creole
Forth for Delphi and Excel, which are also in my Github repositories. It can be run in a browser
either on your local file system or from a web server. 

Methodology
-----------
Primitives are defined as JavaScript functions (methods) attached to objects. They are roughly analagous to
core words defined in assembly language in some Forth compilers. They are then passed to the BuildPrimitive
method in the CreoleForthBundle object, which assigns them a name, vocabulary, and integer token value, which
is used as an address. 

High-level or colon definitions are assemblages of primitives and previously defined high-level definitions.
They are defined by the colon compiler. 


How to run an already-defined command
-------------------------------------

1. Open up cfpage.html. 

2. Type the command "HELLO" (no quotes) in the Input text area.

3. Hit the submit button. An alert saying "Hello World" should come up. 

4. If you're feeling adventurous, put 3 4 + in the input area, type the "=" command, and hit Submit. 
   A 7 will appear on the stack. You can also put numbers directly on the stack. 

5. The bottom of the CreoleForth.js source file has the list of definitions already set up with BuildPrimitive.


Defining your own commands with the colon compiler
-------------------------------------------------

1. Type or paste the following into the input textarea in cfpage.html.
 
   : TEST1 IF HELLO ELSE TULIP THEN ;
   
2. Hit the Submit button.

3. An alert box will come up saying "Compilation is complete".

4. Erase the code you put in previously and then type the following below:
   
   1 TEST1
   
   The alert box "Hello World" should come up.

5. Now put in the following :

   0 TEST1
   
   The alert box "Tulip" should come up. 