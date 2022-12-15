#!/usr/bin/env ruby

require 'json'

apertium_dict_file = 'dicts/apertium-fra-eng.fra-eng.json'
dictcc_dict_file = 'dicts/dict.cc.fr-en.json'

# Merge both dicts, keeping only the 5 shortest translations for each word
apertium_dict = JSON.parse(File.read(apertium_dict_file))
dictcc_dict = JSON.parse(File.read(dictcc_dict_file))

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

# Write the merged dict to a file
File.open('src/fra-eng.json', 'w') do |f|
  f.write(JSON.pretty_generate(dict))
end
