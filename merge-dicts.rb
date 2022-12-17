#!/usr/bin/env ruby

require 'json'
require 'csv'
require 'pry'

apertium_dict_file = 'dicts/apertium-fra-eng.fra-eng.json'
dictcc_dict_file = 'dicts/dict.cc.fr-en.json'
top1000_dict_file = 'dicts/top-1000.csv'
top5000_dict_file = 'dicts/5000_wordlist_french.csv'

# Merge both dicts, keeping only the 5 shortest translations for each word
apertium_dict = JSON.parse(File.read(apertium_dict_file))
dictcc_dict = JSON.parse(File.read(dictcc_dict_file))
top1000_dict = CSV.read(top1000_dict_file, col_sep: ',', headers: true)
top5000_dict = CSV.read(top5000_dict_file, col_sep: ',', headers: true)

dict = {}
dictcc_dict.each do |word, translations|
  word = word.downcase

  dict[word] = translations
  if apertium_dict[word]
    dict[word] += apertium_dict[word]
    dict[word].compact!
    dict[word].uniq!
    dict[word].sort_by!(&:length)
  end

  dict[word] = dict[word][0..4]
end

apertium_dict.each do |word, translations|
  word = word.downcase

  unless dict[word]
    dict[word] = translations
    dict[word].compact!
    dict[word].uniq!
    dict[word].sort_by!(&:length)
  end

  dict[word] = dict[word][0..4]
end

top1000_dict.each do |row|
  word = row['French'].downcase

  unless dict[word]
    dict[word] = []
  end

  dict[word] << row['English']
  dict[word].compact!
  dict[word].uniq!
  dict[word].sort_by!(&:length)
  dict[word] = dict[word][0..4]
end

top5000_dict.each do |row|
  word = row['word_fr'].downcase

  unless dict[word]
    dict[word] = []
  end

  dict[word] += row['word_en'].split(',').map(&:strip)
  dict[word].compact!
  dict[word].uniq!
  dict[word].sort_by!(&:length)
  dict[word] = dict[word][0..4]
end

# Write the merged dict to a file
File.open('src/fra-eng.json', 'w') do |f|
  f.write(JSON.pretty_generate(dict))
end
