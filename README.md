## What is this project?
This is a Perl assignment for spring 2020 (covid year). This program will search all the course outlines of SILS classes thats on [waseda's official syllabus search system](https://www.wsl.waseda.jp/syllabus/JAA101.php), then count how many times a certain word showed up in it and saves the result in result.txt.

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
### Getting keys
Every single classes on the syllabus system has a unique key that seems like a combination of course key and date that the class was posted onto the system. (eg, 210CM20100012020210CM2010021 -> 210CM20100[key] 01[month] 2020[year] 210CM20100[key] 21[date]). If I have this key, I don't have to search every single time like everyone else is doing. Instead, I can get data of a specific class by accessing syllabus like this. https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=jp \
\
So, the first thing I did was to get the keys from the search result. I quickly find out that I can actually show more than 100 results at a time by running the code below in the console.
```javascript
func_showchg('JAA103SubCon', '500')
```
With this, I can get all the keys in just one go. Below is the code that's responsible for getting and parsing the keys.
```javascript
// key can be found in the anchor tag
const aa = await page.$$eval('td > a', li => li.map(x => x.getAttribute('onclick')))
const keys = aa.map(x => x.split('\'')[3])
```

### Getting the Course Outlines
To extract the course outline I used libxmkjs. After sending get request with axios, I searched for the course outline with XPath. I've replaced all the \n s so that manipulating with perl will be easier. Below is the code that's extracting the text.
```javascript
const url = `https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=en`
const xml = await axios.get(url)
const xmlDoc = libxmljs.parseHtml(xml.data)
const co = xmlDoc.get('//th[text()="Course Outline"]/following-sibling::td')
const text = co.text()
const lines = text.replace(/\n/g, '')
```

### Counting the occurrence
After running the node code, it will automatically run perl main.pl. This perl code simply loops through all the files that the previous code created for us, and create the result file and word_list file.
```perl
#!/usr/bin/perl

open (WORD_LIST, ">", 'raw_word_list.txt');
open (RESULT, ">", "result.txt");

my $word_counter = 0;
my %dictionary;

print "Starting the perl.\n";
opendir my $dir, "./src" or die "Cannot open directory: $!";
my @files = readdir $dir;
foreach my $file (@files) {
    open(F, '<', "./src/$file") or die $!;
    while(<F>){
        my @spld = split(/ /, $_);
        foreach (@spld) {
            if ($_ =~ /[a-z]/i) {
                my $word = $_ =~ s/,|\.|\?|\!|\(|\)|）|（|'|’|"|”|“//gr;
                $word = lc $word;
                $dictionary{$word}++;
                $word_counter += 1;
                print WORD_LIST "$word\n";
            }
        }
    }
    close(F);
}
foreach my $str (sort { $dictionary{$b} <=> $dictionary{$a} } keys %dictionary) {
    printf RESULT "%-31s %s\n", $str, $dictionary{$str};
}
print "Done. Found $word_counter words\n";
close(WORD_LIST);
close(RESULT);
closedir $dir;
```
