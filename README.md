# stringifying-test-server
This server is built to test the amount of time it takes to stringify and parse large json objects

Routes

/req
Stringifies the req (Only partially, since it's circular) and reports the time taken

/diy
Parameters
* factor - 10^factor properties will be added to the object (up to 4).  If 3 or more, a random number of properties between 10^(factor-1) and 10^factor will be added
* depth - The number of levels of sub-objects to be added to the project 
* random - If true, a random number of properties between 10^(factor-1) and 10^factor will be added

/index
Runs the test with Factor=2, depth=2, and random set to true
