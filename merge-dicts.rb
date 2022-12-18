#!/usr/bin/env ruby

require 'json'
require 'csv'
require 'pry'

class MergedDict
  attr_reader :dict, :en_bad_words, :fr_bad_words

  def initialize(en_bad_words, fr_bad_words)
    @en_bad_words = en_bad_words
    @fr_bad_words = fr_bad_words
    @dict = Hash.new { |h, k| h[k] = [] }
  end

  def add(word, translations, only_if_not_present: false)
    return if word.empty?
    word = word.downcase
    return if only_if_not_present && dict[word].any?
    dict[word] += Array(translations)
  end

  def includes_bad_words?(word)
    return false unless word
    return true if word.match?('sex')
    word_terms = word.split(/[^A-zÀ-ú0-9]+/)
    (word_terms & fr_bad_words).any? || (word_terms & en_bad_words).any?
  end

  def remove_words(words)
    dict.delete_if do |word, translations|
      includes_bad_words?(word)
    end

    dict.each do |word, translations|
      translations.reject! do |t|
        includes_bad_words?(t)
      end
    end
  end

  def compact
    compact_dict = {}
    dict.keys.sort.each do |word|
      compacted = dict[word].compact.uniq.sort_by!(&:length)
      compacted.reject! { |t| t.split(' ').count > 4 || t.length > 20 }
      next if compacted.empty?
      compact_dict[word] = compacted[0..4]
    end
    return compact_dict
  end
end

# Merge both dicts, keeping only the 5 shortest translations for each word
apertium_dict = JSON.parse(File.read('dicts/apertium-fra-eng.fra-eng.json'))
dictcc_dict = JSON.parse(File.read('dicts/dict.cc.fr-en.json'))
top1000_dict = CSV.read('dicts/top-1000.csv', col_sep: ',', headers: true)
top5000_dict = CSV.read('dicts/5000_wordlist_french.csv', col_sep: ',', headers: true)

# Load the list of known bad words
bad_words_en = File.readlines('dicts/bad-words.txt').map(&:downcase).map(&:strip).uniq.reject(&:empty?)
bad_words_fr = File.readlines('dicts/french-swear-words.txt').map(&:downcase).map(&:strip).uniq.reject(&:empty?)

dict = MergedDict.new(bad_words_en, bad_words_fr)
dictcc_dict.each do |word, translations|
  dict.add(word, translations)
end

top1000_dict.each do |row|
  dict.add(row['French'], row['English'])
end

top_words = []
top5000_dict.each do |row|
  translations = row['word_en'].split(',').map(&:strip)
  dict.add(row['word_fr'], translations)
  top_words << row['word_fr'] unless dict.includes_bad_words?(row['word_fr'])
end

# The quality of the apertium dict is not great, so we only add words that are not already present
apertium_dict.each do |word, translations|
  dict.add(word, translations, only_if_not_present: true)
end

# Remove bad words
dict.remove_words(bad_words_en)
dict.remove_words(bad_words_fr)

# Write the merged dict to a file
File.open('src/fra-eng.json', 'w') do |f|
  f.write(JSON.pretty_generate(dict.compact))
end

# Write the top 5000 words to a file
File.open('src/top-5000.json', 'w') do |f|
  f.write(JSON.pretty_generate(top_words))
end
