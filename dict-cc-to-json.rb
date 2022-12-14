#!/usr/bin/env ruby

require 'json'
require 'CSV'

# This file contains the French-English dictionary from dict.cc
# Fields: French, English, naming word, comments
# There is a null record separating the header from the dataset.

cc_dict_file = "dicts/dict.cc.fr-en.tab"
json_file = "dicts/dict.cc.fr-en.json"

dictionary = Hash.new { |h, k| h[k] = [] }

data_started = false
CSV.foreach(cc_dict_file, col_sep: "\t", headers: false) do |row|
  french = row[0]
  english = row[1]

  if !english
    data_started = true
    next
  end

  next unless data_started

  french.gsub!(/^\([^\)]*\)/, '')
  french.gsub!(/^[^A-zÀ-ú0-9]*/, '')

  if french.match(/{(f|m|f.pl|m.pl)}/) # nouns
    french = french.split('{').first
  elsif french.match(/ q[cn]/) # verbs
    french = french.split(/ q[cn]/).first
  elsif french.include?('[')
    french = french.split('[').first
  end

  french.gsub!(/[^A-zÀ-ú0-9]*$/, '')
  french.gsub!('(qc.)', '')
  french.gsub!('(qn./qc.)', '')

  dictionary[french.strip] << english.strip
end

puts "Writing #{json_file}..."
File.open(json_file, 'w') do |f|
  f.write(JSON.pretty_generate(dictionary))
end
