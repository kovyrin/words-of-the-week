#!/usr/bin/env ruby

require 'json'
require "rexml/document"

xml_file = 'dicts/apertium-fra-eng.fra-eng.xml'
json_file = 'dicts/apertium-fra-eng.fra-eng.json'

puts "Loading #{xml_file}..."
xmldoc = REXML::Document.new(File.new(xml_file))

dictionary = {}
xmldoc.elements.each('//dictionary/section/e/p') do |p|
  left = p.elements['l'].text
  right = p.elements['r'].text
  right = '[personal pronoun]' if right == 'prpers'
  puts "Mapping #{left} to #{right}"
  dictionary[left] = [*dictionary[left], right].uniq
end

puts "Writing #{json_file}..."
File.open(json_file, 'w') do |f|
  f.write(JSON.pretty_generate(dictionary))
end
