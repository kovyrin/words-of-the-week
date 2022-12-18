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

  if french.match?(/péj\W/) || english.match?(/pej\W/)
    next
  end

  french.gsub!('(qc.)', '')
  french.gsub!('(qn./qc.)', '')
  french.gsub!(/^\([^\)]*\)/, '')
  french.gsub!(/^[^A-zÀ-ú0-9]*/, '')

  puts "Analyzing #{french.inspect}..."
  if french.match(/{(f|m|f.pl|m.pl)}/) # nouns
    parts = french.split(/{[^}]+}/)
    if parts.count > 1
      puts "Skipping #{french.inspect} because it has multiple parts"
      next
    end
    french = parts.first.strip
  elsif french.match(/ q[cn]/) # verbs
    french = french.split(/ q[cn]/).first
  elsif french.include?('[')
    french = french.split('[').first
  end

  french.gsub!(/[^A-zÀ-ú0-9]*$/, '')
  french.strip!

  english.gsub!(/\[\w+\.\]/, '')
  english.strip!
  english.gsub!('{pl}', '')
  english.gsub!('[female]', '')
  english.gsub!('[male]', '')
  english.gsub!('[female person]', '')
  english.gsub!('[male person]', '')
  english.gsub!(/ (sb\.|sth\.|sb\.\/sth\.)$/, '')
  english.gsub!(/\s+/, ' ')
  english.strip!

  if french.split(' ').count > 4
    puts "Skipping #{french.inspect} because it has too many words"
    next
  end
  puts "Adding #{french.inspect} => #{english.inspect}"
  dictionary[french] << english
end

puts "Writing #{json_file}..."
File.open(json_file, 'w') do |f|
  f.write(JSON.pretty_generate(dictionary))
end
