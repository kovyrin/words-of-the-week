#!/usr/bin/env ruby

require 'json'
require 'csv'
require 'pry'

class MergedDict
  attr_reader :dict

  def initialize
    @dict = Hash.new { |h, k| h[k] = [] }
  end

  def add(word, translations)
    word = word.downcase
    dict[word] += Array(translations)
  end

  def remove_words(words)
    words.each do |word|
      dict.delete(word)
    end

    dict.each do |word, translations|
      translations.reject! { |t| words.include?(t) }
    end
  end

  def compact
    compact_dict = {}
    dict.each do |word, translations|
      compacted = translations.compact.uniq.sort_by!(&:length)
      compacted.reject! { |t| t.split(' ').count > 4 || t.length > 20 }
      next if compacted.empty?
      compact_dict[word] = compacted[0..4]
    end
    return compact_dict
  end
end

apertium_dict_file = 'dicts/apertium-fra-eng.fra-eng.json'
dictcc_dict_file = 'dicts/dict.cc.fr-en.json'
top1000_dict_file = 'dicts/top-1000.csv'
top5000_dict_file = 'dicts/5000_wordlist_french.csv'
bad_words_file = 'dicts/bad-words.txt'

# Merge both dicts, keeping only the 5 shortest translations for each word
apertium_dict = JSON.parse(File.read(apertium_dict_file))
dictcc_dict = JSON.parse(File.read(dictcc_dict_file))
top1000_dict = CSV.read(top1000_dict_file, col_sep: ',', headers: true)
top5000_dict = CSV.read(top5000_dict_file, col_sep: ',', headers: true)

# Load the list of known bad words
bad_words = File.readlines(bad_words_file).map(&:downcase).map(&:strip)

dict = MergedDict.new
dictcc_dict.each do |word, translations|
  dict.add(word, translations)
end

apertium_dict.each do |word, translations|
  dict.add(word, translations)
end

top1000_dict.each do |row|
  dict.add(row['French'], row['English'])
end

top_words = []
top5000_dict.each do |row|
  translations = row['word_en'].split(',').map(&:strip)
  dict.add(row['word_fr'], translations)
  top_words << row['word_fr']
end

# Remove bad words
dict.remove_words(bad_words)

# Write the merged dict to a file
File.open('src/fra-eng.json', 'w') do |f|
  f.write(JSON.pretty_generate(dict.compact))
end

# Write the top 5000 words to a file
File.open('src/top-5000.json', 'w') do |f|
  f.write(JSON.pretty_generate(top_words))
end
