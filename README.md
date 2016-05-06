# stringifying-test-server
This server is built to test the amount of time it takes to stringify and parse large json objects

# Routes #

####/req####
```
Stringifies the req (Only partially, since it's circular) and reports the time taken
```

####/diy####
```
Let's you play around with the factor and depth with the query variables to see how they can affect time
```
<table>
  <tr>
    <td>factor</td>
    <td> 10^factor properties will be added to the object (up to 4).  If 3 or more, a random number of properties between 10^(factor-1) and 10^factor will be added</td>
  </tr>
  <tr>
    <td>depth</td>
    <td>The number of levels of sub-objects to be added to the project</td>
  </tr>
  <tr>
    <td>random</td>
    <td>If true, a random number of properties between 10^(factor-1) and 10^factor will be added</td>
  </tr>
</table>

####/index####
```
Runs the test with Factor=2, depth=2, and random set to true
```
