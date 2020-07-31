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
