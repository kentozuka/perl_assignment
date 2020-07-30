#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $testing_string = 'https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=210CM20100012020210CM2010021&pLng=en';
my $testing_html = qx(curl $testing_string);

my $dom = XML::LibXML->load_xml(string => $testing_html);

foreach my $title ($dom->findnodes('//th[text()="Course Outline"]/following-sibling::td')) {
    say $title->to_literal();
}

# use XML::XPath;
# use XML::XPath::XMLParser;

# my $testing_string = 'https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=210CM20100012020210CM2010021&pLng=en';
# my $testing_html = qx(curl $testing_string);

# my $xp = XML::XPath->new(xml => $testing_html);
# my $aa = $xp->getNodeText('//th[text()="Course Outline"]/following-sibling::td');

# print "$aa";

# # defining paths
# my $path_one = './famaf_corpus/females_ask_males.xml';
# my $path_two = './famaf_corpus/males_ask_females.xml';
# my $res_one = "./outputs/fam.txt";
# my $res_two = "./outputs/maf.txt";

# # opening files
# open (ONE, "< $path_one");
# open (TWO, "< $path_two");

# # defining result files
# open (ONE_RES, ">", $res_one);
# open (TWO_RES, ">", $res_two);

# # defining counters
# my $one_cnt = 1;
# my $two_cnt = 1;
# my $one_wrd = 0;
# my $two_wrd = 0;
# my $one_counting = 0;
# my $two_counting = 0;

# # array for keep track of threads id
# my %one_obj;
# my %two_obj;

# # rading files
# while (my $line = <ONE>) {
#   chomp($line);
#   # creating objects/dictionary/hashkeys or whatever this is from body tag
#   if ($line =~ /<body>/) {
#     $one_counting = 1;
#   } elsif ($line =~ /<\/body>/ && $one_counting) {
#     $one_counting = 0;
#   } elsif ($one_counting) {
#     # counting total word length
#     my $len = length $line;
#     if ($len > 1) {
#     my @spld = split(/ /, $line);
#     my $spld_len = @spld;
#     $one_wrd += $spld_len;
#     # doing something
#     foreach (@spld) {
#       # should regex [. , " ? ] but...
#       $one_obj{$_} ++;
#       }
#     }
    
#   }
#   $one_cnt += 1
# }

# foreach $word (sort { $one_obj{$b} <=> $one_obj{$a} } keys %one_obj) {
#   my $rel_freq = ($one_obj{$word} / $one_cnt) * 100;
#   print ONE_RES "$word: $rel_freq%\n";
# }

# # rading files
# while (my $line = <TWO>) {
#   chomp($line);
#   # creating objects/dictionary/hashkeys or whatever this is from body tag
#   if ($line =~ /<body>/) {
#     $two_counting = 1;
#   } elsif ($line =~ /<\/body>/ && $two_counting) {
#     $two_counting = 0;
#   } elsif ($two_counting) {
#     # counting total word length
#     my $len = length $line;
#     if ($len > 1) {
#     my @spld = split(/ /, $line);
#     my $spld_len = @spld;
#     $two_wrd += $spld_len;
#     # doing something
#     foreach (@spld) {
#       # should regex [. , " ? ] but...
#       $two_obj{$_} ++;
#       }
#     }
    
#   }
#   $two_cnt += 1
# }

# foreach $word (sort { $two_obj{$b} <=> $two_obj{$a} } keys %two_obj) {
#   my $rel_freq = ($two_obj{$word} / $two_cnt) * 100;
#   print TWO_RES "$word: $rel_freq%\n";
# }

