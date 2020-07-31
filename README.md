## What is this project?
This is a Perl assignment for spring 2020 (covid year)

### How to run this project
This project runs on Node.js and perl.
1. Clone or download this project
1. Download node.js if necessary
1. run ```npm install``` (this will install all the dependencies needed)
1. run ```node app```
1. Done!

### List of dependencies used for this project
*  axios (for making http request)
* libxmkjs (for parsing html and finding elements with XPath)
* puppeteer (for getting keys, puppeteer is a library for controlling headless chrome) 

### Why node.js
I initially used xpath library for perl, but it was full of bugs and was too slow to scrape over 600 pages. So, I decided to shift the weight of parsing data to the language I am most familiar with, JavaScript, and used perl for counting the result. I could've use python here, but as it turns out using libxmkjs was much faster since it runs on C, so I decided to go for all node base.

## How this works
### How to get keys

1. Go to [Syllabus Search page](https://www.wsl.waseda.jp/syllabus/JAA101.php)
1. Search for SILS, Spring term
1. Open devtool (command + option + j)
1. Paste the code below to the console
```javascript
// Showing all the results
func_showchg('JAA103SubCon', '500')

// after all the 418 results are shown up
const tt = document.querySelectorAll('td > a') // getting all elements
const aa = []
tt.forEach(e => aa.push(e.getAttribute(‘onclick’))) 
const keys = aa.map(x => x.split(‘\’’)[3]) // extracting the key
copy(keys) // copying the keys array
```

## How I extracted the data
1. Goto https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=jp
(change ${key} to one of the key in the keys array)
1. Using XPath, we can extract Course Outline
